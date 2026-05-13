/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 Floodilka Contributors
 */

import http from 'node:http';
import https from 'node:https';
import {URL} from 'node:url';

const PROXY_PREFIXES = ['/api/', '/api?', '/media/', '/media?', '/pulse'];

function shouldProxy(pathname) {
	return pathname === '/api' || pathname === '/media' || PROXY_PREFIXES.some((p) => pathname.startsWith(p));
}

function stripCookieDomain(value) {
	const arr = Array.isArray(value) ? value : [value];
	return arr.map((c) =>
		c
			.replace(/;\s*Domain=[^;]*/gi, '')
			.replace(/;\s*Secure/gi, '')
			.replace(/;\s*SameSite=None/gi, '; SameSite=Lax'),
	);
}

function rewriteInstanceBody(buf, localOrigin) {
	try {
		const parsed = JSON.parse(buf.toString('utf-8'));
		const ep = parsed.endpoints;
		if (ep) {
			if (ep.api) ep.api = `${localOrigin}/api`;
			if (ep.api_client) ep.api_client = `${localOrigin}/api`;
			if (ep.api_public) ep.api_public = `${localOrigin}/api`;
			if (ep.media) ep.media = `${localOrigin}/media`;
		}
		return Buffer.from(JSON.stringify(parsed), 'utf-8');
	} catch {
		return buf;
	}
}

export function createProdApiProxy({upstream, localOrigin}) {
	const upstreamUrl = new URL(upstream);
	const upstreamOrigin = `${upstreamUrl.protocol}//${upstreamUrl.host}`;
	const reqLib = upstreamUrl.protocol === 'https:' ? https : http;
	const upstreamPort = upstreamUrl.port || (upstreamUrl.protocol === 'https:' ? 443 : 80);

	return function prodApiProxy(req, res, next) {
		const url = new URL(req.url, localOrigin);
		if (!shouldProxy(url.pathname)) {
			next();
			return;
		}

		const isInstance = url.pathname === '/api/instance';
		const target = new URL(req.url, upstreamOrigin);
		const headers = {...req.headers};
		headers.host = upstreamUrl.host;
		headers.origin = upstreamOrigin;
		if (headers.referer) headers.referer = headers.referer.replace(localOrigin, upstreamOrigin);
		if (isInstance) headers['accept-encoding'] = 'identity';

		const upstreamReq = reqLib.request(
			{
				method: req.method,
				hostname: upstreamUrl.hostname,
				port: upstreamPort,
				path: target.pathname + target.search,
				headers,
				servername: upstreamUrl.hostname,
			},
			(upstreamRes) => {
				const respHeaders = {...upstreamRes.headers};
				if (respHeaders['set-cookie']) {
					respHeaders['set-cookie'] = stripCookieDomain(respHeaders['set-cookie']);
				}
				delete respHeaders['access-control-allow-origin'];
				delete respHeaders['access-control-allow-credentials'];

				if (isInstance && upstreamRes.statusCode === 200) {
					const chunks = [];
					upstreamRes.on('data', (c) => chunks.push(c));
					upstreamRes.on('end', () => {
						const buf = rewriteInstanceBody(Buffer.concat(chunks), localOrigin);
						delete respHeaders['content-encoding'];
						respHeaders['content-length'] = String(buf.length);
						res.writeHead(upstreamRes.statusCode, respHeaders);
						res.end(buf);
					});
					upstreamRes.on('error', (err) => {
						if (!res.headersSent) res.writeHead(502);
						res.end(`upstream stream error: ${err.message}`);
					});
				} else {
					res.writeHead(upstreamRes.statusCode, respHeaders);
					upstreamRes.pipe(res);
				}
			},
		);

		upstreamReq.on('error', (err) => {
			if (!res.headersSent) res.writeHead(502, {'content-type': 'text/plain; charset=utf-8'});
			res.end(`upstream error: ${err.message}`);
		});

		req.pipe(upstreamReq);
	};
}

/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

use ruzstd::StreamingDecoder;
use std::io::{Cursor, Read};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn decompress_zstd_frame(input: &[u8]) -> Result<Box<[u8]>, JsValue> {
    let mut decoder = StreamingDecoder::new(Cursor::new(input))
        .map_err(|e| JsValue::from_str(&format!("zstd init error: {e}")))?;

    let mut output = Vec::new();
    decoder
        .read_to_end(&mut output)
        .map_err(|e| JsValue::from_str(&format!("zstd read error: {e}")))?;

    Ok(output.into_boxed_slice())
}

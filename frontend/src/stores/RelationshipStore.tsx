/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {RelationshipTypes} from '~/Constants';
import {type Relationship, RelationshipRecord} from '~/records/RelationshipRecord';

class RelationshipStore {
	relationships: Record<string, RelationshipRecord> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	loadRelationships(relationships: ReadonlyArray<Relationship>): void {
		const newRelationships: Record<string, RelationshipRecord> = {};

		for (const relationship of relationships) {
			newRelationships[relationship.id] = new RelationshipRecord(relationship);
		}

		this.relationships = newRelationships;
	}

	updateRelationship(relationship: Relationship): void {
		const existingRelationship = this.relationships[relationship.id];

		if (existingRelationship) {
			this.relationships = {
				...this.relationships,
				[relationship.id]: existingRelationship.withUpdates(relationship),
			};
		} else {
			this.relationships = {
				...this.relationships,
				[relationship.id]: new RelationshipRecord(relationship),
			};
		}
	}

	removeRelationship(relationshipId: string): void {
		const {[relationshipId]: _, ...remainingRelationships} = this.relationships;
		this.relationships = remainingRelationships;
	}

	getRelationship(relationshipId: string): RelationshipRecord | undefined {
		return this.relationships[relationshipId];
	}

	getRelationships(): ReadonlyArray<RelationshipRecord> {
		return Object.values(this.relationships);
	}

	isBlocked(userId: string): boolean {
		const relationship = this.relationships[userId];
		return relationship?.type === RelationshipTypes.BLOCKED;
	}
}

export default new RelationshipStore();

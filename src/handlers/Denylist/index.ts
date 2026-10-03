import type { CountResponse } from "../../types"
import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type {
	DeletedDenylistEntry,
	DenylistCreateType,
	DenylistEntry,
	DenylistType,
	Denylists
} from "./types"

export class Denylist extends BaseHandler {
	async getDenylists(guildId: string) {
		return this._handler.request<Denylists>(
			`/${encodeURIComponent(guildId)}/denylist`
		)
	}

	async createDenylist(
		guildId: string,
		data: { type: DenylistCreateType; id: string }
	) {
		return this._handler.request<DenylistEntry>(
			`/${encodeURIComponent(guildId)}/denylist`,
			"POST",
			{},
			data
		)
	}

	async deleteAllDenylists(guildId: string) {
		return this._handler.request<CountResponse>(
			`/${encodeURIComponent(guildId)}/denylist`,
			"DELETE"
		)
	}

	async deleteAllDenylistsByType(guildId: string, type: DenylistType) {
		return this._handler.request<CountResponse>(
			`/${encodeURIComponent(guildId)}/denylist/type/${encodeURIComponent(type)}`,
			"DELETE"
		)
	}

	async deleteDenylistById(guildId: string, type: DenylistType, id: string) {
		return this._handler.request<DeletedDenylistEntry>(
			`/${encodeURIComponent(guildId)}/denylist/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
			"DELETE"
		)
	}
}

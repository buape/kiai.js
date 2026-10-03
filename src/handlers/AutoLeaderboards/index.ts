import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type { AutoLeaderboard, CreateAutoLeaderboard } from "./types"

export class AutoLeaderboards extends BaseHandler {
	async getAutoLeaderboards(guildId: string) {
		return this._handler.request<AutoLeaderboard[]>(
			`/${encodeURIComponent(guildId)}/auto-leaderboards`
		)
	}

	async createAutoLeaderboard(guildId: string, data: CreateAutoLeaderboard) {
		return this._handler.request<AutoLeaderboard>(
			`/${encodeURIComponent(guildId)}/auto-leaderboards`,
			"POST",
			{},
			data
		)
	}

	async getAutoLeaderboard(guildId: string, id: string) {
		return this._handler.request<AutoLeaderboard>(
			`/${encodeURIComponent(guildId)}/auto-leaderboards/${encodeURIComponent(id)}`
		)
	}

	async deleteAutoLeaderboard(guildId: string, id: string) {
		return this._handler.request<AutoLeaderboard>(
			`/${encodeURIComponent(guildId)}/auto-leaderboards/${encodeURIComponent(id)}`,
			"DELETE"
		)
	}
}

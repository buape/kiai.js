import type { CountResponse, SuccessResponse } from "../../types"
import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type { LeaderboardRole, SyncLeaderboardRolesResponse } from "./types"

export class LeaderboardRoles extends BaseHandler {
	async getLeaderboardRoles(guildId: string) {
		return this._handler.request<LeaderboardRole[]>(
			`/${encodeURIComponent(guildId)}/leaderboard-roles`
		)
	}

	async createLeaderboardRole(
		guildId: string,
		data: Pick<LeaderboardRole, "roleId" | "type" | "time">
	) {
		return this._handler.request<SuccessResponse>(
			`/${encodeURIComponent(guildId)}/leaderboard-roles`,
			"POST",
			{},
			data
		)
	}

	async clearLeaderboardRoles(guildId: string) {
		return this._handler.request<CountResponse>(
			`/${encodeURIComponent(guildId)}/leaderboard-roles`,
			"DELETE"
		)
	}

	async syncLeaderboardRoles(guildId: string) {
		return this._handler.request<SyncLeaderboardRolesResponse>(
			`/${encodeURIComponent(guildId)}/leaderboard-roles/sync`,
			"POST"
		)
	}

	async deleteLeaderboardRole(guildId: string, roleId: string) {
		return this._handler.request<SuccessResponse>(
			`/${encodeURIComponent(guildId)}/leaderboard-roles/${encodeURIComponent(roleId)}`,
			"DELETE"
		)
	}
}

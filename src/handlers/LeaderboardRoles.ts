import type { LeaderboardRole, SuccessResponse } from "../types"
import { BaseHandler } from "."

export class LeaderboardRoles extends BaseHandler {
	/**
	 * Get all leaderboard roles for a guild
	 * @param guildId The guild ID to get roles for
	 */
	async getLeaderboardRoles(guildId: string) {
		const result = await this._handler.request<LeaderboardRole[]>(
			`/${guildId}/leaderboard-roles`
		)
		return result
	}

	/**
	 * Create a new leaderboard role
	 * @param guildId The guild ID to create the role in
	 * @param data The role data
	 */
	async createLeaderboardRole(
		guildId: string,
		data: Omit<LeaderboardRole, "id" | "guildId">
	) {
		const result = await this._handler.request<SuccessResponse>(
			`/${guildId}/leaderboard-roles`,
			"POST",
			{},
			data
		)
		return result
	}

	/**
	 * Delete all leaderboard roles for a guild
	 * @param guildId The guild ID to delete roles from
	 * @param roleId The role ID to delete
	 */
	async clearLeaderboardRoles(guildId: string) {
		const result = await this._handler.request<SuccessResponse>(
			`/${guildId}/leaderboard-roles`,
			"DELETE"
		)
		return result
	}

	/**
	 * Delete a specific leaderboard role
	 * @param guildId The guild ID the role is in
	 * @param roleId The role ID to delete
	 */
	async deleteLeaderboardRole(guildId: string, roleId: string) {
		const result = await this._handler.request<SuccessResponse>(
			`/${guildId}/leaderboard-roles/${roleId}`,
			"DELETE"
		)
		return result
	}
}

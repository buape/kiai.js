import type { Leaderboard, LevelData, Message } from "../types"
import { BaseHandler } from "."

export class Leveling extends BaseHandler {
	async getLeaderboard(
		guildId: string,
		start: number | undefined,
		end: number | undefined
	) {
		const result = await this._handler.request<Leaderboard>(
			`/${guildId}/leaderboard${
				start !== undefined
					? `?start=${start}${end !== undefined ? `&end=${end}` : ""}`
					: `${end !== undefined ? `?end=${end}` : ""}`
			}`
		)
		return result
	}

	async getMember(guildId: string, userId: string) {
		const result = await this._handler.request<LevelData>(
			`/${guildId}/member/${userId}`
		)
		return result
	}

	async addXp(guildId: string, userId: string, xp: number) {
		const result = await this._handler.request<Message>(
			`/${guildId}/member/${userId}/xp`,
			"PATCH",
			{},
			{
				xp
			}
		)
		return result
	}

	async removeXp(guildId: string, userId: string, xp: number) {
		const result = await this._handler.request<Message>(
			`/${guildId}/member/${userId}/xp`,
			"PATCH",
			{},
			{
				xp: -xp
			}
		)
		return result
	}

	async setXp(guildId: string, userId: string, xp: number) {
		const result = await this._handler.request<Message>(
			`/${guildId}/member/${userId}/xp`,
			"PUT",
			{},
			{ xp }
		)
		return result
	}
}

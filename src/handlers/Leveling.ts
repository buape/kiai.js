import type { Leaderboard, LevelData, SuccessResponse } from "../types"
import { BaseHandler } from "./BaseHandler"

export class Leveling extends BaseHandler {
	async getLeaderboard(guildId: string, start?: number, end?: number) {
		if (start !== undefined && start < 0) {
			throw new Error("Start parameter must be non-negative")
		}
		if (end !== undefined && end < 0) {
			throw new Error("End parameter must be non-negative")
		}
		if (start !== undefined && end !== undefined && start >= end) {
			throw new Error("Start parameter must be less than end parameter")
		}
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
		if (!Number.isInteger(xp) || xp <= 0) {
			throw new Error("XP must be a positive integer")
		}
		const result = await this._handler.request<SuccessResponse>(
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
		if (!Number.isInteger(xp) || xp <= 0) {
			throw new Error("XP must be a positive integer")
		}
		const result = await this._handler.request<SuccessResponse>(
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
		if (!Number.isInteger(xp) || xp < 0) {
			throw new Error("XP must be a non-negative integer")
		}
		const result = await this._handler.request<SuccessResponse>(
			`/${guildId}/member/${userId}/xp`,
			"PUT",
			{},
			{ xp }
		)
		return result
	}
}

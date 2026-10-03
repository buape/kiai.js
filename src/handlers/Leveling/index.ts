import type { SuccessResponse } from "../../types"
import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type {
	GuildStats,
	Leaderboard,
	LeaderboardOptions,
	LevelData,
	PrestigeResponse
} from "./types"

export class Leveling extends BaseHandler {
	async getLeaderboard(
		guildId: string,
		optionsOrStart?: LeaderboardOptions | number,
		legacyEnd?: number
	) {
		const options =
			typeof optionsOrStart === "number"
				? { start: optionsOrStart, end: legacyEnd }
				: (optionsOrStart ?? (legacyEnd === undefined ? {} : { end: legacyEnd }))
		for (const [name, value] of Object.entries(options)) {
			if (
				value !== undefined &&
				typeof value === "number" &&
				(!Number.isInteger(value) || value < 1)
			) {
				throw new Error(`${name} must be a positive integer`)
			}
		}
		return this._handler.request<Leaderboard>(
			`/${encodeURIComponent(guildId)}/leaderboard`,
			"GET",
			Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined))
		)
	}

	async getMember(guildId: string, userId: string) {
		return this._handler.request<LevelData | null>(
			`/${encodeURIComponent(guildId)}/member/${encodeURIComponent(userId)}`
		)
	}

	async addXp(guildId: string, userId: string, xp: number) {
		if (!Number.isFinite(xp) || xp <= 0 || xp > 100_000_000) {
			throw new Error("XP must be greater than 0 and at most 100000000")
		}
		return this._handler.request<SuccessResponse>(
			`/${encodeURIComponent(guildId)}/member/${encodeURIComponent(userId)}/xp`,
			"PATCH",
			{},
			{ xp }
		)
	}

	async removeXp(guildId: string, userId: string, xp: number) {
		if (!Number.isFinite(xp) || xp <= 0 || xp > 100_000_000) {
			throw new Error("XP must be greater than 0 and at most 100000000")
		}
		return this._handler.request<SuccessResponse>(
			`/${encodeURIComponent(guildId)}/member/${encodeURIComponent(userId)}/xp`,
			"PATCH",
			{},
			{ xp: -xp }
		)
	}

	async setXp(guildId: string, userId: string, xp: number) {
		if (!Number.isFinite(xp) || xp < 0 || xp > 100_000_000) {
			throw new Error("XP must be between 0 and 100000000")
		}
		return this._handler.request<SuccessResponse>(
			`/${encodeURIComponent(guildId)}/member/${encodeURIComponent(userId)}/xp`,
			"PUT",
			{},
			{ xp }
		)
	}

	async prestige(guildId: string, userId: string) {
		return this._handler.request<PrestigeResponse>(
			`/${encodeURIComponent(guildId)}/member/${encodeURIComponent(userId)}/prestige`,
			"POST"
		)
	}

	async getStats(guildId: string) {
		return this._handler.request<GuildStats>(`/${encodeURIComponent(guildId)}/stats`)
	}
}

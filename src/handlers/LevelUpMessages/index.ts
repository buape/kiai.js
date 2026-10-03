import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type { LevelUpMessage } from "./types"

export class LevelUpMessages extends BaseHandler {
	async getLevelUpMessages(guildId: string) {
		return this._handler.request<LevelUpMessage[]>(
			`/${encodeURIComponent(guildId)}/level-up-messages`
		)
	}

	async getBaseLevelUpMessage(guildId: string) {
		return this._handler.request<LevelUpMessage>(
			`/${encodeURIComponent(guildId)}/level-up-messages/base`
		)
	}

	async getLevelUpMessage(guildId: string, level: number) {
		if (!Number.isInteger(level) || level < 0) {
			throw new Error("Level must be a non-negative integer")
		}
		return this._handler.request<LevelUpMessage>(
			`/${encodeURIComponent(guildId)}/level-up-messages/${level}`
		)
	}
}

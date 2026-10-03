import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type { GuildSettings } from "./types"

export class Settings extends BaseHandler {
	async getSettings(guildId: string) {
		return this._handler.request<GuildSettings>(
			`/${encodeURIComponent(guildId)}/settings`
		)
	}
}

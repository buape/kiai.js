import type { GuildSettings } from "../types"
import { BaseHandler } from "."

export class Settings extends BaseHandler {
	async getSettings(guildId: string) {
		const result = await this._handler.request<GuildSettings>(
			`/${guildId}/settings`
		)
		return result
	}
}

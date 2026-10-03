import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type {
	ClearCooldownsResponse,
	CooldownOverride,
	CooldownsResponse,
	SetRoleCooldownResponse,
	SetServerCooldownResponse
} from "./types"

export class Cooldowns extends BaseHandler {
	async getCooldowns(guildId: string) {
		return this._handler.request<CooldownsResponse>(`/${encodeURIComponent(guildId)}/cooldowns`)
	}

	async clearAllCooldowns(guildId: string) {
		return this._handler.request<ClearCooldownsResponse>(
			`/${encodeURIComponent(guildId)}/cooldowns`,
			"DELETE"
		)
	}

	async setServerCooldown(guildId: string, cooldown: number) {
		return this._handler.request<SetServerCooldownResponse>(
			`/${encodeURIComponent(guildId)}/cooldowns/server`,
			"PUT",
			{},
			{ cooldown }
		)
	}

	async clearServerCooldown(guildId: string) {
		return this._handler.request<SetServerCooldownResponse>(
			`/${encodeURIComponent(guildId)}/cooldowns/server`,
			"DELETE"
		)
	}

	async getRoleCooldown(guildId: string, roleId: string) {
		return this._handler.request<CooldownOverride>(
			`/${encodeURIComponent(guildId)}/cooldowns/roles/${encodeURIComponent(roleId)}`
		)
	}

	async setRoleCooldown(
		guildId: string,
		roleId: string,
		data: { cooldown: number; expiresAt?: string | number | Date }
	) {
		return this._handler.request<SetRoleCooldownResponse>(
			`/${encodeURIComponent(guildId)}/cooldowns/roles/${encodeURIComponent(roleId)}`,
			"PUT",
			{},
			data
		)
	}

	async clearRoleCooldown(guildId: string, roleId: string) {
		return this._handler.request<SetRoleCooldownResponse>(
			`/${encodeURIComponent(guildId)}/cooldowns/roles/${encodeURIComponent(roleId)}`,
			"DELETE"
		)
	}
}

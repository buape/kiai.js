import type { CountResponse } from "../../types"
import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type {
	CreateMultiplier,
	GlobalMultiplierResponse,
	Multiplier,
	MultiplierResponse
} from "./types"

export class Multipliers extends BaseHandler {
	async getMultipliers(guildId: string) {
		return this._handler.request<MultiplierResponse>(`/${encodeURIComponent(guildId)}/multipliers`)
	}

	async createMultiplier(guildId: string, data: CreateMultiplier) {
		return this._handler.request<Multiplier>(
			`/${encodeURIComponent(guildId)}/multipliers`,
			"POST",
			{},
			{
				multiplier: data.multiplier,
				expiresAt: data.expiresAt,
				channelId: data.channelId,
				roleId: data.roleId
			}
		)
	}

	async setGlobalMultiplier(guildId: string, multiplier: number) {
		return this._handler.request<GlobalMultiplierResponse>(
			`/${encodeURIComponent(guildId)}/multipliers/global`,
			"POST",
			{},
			{ multiplier }
		)
	}

	async getMultiplier(guildId: string, type: "channel" | "role" | "internal", id: string) {
		if (type === "internal") return this.getMultiplierById(guildId, id)
		return this._handler.request<Multiplier>(
			`/${encodeURIComponent(guildId)}/multipliers/${type}/${encodeURIComponent(id)}`
		)
	}

	async deleteMultiplier(guildId: string, type: "channel" | "role", id: string) {
		return this._handler.request<Multiplier>(
			`/${encodeURIComponent(guildId)}/multipliers/${type}/${encodeURIComponent(id)}`,
			"DELETE"
		)
	}

	async getMultiplierById(guildId: string, id: string) {
		return this._handler.request<Multiplier>(
			`/${encodeURIComponent(guildId)}/multipliers/id/${encodeURIComponent(id)}`
		)
	}

	async deleteMultiplierById(guildId: string, id: string) {
		return this._handler.request<Multiplier>(
			`/${encodeURIComponent(guildId)}/multipliers/id/${encodeURIComponent(id)}`,
			"DELETE"
		)
	}

	async clearAllMultipliers(guildId: string) {
		return this._handler.request<CountResponse>(
			`/${encodeURIComponent(guildId)}/multipliers`,
			"DELETE"
		)
	}
}

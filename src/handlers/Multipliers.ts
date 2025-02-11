import type {
	ChannelMultiplier,
	CountResponse,
	Multiplier,
	MultiplierResponse,
	RoleMultiplier
} from "../types"
import { BaseHandler } from "."

export class Multipliers extends BaseHandler {
	async getMultipliers(guildId: string) {
		const result = await this._handler.request<MultiplierResponse>(
			`/${guildId}/multipliers`
		)
		return result
	}

	async createMultiplier(guildId: string, data: Omit<Multiplier, "id">) {
		const result = await this._handler.request<Multiplier>(
			`/${guildId}/multipliers`,
			"POST",
			{},
			{
				type: data.type,
				multiplier: data.multiplier,
				...(data.type === "role"
					? { roleId: (data as RoleMultiplier).roleId }
					: {}),
				...(data.type === "channel"
					? { channelId: (data as ChannelMultiplier).channelId }
					: {})
			}
		)
		return result
	}

	async getMultiplier(
		guildId: string,
		type: "channel" | "role" | "internal",
		id: string
	) {
		if (type === "internal") {
			const result = await this._handler.request<Multiplier>(
				`/${guildId}/multipliers/id/${id}`
			)
			return result
		}
		const result = await this._handler.request<
			ChannelMultiplier | RoleMultiplier
		>(`/${guildId}/multipliers/${type}/${id}`)

		return result
	}

	async clearAllMultipliers(guildId: string) {
		const result = await this._handler.request<CountResponse>(
			`/${guildId}/multipliers`,
			"DELETE"
		)
		return result
	}
}

import type { Message, Reward } from "../types"
import { BaseHandler } from "."

export class Rewards extends BaseHandler {
	async getRewards(guildId: string) {
		const result = await this._handler.request<Reward[]>(`/${guildId}/rewards`)
		return result
	}

	async createReward(guildId: string, data: Omit<Reward, "id">) {
		const result = await this._handler.request<{ id: string }>(
			`/${guildId}/rewards`,
			"POST",
			{},
			data
		)
		return result
	}

	async clearRewards(guildId: string) {
		const result = await this._handler.request<Message>(
			`/${guildId}/rewards`,
			"DELETE",
			{},
			{ type: "all" }
		)
		return result
	}

	async deleteReward(guildId: string, id: string) {
		const result = await this._handler.request<Message>(
			`/${guildId}/rewards/${id}`,
			"DELETE"
		)
		return result
	}
}

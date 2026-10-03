import type { CountResponse } from "../../types"
import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type {
	CreateReward,
	QueuedRewardReconciliation,
	Reward,
	RewardCapabilities,
	RewardDeletionResponse,
	RewardReconciliationJob,
	RewardType
} from "./types"

export class Rewards extends BaseHandler {
	async getCapabilities(guildId: string) {
		return this._handler.request<RewardCapabilities>(
			`/${encodeURIComponent(guildId)}/rewards/capabilities`
		)
	}

	async getRewards(
		guildId: string,
		filters: { type?: RewardType; level?: number; prestige?: number } = {}
	) {
		return this._handler.request<Reward[]>(
			`/${encodeURIComponent(guildId)}/rewards`,
			"GET",
			Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined))
		)
	}

	async createReward(guildId: string, data: CreateReward) {
		return this._handler.request<Reward>(
			`/${encodeURIComponent(guildId)}/rewards`,
			"POST",
			{},
			data
		)
	}

	async getReward(guildId: string, rewardId: string) {
		return this._handler.request<Reward>(
			`/${encodeURIComponent(guildId)}/rewards/${encodeURIComponent(rewardId)}`
		)
	}

	async updateReward(guildId: string, rewardId: string, data: CreateReward) {
		return this._handler.request<Reward>(
			`/${encodeURIComponent(guildId)}/rewards/${encodeURIComponent(rewardId)}`,
			"PUT",
			{},
			data
		)
	}

	async deleteReward(guildId: string, rewardId: string) {
		return this._handler.request<RewardDeletionResponse>(
			`/${encodeURIComponent(guildId)}/rewards/${encodeURIComponent(rewardId)}`,
			"DELETE"
		)
	}

	async clearRewards(guildId: string): Promise<CountResponse> {
		const rewards = await this.getRewards(guildId)
		const deleted = await Promise.all(
			rewards.map((reward) => this.deleteReward(guildId, reward.id))
		)
		return { count: deleted.length }
	}

	async queueReconciliation(guildId: string) {
		return this._handler.request<QueuedRewardReconciliation>(
			`/${encodeURIComponent(guildId)}/rewards/reconciliation-jobs`,
			"POST"
		)
	}

	async getReconciliationJob(guildId: string, jobId: string) {
		return this._handler.request<RewardReconciliationJob>(
			`/${encodeURIComponent(guildId)}/rewards/reconciliation-jobs/${encodeURIComponent(jobId)}`
		)
	}
}

export type RewardType = "ROLE" | "MONEY" | "MESSAGE" | "NICKNAME" | "WEBHOOK"

export type RewardThreshold = {
	level: number
	prestige: number | null
}

export type RewardEligibility = {
	requiredRoleId: string | null
}

export type RoleRewardConfig = {
	roleId: string
	operation: "ADD" | "REMOVE"
	durationMs: number | null
}

export type MoneyRewardConfig = {
	amount: number
	destination: "BANK" | "WALLET"
}

export type MessageRewardConfig = {
	message: string
	channelId: string | null
}

export type NicknameRewardConfig = {
	format: string
}

export type WebhookRewardConfig = {
	endpointUrl: string
	publicKey: string
}

export type RoleReward = {
	id: string
	threshold: RewardThreshold
	eligibility: RewardEligibility
	type: "ROLE"
	config: RoleRewardConfig
}

export type MoneyReward = {
	id: string
	threshold: RewardThreshold
	eligibility: RewardEligibility
	type: "MONEY"
	config: MoneyRewardConfig
}

export type MessageReward = {
	id: string
	threshold: RewardThreshold
	eligibility: RewardEligibility
	type: "MESSAGE"
	config: MessageRewardConfig
}

export type NicknameReward = {
	id: string
	threshold: RewardThreshold
	eligibility: RewardEligibility
	type: "NICKNAME"
	config: NicknameRewardConfig
}

export type WebhookReward = {
	id: string
	threshold: RewardThreshold
	eligibility: RewardEligibility
	type: "WEBHOOK"
	config: WebhookRewardConfig
}

export type Reward =
	| RoleReward
	| MoneyReward
	| MessageReward
	| NicknameReward
	| WebhookReward

export type CreateReward =
	| Omit<RoleReward, "id">
	| Omit<MoneyReward, "id">
	| Omit<MessageReward, "id">
	| Omit<NicknameReward, "id">
	| {
			threshold: RewardThreshold
			eligibility: RewardEligibility
			type: "WEBHOOK"
			config: { endpointUrl: string }
	  }

export type RewardCapabilities = {
	prestige: {
		enabled: boolean
		automatic: boolean
	}
	reversal: {
		roles: boolean
		money: boolean
		nicknames: boolean
	}
	providers: {
		unbelievaboat: {
			inGuild: boolean
			authorized: boolean
		}
	}
	reconciliation: {
		kind: "declarative"
		cooldownSeconds: number
		active: boolean
	}
	types: Record<
		string,
		{
			kind: "declarative" | "imperative"
			availability: "enabled" | "preview" | "hidden"
			premiumRequired: boolean
			creatable: boolean
			reason: string | null
		}
	>
	limits: {
		messageLength: number
		nicknameLength: number
		maximumTemporaryRoleDurationMs: number
		maximumMoneyAmount: number
		maximumWebhookEndpointLength: number
		webhookHttpsOnly: boolean
	}
}

export type RewardDeletionResponse = { id: string; deleted: true }

export type RewardReconciliationJob = {
	id: string
	status: "queued" | "running" | "completed" | "failed"
	synced: number | null
	failed: number | null
	total: number | null
}

export type QueuedRewardReconciliation = {
	id: string
	status: "queued"
}

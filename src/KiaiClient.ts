import { RequestHandler } from "./RequestHandler"
import {
	AutoLeaderboards,
	Cooldowns,
	Denylist,
	LeaderboardRoles,
	LevelUpMessages,
	Leveling,
	Misc,
	Multipliers,
	Rewards,
	Settings
} from "./handlers"
import type { RootResponse } from "./types"

export class KiaiClient {
	readonly apiKey: string
	readonly baseURL: string
	readonly version: `v${string}`
	readonly debug: boolean
	readonly _requestHandler: RequestHandler

	readonly autoLeaderboards: AutoLeaderboards
	readonly cooldowns: Cooldowns
	readonly denylist: Denylist
	readonly leveling: Leveling
	readonly levelUpMessages: LevelUpMessages
	readonly multipliers: Multipliers
	readonly rewards: Rewards
	readonly settings: Settings
	readonly leaderboardRoles: LeaderboardRoles
	readonly misc: Misc

	/**
	 * Create a new KiaiClient
	 * @param apiKey The API key to use for Kiai's API
	 * @param options The options to use to initialize the client
	 */
	constructor(
		apiKey: string,
		options?: {
			/**
			 * The base URL to use for Kiai's API
			 */
			baseURL?: string
			/**
			 * The version of the API to use
			 */
			version?: `v${number}`
			/**
			 * Whether to enable debug logging
			 */
			debug?: boolean
			/**
			 * The fetch function to use for Kiai's API
			 * If you want to use your own fetch function (e.g. for a custom proxy), you can pass it here
			 */
			fetchFunction?: (
				url: URL | string,
				init?: RequestInit | undefined
			) => Promise<Response>
		}
	) {
		this.apiKey = apiKey
		this.version = options?.version || "v3"
		this.baseURL =
			options?.baseURL || `https://www.kiai.app/api/${this.version}`
		this.debug = options?.debug || false
		this._requestHandler = new RequestHandler(
			this.baseURL,
			this.apiKey,
			this.debug,
			options?.fetchFunction ?? fetch
		)

		this.autoLeaderboards = new AutoLeaderboards(this._requestHandler)
		this.cooldowns = new Cooldowns(this._requestHandler)
		this.denylist = new Denylist(this._requestHandler)
		this.leveling = new Leveling(this._requestHandler)
		this.levelUpMessages = new LevelUpMessages(this._requestHandler)
		this.multipliers = new Multipliers(this._requestHandler)
		this.rewards = new Rewards(this._requestHandler)
		this.settings = new Settings(this._requestHandler)
		this.leaderboardRoles = new LeaderboardRoles(this._requestHandler)
		this.misc = new Misc(this._requestHandler)
	}

	/**
	 * Get information about the API
	 */
	public async getRoot() {
		return await this._requestHandler.request<RootResponse>(
			"/",
			"GET",
			{},
			undefined,
			true
		)
	}
}

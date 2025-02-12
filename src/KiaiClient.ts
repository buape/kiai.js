import { RequestHandler } from "./RequestHandler"
import * as handlers from "./handlers"
import type { DenylistHandler } from "./handlers/Denylist"
import type { LeaderboardRoles } from "./handlers/LeaderboardRoles"
import type { Leveling } from "./handlers/Leveling"
import type { Misc } from "./handlers/Misc"
import type { Multipliers } from "./handlers/Multipliers"
import type { Rewards } from "./handlers/Rewards"
import type { Settings } from "./handlers/Settings"
import type { RootResponse } from "./types"

export class KiaiClient {
	readonly apiKey: string
	readonly baseURL: string
	readonly version: `v${string}`
	readonly debug: boolean
	readonly _requestHandler: RequestHandler

	readonly denylist: DenylistHandler
	readonly leveling: Leveling
	readonly multipliers: Multipliers
	readonly rewards: Rewards
	readonly settings: Settings
	readonly leaderboardRoles: LeaderboardRoles
	readonly misc: Misc

	/**
	 * Create a new KiaiClient
	 * @param apiKey The API key to use
	 * @param options The options to use
	 * @param options.baseURL The base URL to use
	 * @param options.debug Whether to enable debug mode
	 * @constructor
	 */
	constructor(
		apiKey: string,
		options?: {
			baseURL?: string
			version?: `v${number}`
			debug?: boolean
			fetchFunction?: (
				url: URL | string,
				init?: RequestInit | undefined
			) => Promise<Response>
		}
	) {
		this.apiKey = apiKey
		this.version = options?.version || "v2"
		this.baseURL = options?.baseURL || `https://api.kiai.app/${this.version}`
		this.debug = options?.debug || false
		this._requestHandler = new RequestHandler(
			this.baseURL,
			this.apiKey,
			this.debug,
			options?.fetchFunction ?? fetch
		)

		this.denylist = new handlers.DenylistHandler(this._requestHandler)
		this.leveling = new handlers.Leveling(this._requestHandler)
		this.multipliers = new handlers.Multipliers(this._requestHandler)
		this.rewards = new handlers.Rewards(this._requestHandler)
		this.settings = new handlers.Settings(this._requestHandler)
		this.leaderboardRoles = new handlers.LeaderboardRoles(this._requestHandler)
		this.misc = new handlers.Misc(this._requestHandler)
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
			true,
			"https://api.kiai.app"
		)
	}
}

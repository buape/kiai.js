import { describe, expect, test } from "bun:test"
import { KiaiClient, type CreateReward, type RewardPath, type ReplaceRewardPath } from "../src"

const path: RewardPath = {
	id: "c123456789012345678901234",
	guildId: "123456789012345678",
	name: "Explorer",
	description: "Exploration rewards",
	emoji: "🧭",
	archived: false
}
const replacement: ReplaceRewardPath = {
	name: "Explorer",
	description: "",
	emoji: "",
	archived: true
}

// Deliberately invalid ID characters verify encoding without touching a real guild.
const guildId = "guild/ ?"
const pathId = "path/ ?"
const userId = "user/ ?"
const base = `/${encodeURIComponent(guildId)}/rewards/paths`

type Case = {
	name: string
	method: string
	endpoint: string
	body?: unknown
	response: unknown
	call: (client: KiaiClient) => Promise<unknown>
}
const cases: Case[] = [
	{
		name: "list paths",
		method: "GET",
		endpoint: base,
		response: [path],
		call: (c) => c.rewards.getPaths(guildId)
	},
	{
		name: "create with defaults omitted",
		method: "POST",
		endpoint: base,
		body: { name: "Explorer" },
		response: path,
		call: (c) => c.rewards.createPath(guildId, { name: "Explorer" })
	},
	{
		name: "create with explicit empty and false fields",
		method: "POST",
		endpoint: base,
		body: { name: "Explorer", description: "", emoji: "", archived: false },
		response: path,
		call: (c) =>
			c.rewards.createPath(guildId, {
				name: "Explorer",
				description: "",
				emoji: "",
				archived: false
			})
	},
	{
		name: "get path",
		method: "GET",
		endpoint: `${base}/${encodeURIComponent(pathId)}`,
		response: path,
		call: (c) => c.rewards.getPath(guildId, pathId)
	},
	{
		name: "replace and archive path",
		method: "PUT",
		endpoint: `${base}/${encodeURIComponent(pathId)}`,
		body: replacement,
		response: { ...path, ...replacement },
		call: (c) => c.rewards.replacePath(guildId, pathId, replacement)
	},
	{
		name: "get settings",
		method: "GET",
		endpoint: `${base}/settings`,
		response: { allowRewardPathSwitching: true },
		call: (c) => c.rewards.getPathSettings(guildId)
	},
	{
		name: "disable switching",
		method: "PUT",
		endpoint: `${base}/settings`,
		body: { allowRewardPathSwitching: false },
		response: { allowRewardPathSwitching: false },
		call: (c) => c.rewards.setPathSettings(guildId, { allowRewardPathSwitching: false })
	},
	{
		name: "get member with no path",
		method: "GET",
		endpoint: `${base}/members/${encodeURIComponent(userId)}`,
		response: { userId, rewardPathId: null },
		call: (c) => c.rewards.getMemberPath(guildId, userId)
	},
	...[undefined, null, "previous-path"].map((expectedRewardPathId) => ({
		name: `assign with expected path ${String(expectedRewardPathId)}`,
		method: "PUT",
		endpoint: `${base}/members/${encodeURIComponent(userId)}`,
		body:
			expectedRewardPathId === undefined
				? { rewardPathId: path.id }
				: { rewardPathId: path.id, expectedRewardPathId },
		response: { userId, rewardPathId: path.id, synced: false },
		call: (c: KiaiClient) =>
			c.rewards.assignMemberPath(guildId, userId, {
				rewardPathId: path.id,
				expectedRewardPathId
			})
	}))
]

describe("Reward path request contracts (offline)", () => {
	for (const entry of cases) {
		test(entry.name, async () => {
			let requests = 0
			const client = new KiaiClient("test", {
				baseURL: "https://example.invalid/api/v3",
				fetchFunction: async (url, init) => {
					requests++
					expect(String(url)).toBe(`https://example.invalid/api/v3${entry.endpoint}`)
					expect(init?.method).toBe(entry.method)
					expect(
						init?.body === undefined ? undefined : JSON.parse(String(init.body))
					).toEqual(entry.body)
					return Response.json({ data: entry.response })
				}
			})
			expect(await entry.call(client)).toEqual(entry.response)
			expect(requests).toBe(1)
		})
	}
	test("preserves assignment conflicts rather than hiding them", async () => {
		const client = new KiaiClient("test", {
			fetchFunction: async () =>
				Response.json(
					{ code: 409, error: "Conflict", message: "Path changed" },
					{ status: 409 }
				)
		})
		await expect(
			client.rewards.assignMemberPath(guildId, userId, {
				rewardPathId: path.id,
				expectedRewardPathId: null
			})
		).rejects.toThrow("Path changed")
	})
	for (const rewardPathId of [undefined, null, path.id]) {
		test(`role reward path ${String(rewardPathId)}`, async () => {
			const data: CreateReward = {
				type: "ROLE",
				threshold: { level: 5, prestige: null },
				eligibility: { requiredRoleId: null },
				config: { roleId: "123456789012345678", operation: "ADD", durationMs: null },
				rewardPathId
			}
			const client = new KiaiClient("test", {
				fetchFunction: async (_url, init) => {
					const body = JSON.parse(String(init?.body))
					expect(body).toEqual(JSON.parse(JSON.stringify(data)))
					expect(Object.hasOwn(body, "rewardPathId")).toBe(rewardPathId !== undefined)
					return Response.json({
						data: { ...data, id: "reward", rewardPathId: rewardPathId ?? null }
					})
				}
			})
			expect((await client.rewards.createReward(guildId, data)).type).toBe("ROLE")
			expect((await client.rewards.updateReward(guildId, "reward", data)).type).toBe("ROLE")
		})
	}
})

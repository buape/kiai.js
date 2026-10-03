import { afterAll, beforeEach, describe, expect, test } from "bun:test"
import type { RoleReward } from "../src"
import { ids, verifyClient } from "./_setup"

const roleReward = (level: number, roleId: string, operation: "ADD" | "REMOVE") =>
	({
		threshold: { level, prestige: null },
		eligibility: { requiredRoleId: null },
		type: "ROLE",
		config: { roleId, operation, durationMs: null }
	}) satisfies Omit<RoleReward, "id">

describe("Rewards", () => {
	beforeEach(async () => {
		const client = await verifyClient()
		await client.rewards.clearRewards(ids.server)
	})

	describe("clearRewards()", () => {
		test("clears all rewards", async () => {
			const client = await verifyClient()
			await client.rewards.clearRewards(ids.server)

			const rewards = await client.rewards.getRewards(ids.server)
			expect(Array.isArray(rewards)).toBe(true)
			expect(rewards).toHaveLength(0)
		})
	})

	describe("createReward()", () => {
		test("creates a role reward", async () => {
			const client = await verifyClient()
			const created = await client.rewards.createReward(
				ids.server,
				roleReward(5, ids.roles["Role 1"], "ADD")
			)
			expect(created.id).toBeDefined()

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const reward = rewards[0]
			if (reward.type !== "ROLE") throw new Error("Expected a role reward")
			expect(reward.threshold.level).toBe(5)
			expect(reward.config.roleId).toBe(ids.roles["Role 1"])
			expect(reward.config.operation).toBe("ADD")
		})

		test("creates a role-removal reward", async () => {
			const client = await verifyClient()
			await client.rewards.createReward(ids.server, roleReward(10, ids.roles["Role 2"], "REMOVE"))

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const reward = rewards[0]
			if (reward.type !== "ROLE") throw new Error("Expected a role reward")
			expect(reward.threshold.level).toBe(10)
			expect(reward.config.roleId).toBe(ids.roles["Role 2"])
			expect(reward.config.operation).toBe("REMOVE")
		})

		test("creates a message reward with a channel", async () => {
			const client = await verifyClient()
			await client.rewards.createReward(ids.server, {
				type: "MESSAGE",
				threshold: { level: 15, prestige: null },
				eligibility: { requiredRoleId: null },
				config: {
					message: "Congratulations on reaching level 15!",
					channelId: ids.channel
				}
			})

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const reward = rewards[0]
			if (reward.type !== "MESSAGE") throw new Error("Expected a message reward")
			expect(reward.threshold.level).toBe(15)
			expect(reward.config.message).toBe("Congratulations on reaching level 15!")
			expect(reward.config.channelId).toBe(ids.channel)
		})

		test("creates a message reward without a channel", async () => {
			const client = await verifyClient()
			await client.rewards.createReward(ids.server, {
				type: "MESSAGE",
				threshold: { level: 20, prestige: null },
				eligibility: { requiredRoleId: null },
				config: {
					message: "Congratulations on reaching level 20!",
					channelId: null
				}
			})

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const reward = rewards[0]
			if (reward.type !== "MESSAGE") throw new Error("Expected a message reward")
			expect(reward.threshold.level).toBe(20)
			expect(reward.config.message).toBe("Congratulations on reaching level 20!")
			expect(reward.config.channelId).toBeNull()
		})
	})

	describe("deleteReward()", () => {
		test("deletes a specific reward", async () => {
			const client = await verifyClient()
			const created = await client.rewards.createReward(
				ids.server,
				roleReward(5, ids.roles["Role 1"], "ADD")
			)

			const deleted = await client.rewards.deleteReward(ids.server, created.id)
			expect(deleted).toEqual({ id: created.id, deleted: true })

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(0)
		})
	})

	describe("getRewards()", () => {
		test("gets all rewards", async () => {
			const client = await verifyClient()
			const rewards = await client.rewards.getRewards(ids.server)
			expect(Array.isArray(rewards)).toBe(true)
		})
	})

	afterAll(async () => {
		const client = await verifyClient()
		await client.rewards.clearRewards(ids.server)
	})
})

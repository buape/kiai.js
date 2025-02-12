import { afterAll, beforeEach, describe, expect, test } from "bun:test"
import type { RoleReward } from "../src"
import { ids, verifyClient } from "./_setup"

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
		test("creates role reward with keep previous roles", async () => {
			const client = await verifyClient()

			const roleReward: Omit<RoleReward, "id"> = {
				guildId: ids.server,
				level: 5,
				roleId: ids.roles["Role 1"],
				removeRole: false
			}
			const createResult = await client.rewards.createReward(
				ids.server,
				roleReward
			)
			expect(createResult.id).toBeDefined()

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const firstReward = rewards[0]
			if (!("roleId" in firstReward))
				throw new Error("Role reward doesn't have roleId")
			expect(firstReward.level).toBe(5)
			expect(firstReward.roleId).toBe(ids.roles["Role 1"])
			expect(firstReward.removeRole).toBe(false)
		})

		test("creates role reward with remove previous roles", async () => {
			const client = await verifyClient()

			const roleReward: Omit<RoleReward, "id"> = {
				guildId: ids.server,
				level: 10,
				roleId: ids.roles["Role 2"],
				removeRole: true
			}
			const createResult = await client.rewards.createReward(
				ids.server,
				roleReward
			)
			expect(createResult.id).toBeDefined()

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const reward = rewards[0]
			if (!("roleId" in reward))
				throw new Error("Role reward doesn't have roleId")
			expect(reward.level).toBe(10)
			expect(reward.roleId).toBe(ids.roles["Role 2"])
			expect(reward.removeRole).toBe(true)
		})

		test("creates message reward with channel", async () => {
			const client = await verifyClient()

			const messageReward = {
				type: "message" as const,
				guildId: ids.server,
				level: 15,
				message: "Congratulations on reaching level 15!",
				channelId: ids.channel
			}
			await client.rewards.createReward(ids.server, messageReward)

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const reward = rewards[0]
			if (!("message" in reward))
				throw new Error("Message reward doesn't have message")
			expect(reward.level).toBe(15)
			expect(reward.message).toBe("Congratulations on reaching level 15!")
			expect(reward.channelId).toBe(ids.channel)
		})

		test("creates message reward without channel", async () => {
			const client = await verifyClient()

			const messageReward = {
				type: "message" as const,
				guildId: ids.server,
				level: 20,
				message: "Congratulations on reaching level 20!"
			}
			await client.rewards.createReward(ids.server, messageReward)

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(1)
			const reward = rewards[0]
			if (!("message" in reward))
				throw new Error("Message reward doesn't have message")
			expect(reward.level).toBe(20)
			expect(reward.message).toBe("Congratulations on reaching level 20!")
			expect(reward.channelId).toBeNull()
		})
	})

	describe("deleteReward()", () => {
		test("deletes specific reward", async () => {
			const client = await verifyClient()

			// Create a reward first
			const roleReward: Omit<RoleReward, "id"> = {
				guildId: ids.server,
				level: 5,
				roleId: ids.roles["Role 1"],
				removeRole: false
			}
			const createResult = await client.rewards.createReward(
				ids.server,
				roleReward
			)

			// Then delete it
			await client.rewards.deleteReward(ids.server, createResult.id)

			const rewardsAfterDelete = await client.rewards.getRewards(ids.server)
			expect(rewardsAfterDelete).toHaveLength(0)
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

import { describe, expect, test } from "bun:test"
import type { RoleReward } from "../src"
import { ids, verifyClient } from "./_setup"

describe("Rewards", () => {
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
		test("creates role reward", async () => {
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
		})

		test("creates message reward", async () => {
			const client = await verifyClient()

			const messageReward = {
				type: "message" as const,
				guildId: ids.server,
				level: 10,
				message: "Congratulations on reaching level 10!",
				channelId: ids.channel
			}
			await client.rewards.createReward(ids.server, messageReward)

			const rewards = await client.rewards.getRewards(ids.server)
			expect(rewards).toHaveLength(2)
			if (!("message" in rewards[1]))
				throw new Error("Message reward doesn't have message")
			expect(rewards[1].message).toBe("Congratulations on reaching level 10!")
		})
	})

	describe("deleteReward()", () => {
		test("deletes specific reward", async () => {
			const client = await verifyClient()
			const rewards = await client.rewards.getRewards(ids.server)
			await client.rewards.deleteReward(ids.server, rewards[0].id)

			const rewardsAfterDelete = await client.rewards.getRewards(ids.server)
			expect(rewardsAfterDelete).toHaveLength(1)
			if (!("message" in rewardsAfterDelete[0]))
				throw new Error("Message reward doesn't have message")
			expect(rewardsAfterDelete[0].message).toBe(
				"Congratulations on reaching level 10!"
			)
		})
	})

	describe("getRewards()", () => {
		test("gets all rewards", async () => {
			const client = await verifyClient()
			const rewards = await client.rewards.getRewards(ids.server)
			expect(Array.isArray(rewards)).toBe(true)
		})
	})
})

import { describe, expect, test } from "bun:test"
import { verifyClient, ids } from "./_setup"
import type { RoleReward } from "../src"

describe("Rewards", () => {
	test("CRUD operations", async () => {
		const client = await verifyClient()

		// Clear any existing rewards first
		await client.rewards.clearRewards(ids.server)

		// Get rewards (should be empty)
		const initialRewards = await client.rewards.getRewards(ids.server)
		expect(Array.isArray(initialRewards)).toBe(true)
		expect(initialRewards).toHaveLength(0)

		// Create a role reward
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

		// Get rewards (should have one)
		const rewardsAfterCreate = await client.rewards.getRewards(ids.server)
		expect(rewardsAfterCreate).toHaveLength(1)
		const firstReward = rewardsAfterCreate[0]
		if (!("roleId" in firstReward))
			throw new Error("Role reward doesn't have roleId")
		expect(firstReward.level).toBe(5)
		expect(firstReward.roleId).toBe(ids.roles["Role 1"])

		// Create a message reward
		const messageReward = {
			type: "message" as const,
			guildId: ids.server,
			level: 10,
			message: "Congratulations on reaching level 10!",
			channelId: ids.server // Using server ID as channel ID for testing
		}
		await client.rewards.createReward(ids.server, messageReward)

		// Get rewards (should have two)
		const rewardsAfterSecondCreate = await client.rewards.getRewards(ids.server)
		expect(rewardsAfterSecondCreate).toHaveLength(2)

		// Delete the first reward
		await client.rewards.deleteReward(ids.server, rewardsAfterCreate[0].id)

		// Get rewards (should have one)
		const rewardsAfterDelete = await client.rewards.getRewards(ids.server)
		expect(rewardsAfterDelete).toHaveLength(1)
		if (!("message" in rewardsAfterDelete[0]))
			throw new Error("Message reward doesn't have message")
		expect(rewardsAfterDelete[0].message).toBe(
			"Congratulations on reaching level 10!"
		)

		// Clear all rewards
		await client.rewards.clearRewards(ids.server)

		// Get rewards (should be empty)
		const finalRewards = await client.rewards.getRewards(ids.server)
		expect(finalRewards).toHaveLength(0)
	})
})

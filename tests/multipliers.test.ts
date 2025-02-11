import { describe, expect, test } from "bun:test"
import { verifyClient, ids } from "./_setup"
import type { ChannelMultiplier, RoleMultiplier } from "../src"

describe("Multipliers", () => {
	test("CRUD operations", async () => {
		const client = await verifyClient()

		// Clear any existing multipliers first
		await client.multipliers.clearAllMultipliers(ids.server)

		// Get multipliers (should be empty)
		const initialMultipliers = await client.multipliers.getMultipliers(
			ids.server
		)
		expect(initialMultipliers.multipliers).toHaveLength(0)

		// Create a role multiplier
		const roleMultiplierData: RoleMultiplier = {
			type: "role",
			guildId: ids.server,
			roleId: ids.roles["Role 1"],
			multiplier: 1.5
		}
		await client.multipliers.createMultiplier(ids.server, roleMultiplierData)

		// Get multipliers (should have one)
		const multipliersAfterCreate = await client.multipliers.getMultipliers(
			ids.server
		)
		expect(multipliersAfterCreate.multipliers).toHaveLength(1)
		const firstMultiplier = multipliersAfterCreate.multipliers[0]
		if (!("roleId" in firstMultiplier))
			throw new Error("Role multiplier isn't a role multiplier")
		expect(firstMultiplier.roleId).toBe(ids.roles["Role 1"])
		expect(firstMultiplier.multiplier).toBe(1.5)

		// Create a channel multiplier
		const channelMultiplierData: ChannelMultiplier = {
			type: "channel",
			guildId: ids.server,
			channelId: ids.channel,
			multiplier: 2
		}
		await client.multipliers.createMultiplier(ids.server, channelMultiplierData)

		// Get multipliers (should have two)
		const multipliersAfterSecondCreate =
			await client.multipliers.getMultipliers(ids.server)
		expect(multipliersAfterSecondCreate.multipliers).toHaveLength(2)

		// Get specific multiplier
		const roleMultiplier = await client.multipliers.getMultiplier(
			ids.server,
			"role",
			ids.roles["Role 1"]
		)
		if (!("roleId" in roleMultiplier))
			throw new Error("Role multiplier isn't a role multiplier")
		expect(roleMultiplier.roleId).toBe(ids.roles["Role 1"])
		expect(roleMultiplier.multiplier).toBe(1.5)

		// Reset all multipliers
		await client.multipliers.clearAllMultipliers(ids.server)

		// Get multipliers (should be empty)
		const finalMultipliers = await client.multipliers.getMultipliers(ids.server)
		expect(finalMultipliers.multipliers).toHaveLength(0)
	})
})

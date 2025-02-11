import { describe, expect, test } from "bun:test"
import { verifyClient, ids } from "./_setup"

describe("LeaderboardRoles", () => {
	test("CRUD operations", async () => {
		const client = await verifyClient()

		// Clear any existing roles first
		await client.leaderboardRoles.clearLeaderboardRoles(ids.server)

		// Get roles (should be empty)
		const initialRoles = await client.leaderboardRoles.getLeaderboardRoles(
			ids.server
		)
		expect(initialRoles).toHaveLength(0)

		// Create a role
		await client.leaderboardRoles.createLeaderboardRole(ids.server, {
			roleId: ids.roles["Role 1"],
			type: "FIRST",
			time: "ALL"
		})

		// Get roles (should have one)
		const rolesAfterCreate = await client.leaderboardRoles.getLeaderboardRoles(
			ids.server
		)
		expect(rolesAfterCreate).toHaveLength(1)
		expect(rolesAfterCreate[0].roleId).toBe(ids.roles["Role 1"])
		expect(rolesAfterCreate[0].type).toBe("FIRST")
		expect(rolesAfterCreate[0].time).toBe("ALL")

		// Create another role
		await client.leaderboardRoles.createLeaderboardRole(ids.server, {
			roleId: ids.roles["Role 2"],
			type: "SECOND",
			time: "ALL"
		})

		// Get roles (should have two)
		const rolesAfterSecondCreate =
			await client.leaderboardRoles.getLeaderboardRoles(ids.server)
		expect(rolesAfterSecondCreate).toHaveLength(2)
		expect(rolesAfterSecondCreate[1].roleId).toBe(ids.roles["Role 2"])
		expect(rolesAfterSecondCreate[1].type).toBe("SECOND")
		expect(rolesAfterSecondCreate[1].time).toBe("ALL")

		// Delete first role
		await client.leaderboardRoles.deleteLeaderboardRole(
			ids.server,
			rolesAfterCreate[0].roleId
		)

		// Get roles (should have one)
		const rolesAfterDelete = await client.leaderboardRoles.getLeaderboardRoles(
			ids.server
		)
		expect(rolesAfterDelete).toHaveLength(1)
		expect(rolesAfterDelete[0].roleId).toBe(ids.roles["Role 2"])
		expect(rolesAfterDelete[0].type).toBe("SECOND")
		expect(rolesAfterDelete[0].time).toBe("ALL")

		// Clear all roles
		await client.leaderboardRoles.clearLeaderboardRoles(ids.server)

		// Get roles (should be empty)
		const finalRoles = await client.leaderboardRoles.getLeaderboardRoles(
			ids.server
		)
		expect(finalRoles).toHaveLength(0)
	})
})

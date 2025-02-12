import { afterAll, describe, expect, test } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("LeaderboardRoles", () => {
	describe("clearLeaderboardRoles()", () => {
		test("clears all leaderboard roles", async () => {
			const client = await verifyClient()
			await client.leaderboardRoles.clearLeaderboardRoles(ids.server)

			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(roles).toHaveLength(0)
		})
	})

	describe("createLeaderboardRole()", () => {
		test("creates first place role", async () => {
			const client = await verifyClient()

			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 1"],
				type: "FIRST",
				time: "ALL"
			})

			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(roles).toHaveLength(1)
			expect(roles[0].roleId).toBe(ids.roles["Role 1"])
			expect(roles[0].type).toBe("FIRST")
			expect(roles[0].time).toBe("ALL")
		})

		test("creates second place role", async () => {
			const client = await verifyClient()

			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 2"],
				type: "SECOND",
				time: "ALL"
			})

			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(roles).toHaveLength(2)
			expect(roles[1].roleId).toBe(ids.roles["Role 2"])
			expect(roles[1].type).toBe("SECOND")
			expect(roles[1].time).toBe("ALL")
		})
	})

	describe("deleteLeaderboardRole()", () => {
		test("deletes specific leaderboard role", async () => {
			const client = await verifyClient()
			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)

			await client.leaderboardRoles.deleteLeaderboardRole(
				ids.server,
				roles[0].roleId
			)

			const rolesAfterDelete =
				await client.leaderboardRoles.getLeaderboardRoles(ids.server)
			expect(rolesAfterDelete).toHaveLength(1)
			expect(rolesAfterDelete[0].roleId).toBe(ids.roles["Role 2"])
			expect(rolesAfterDelete[0].type).toBe("SECOND")
			expect(rolesAfterDelete[0].time).toBe("ALL")
		})
	})

	describe("getLeaderboardRoles()", () => {
		test("gets all leaderboard roles", async () => {
			const client = await verifyClient()
			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(Array.isArray(roles)).toBe(true)
		})
	})

	afterAll(async () => {
		const client = await verifyClient()
		await client.leaderboardRoles.clearLeaderboardRoles(ids.server)
	})
})

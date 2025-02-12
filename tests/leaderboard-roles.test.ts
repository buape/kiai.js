import { afterAll, beforeEach, describe, expect, test } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("LeaderboardRoles", () => {
	beforeEach(async () => {
		const client = await verifyClient()
		await client.leaderboardRoles.clearLeaderboardRoles(ids.server)
	})

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
		test("creates first place role for all time", async () => {
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

		test("creates second place role for weekly", async () => {
			const client = await verifyClient()

			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 2"],
				type: "SECOND",
				time: "WEEK"
			})

			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(roles).toHaveLength(1)
			const weeklyRole = roles[0]
			expect(weeklyRole.roleId).toBe(ids.roles["Role 2"])
			expect(weeklyRole.type).toBe("SECOND")
			expect(weeklyRole.time).toBe("WEEK")
		})

		test("creates third place role for monthly", async () => {
			const client = await verifyClient()

			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 1"],
				type: "THIRD",
				time: "MONTH"
			})

			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(roles).toHaveLength(1)
			const monthlyRole = roles[0]
			expect(monthlyRole.roleId).toBe(ids.roles["Role 1"])
			expect(monthlyRole.type).toBe("THIRD")
			expect(monthlyRole.time).toBe("MONTH")
		})
	})

	describe("deleteLeaderboardRole()", () => {
		test("deletes specific leaderboard role", async () => {
			const client = await verifyClient()

			// Create two roles
			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 1"],
				type: "FIRST",
				time: "ALL"
			})
			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 2"],
				type: "SECOND",
				time: "WEEK"
			})

			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(roles).toHaveLength(2)

			await client.leaderboardRoles.deleteLeaderboardRole(
				ids.server,
				roles[0].roleId
			)

			const rolesAfterDelete =
				await client.leaderboardRoles.getLeaderboardRoles(ids.server)
			expect(rolesAfterDelete).toHaveLength(1)
			expect(rolesAfterDelete[0].roleId).toBe(roles[1].roleId)
		})
	})

	describe("getLeaderboardRoles()", () => {
		test("gets all leaderboard roles", async () => {
			const client = await verifyClient()

			// Create roles with different types and times
			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 1"],
				type: "FIRST",
				time: "ALL"
			})
			await client.leaderboardRoles.createLeaderboardRole(ids.server, {
				roleId: ids.roles["Role 2"],
				type: "SECOND",
				time: "WEEK"
			})

			const roles = await client.leaderboardRoles.getLeaderboardRoles(
				ids.server
			)
			expect(Array.isArray(roles)).toBe(true)
			expect(roles.length).toBe(2)

			// Verify we have different types and times
			const types = new Set(roles.map((r) => r.type))
			const times = new Set(roles.map((r) => r.time))
			expect(types.size).toBeGreaterThan(1)
			expect(times.size).toBeGreaterThan(1)
		})
	})

	afterAll(async () => {
		const client = await verifyClient()
		await client.leaderboardRoles.clearLeaderboardRoles(ids.server)
	})
})

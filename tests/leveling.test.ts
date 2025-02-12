import { describe, expect, test } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("Leveling", () => {
	test("XP operations", async () => {
		const client = await verifyClient()
		const userId = ids.users.buape

		// Get initial member data
		const initialMember = await client.leveling.getMember(ids.server, userId)
		const initialXp = initialMember.xp

		// Add XP
		await client.leveling.addXp(ids.server, userId, 100)

		// Get member data after adding XP
		const memberAfterAdd = await client.leveling.getMember(ids.server, userId)
		expect(memberAfterAdd.xp).toBe(initialXp + 100)

		// Remove XP
		await client.leveling.removeXp(ids.server, userId, 50)

		// Get member data after removing XP
		const memberAfterRemove = await client.leveling.getMember(
			ids.server,
			userId
		)
		expect(memberAfterRemove.xp).toBe(initialXp + 50)

		// Set XP
		await client.leveling.setXp(ids.server, userId, 1000)

		// Get member data after setting XP
		const memberAfterSet = await client.leveling.getMember(ids.server, userId)
		expect(memberAfterSet.xp).toBe(1000)

		// Reset XP to initial value
		await client.leveling.setXp(ids.server, userId, initialXp)
	})

	test("Leaderboard operations", async () => {
		const client = await verifyClient()

		// Get full leaderboard
		const fullLeaderboard = await client.leveling.getLeaderboard(
			ids.server,
			undefined,
			undefined
		)
		expect(Array.isArray(fullLeaderboard)).toBe(true)

		// Get leaderboard with start
		const leaderboardWithStart = await client.leveling.getLeaderboard(
			ids.server,
			1,
			undefined
		)
		expect(Array.isArray(leaderboardWithStart)).toBe(true)

		// Get leaderboard with end
		const leaderboardWithEnd = await client.leveling.getLeaderboard(
			ids.server,
			undefined,
			10
		)
		expect(Array.isArray(leaderboardWithEnd)).toBe(true)
		expect(leaderboardWithEnd.length).toBeLessThanOrEqual(10)

		// Get leaderboard with start and end
		const leaderboardWithRange = await client.leveling.getLeaderboard(
			ids.server,
			1,
			5
		)
		expect(Array.isArray(leaderboardWithRange)).toBe(true)
		expect(leaderboardWithRange.length).toBeLessThanOrEqual(5)
	})
})

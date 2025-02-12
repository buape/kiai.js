import { describe, expect, test } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("Leveling", () => {
	describe("XP Management", () => {
		describe("getMember()", () => {
			test("gets member XP data", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const member = await client.leveling.getMember(ids.server, userId)
				expect(member).toBeDefined()
				expect(member.xp).toBeDefined()
			})
		})

		describe("addXp()", () => {
			test("adds XP to member", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const initialMember = await client.leveling.getMember(
					ids.server,
					userId
				)
				const initialXp = initialMember.xp

				await client.leveling.addXp(ids.server, userId, 100)
				const memberAfterAdd = await client.leveling.getMember(
					ids.server,
					userId
				)
				expect(memberAfterAdd.xp).toBe(initialXp + 100)
			})
		})

		describe("removeXp()", () => {
			test("removes XP from member", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const initialMember = await client.leveling.getMember(
					ids.server,
					userId
				)
				const initialXp = initialMember.xp

				await client.leveling.removeXp(ids.server, userId, 50)
				const memberAfterRemove = await client.leveling.getMember(
					ids.server,
					userId
				)
				expect(memberAfterRemove.xp).toBe(initialXp - 50)
			})
		})

		describe("setXp()", () => {
			test("sets member XP to specific value", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const initialMember = await client.leveling.getMember(
					ids.server,
					userId
				)
				const initialXp = initialMember.xp

				await client.leveling.setXp(ids.server, userId, 1000)
				const memberAfterSet = await client.leveling.getMember(
					ids.server,
					userId
				)
				expect(memberAfterSet.xp).toBe(1000)

				// Reset XP to initial value
				await client.leveling.setXp(ids.server, userId, initialXp)
			})
		})
	})

	describe("Leaderboard", () => {
		describe("getLeaderboard()", () => {
			test("gets full leaderboard", async () => {
				const client = await verifyClient()
				const fullLeaderboard = await client.leveling.getLeaderboard(
					ids.server,
					undefined,
					undefined
				)
				expect(Array.isArray(fullLeaderboard)).toBe(true)
			})

			test("gets leaderboard with start index", async () => {
				const client = await verifyClient()
				const leaderboardWithStart = await client.leveling.getLeaderboard(
					ids.server,
					1,
					undefined
				)
				expect(Array.isArray(leaderboardWithStart)).toBe(true)
			})

			test("gets leaderboard with end index", async () => {
				const client = await verifyClient()
				const leaderboardWithEnd = await client.leveling.getLeaderboard(
					ids.server,
					undefined,
					10
				)
				expect(Array.isArray(leaderboardWithEnd)).toBe(true)
				expect(leaderboardWithEnd.length).toBeLessThanOrEqual(10)
			})

			test("gets leaderboard with range", async () => {
				const client = await verifyClient()
				const leaderboardWithRange = await client.leveling.getLeaderboard(
					ids.server,
					1,
					5
				)
				expect(Array.isArray(leaderboardWithRange)).toBe(true)
				expect(leaderboardWithRange.length).toBeLessThanOrEqual(5)
			})
		})
	})
})

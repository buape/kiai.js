import { describe, expect, test } from "bun:test"
import { verifyClient, ids } from "./_setup"
import { ApiPermission } from "../src"

describe("Settings", () => {
	test("Get settings", async () => {
		const client = await verifyClient()

		// Get settings
		const settings = await client.settings.getSettings(ids.server)
		expect(settings).toBeDefined()
		expect(settings.id).toBeString()
		expect(settings.name).toBeString()
		expect(
			settings.levelUpChannel === null ||
				typeof settings.levelUpChannel === "string"
		).toBeTrue()
		expect(settings.sendLevelUpMessages).toBeBoolean()
		expect(settings.autoDeleteLevelUpMessages).toBeBoolean()
		expect(settings.messageXpEnabled).toBeBoolean()
		expect(settings.globalMulti).toBeInteger()
		expect(settings.minXp).toBeInteger()
		expect(settings.maxXp).toBeInteger()
		expect(
			settings.levelCap === null || typeof settings.levelCap === "number"
		).toBeTrue()
		expect(settings.cooldown).toBeInteger()
		expect(settings.resetXpOnLeave).toBeBoolean()
		expect(settings.resetXpOnBan).toBeBoolean()
		expect(settings.stackRoleRewards).toBeBoolean()
		expect(
			settings.nicknameFormat === null ||
				typeof settings.nicknameFormat === "string"
		).toBeTrue()
		expect(settings.xpStreakEnabled).toBeBoolean()
		expect(settings.xpStreakMinDays).toBeInteger()
		expect(settings.xpStreakDayRequired).toBeInteger()
		expect(
			settings.xpStreakChannel === null ||
				typeof settings.xpStreakChannel === "string"
		).toBeTrue()
		expect(settings.xpStreakBonus).toBeInteger()
		expect(settings.xpStreakMessage).toBeString()
		expect(settings.xpDecayEnabled).toBeBoolean()
		expect(settings.xpDecayInterval).toBeInteger()
		expect(settings.xpDecayAmount).toBeInteger()
		expect(settings.xpDropEnabled).toBeBoolean()
		expect(settings.xpDropClaimAction).toBeString()
		expect(settings.xpDropXpMin).toBeInteger()
		expect(settings.xpDropXpMax).toBeInteger()
		expect(settings.xpDropMessage).toBeString()
		expect(settings.xpDropAmount).toBeInteger()
		expect(settings.xpDropTimeBetweenDrops).toBeInteger()
		expect(settings.xpDropExpiresAfter).toBeInteger()
		expect(settings.xpDropCount).toBeInteger()
		expect(
			settings.xpDropLastDrop === null ||
				settings.xpDropLastDrop instanceof Date
		).toBeTrue()
		expect(
			settings.rankCardBackground === null ||
				typeof settings.rankCardBackground === "string"
		).toBeTrue()
		expect(
			settings.rankCardPrimaryColor === null ||
				typeof settings.rankCardPrimaryColor === "string"
		).toBeTrue()
		expect(
			settings.rankCardSecondaryColor === null ||
				typeof settings.rankCardSecondaryColor === "string"
		).toBeTrue()
		expect(settings.weeklyLeaderboardsEnabled).toBeBoolean()
		expect(settings.monthlyLeaderboardsEnabled).toBeBoolean()
		expect(settings.weekStartsOnMonday).toBeBoolean()
		expect(
			settings.leaderboardVanity === null ||
				typeof settings.leaderboardVanity === "string"
		).toBeTrue()
		expect(settings.xpFormula).toBeString()
		expect(settings.voiceXpEnabled).toBeBoolean()
		expect(settings.voiceXpPerMinute).toBeInteger()
		expect(settings.voiceXpUserMinimum).toBeInteger()
		expect(
			settings.proxyTupperboxChannel === null ||
				typeof settings.proxyTupperboxChannel === "string"
		).toBeTrue()
		expect(settings.pluralKitEnabled).toBeBoolean()
		expect(settings.pluralKitFronterOnly).toBeBoolean()
	})
})

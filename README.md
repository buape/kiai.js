# kiai.js

[![npm version](https://img.shields.io/npm/v/kiai.js/latest.svg)](https://www.npmjs.com/package/kiai.js)
[![License](https://img.shields.io/npm/l/kiai.js.svg)](https://github.com/buape/kiai.js/blob/main/LICENSE)
[![CI Status](https://github.com/buape/kiai.js/workflows/CI/badge.svg)](https://github.com/buape/kiai.js/actions)
[![Node Version](https://img.shields.io/node/v/kiai.js)](https://nodejs.org)

The official JavaScript/TypeScript API library for Kiai - a powerful Discord leveling and rewards system.

## Installation

```bash
# Using npm
npm install kiai.js

# Using yarn
yarn add kiai.js

# Using pnpm
pnpm add kiai.js

# Using bun
bun add kiai.js
```

## Quick Start

```typescript
import { KiaiClient } from "kiai.js"

const kiai = new KiaiClient("your-api-key") // API v3 by default

const member = await kiai.leveling.getMember("guild_id", "user_id")
console.log(`User XP: ${member?.xp ?? 0}`)
```

## Documentation

For detailed documentation, visit our [documentation site](https://kiai.app/docs/kiai.js).

## Handlers

kiai.js provides several handlers to interact with different aspects of the API. These handlers mirror the API categories on our [API v3 docs](https://www.kiai.app/api/v3/docs/json).

- `Leveling` - Levels, XP, prestige, leaderboards, and server stats
- `Rewards` - Declarative rewards, reward paths, capabilities, and reconciliation jobs
- `LeaderboardRoles` and `AutoLeaderboards` - Leaderboard role and message management
- `LevelUpMessages` - Read configured level-up messages
- `Settings` - Read guild settings
- `Multipliers` and `Cooldowns` - XP multipliers and cooldown overrides
- `Denylist` - Manage denied channels, roles, and users
- `Misc` - Application, guild status, export, feature preview, and XP drop endpoints

## Examples

### Working with Levels

```typescript
// Add XP to a user
await kiai.leveling.addXp("guild_id", "user_id", 100)

// Query a leaderboard by category and period
const leaderboard = await kiai.leveling.getLeaderboard("guild_id", {
	type: "xp",
	time: "WEEK",
	start: 1,
	end: 10
})
```

### Managing Rewards

```typescript
// Create a role reward
const reward = await kiai.rewards.createReward("guild_id", {
	type: "ROLE",
	threshold: { level: 10, prestige: null },
	eligibility: { requiredRoleId: null },
	config: { roleId: "role_id", operation: "ADD", durationMs: null }
})

// List rewards (or filter by type, level, and prestige)
const rewards = await kiai.rewards.getRewards("guild_id", { type: "ROLE" })
```

### Reward Paths

```typescript
const path = await kiai.rewards.createPath("guild_id", { name: "Explorer" })
const paths = await kiai.rewards.getPaths("guild_id")
const current = await kiai.rewards.getPath("guild_id", path.id)

// Replaces all editable fields. Use archived: true to archive instead of deleting.
await kiai.rewards.replacePath("guild_id", path.id, {
	name: current.name,
	description: current.description,
	emoji: current.emoji,
	archived: false
})

const settings = await kiai.rewards.getPathSettings("guild_id")
await kiai.rewards.setPathSettings("guild_id", { allowRewardPathSwitching: true })
const memberPath = await kiai.rewards.getMemberPath("guild_id", "user_id")
await kiai.rewards.assignMemberPath("guild_id", "user_id", {
	rewardPathId: path.id,
	expectedRewardPathId: memberPath.rewardPathId
})
```

Assignment returns `synced` as well as the member and path IDs. Omit `expectedRewardPathId` to skip the concurrency check; `null` expects no current path. Role reward create/update inputs also accept `rewardPathId`: `null` means Everyone, while omission on update preserves the current assignment. Other reward types do not accept it. Path operations require the guild's rewards-path experiment and appropriate API permissions; server errors propagate normally. An archived path cannot be newly assigned.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/buape/kiai.js/issues)
- [Discord Server](https://discord.gg/NNNsHfbrm2)

## Credits

Developed and maintained by [Buape Studios](https://buape.com).

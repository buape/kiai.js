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
import { KiaiClient } from 'kiai.js';

// Initialize the client
const kiai = new KiaiClient({
    apiKey: 'your-api-key'
});

// Example: Get user level
const userLevel = await kiai.leveling.getUserLevel('guild_id', 'user_id');
console.log(`User level: ${userLevel}`);
```

## Documentation

For detailed documentation, visit our [documentation site](https://kiai.app/docs/kiai.js).

## Handlers

kiai.js provides several handlers to interact with different aspects of the API. These handlers mirror the API categories on our [API docs](https://api.kiai.app/v2/docs).

- `Leveling` - Manage user levels and XP
- `Rewards` - Configure and manage level rewards
- `LeaderboardRoles` - Handle leaderboard-based role assignments
- `Settings` - Manage guild settings
- `Multipliers` - Configure XP multipliers
- `Denylist` - Manage denied channels and roles
- `Misc` - Miscellaneous API interactions

## Examples

### Working with Levels

```typescript
// Get user XP
const xp = await kiai.leveling.getUserXp('guild_id', 'user_id');

// Add XP to user
await kiai.leveling.addXp('guild_id', 'user_id', 100);

// Get guild leaderboard
const leaderboard = await kiai.leveling.getLeaderboard('guild_id');
```

### Managing Rewards

```typescript
// Add a level reward
await kiai.rewards.createReward('guild_id', {
    level: 10,
    roleId: 'role_id'
});

// Get all rewards
const rewards = await kiai.rewards.getRewards('guild_id');
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/buape/kiai.js/issues)
- [Discord Server](https://discord.gg/NNNsHfbrm2)

## Credits

Developed and maintained by [Buape Studios](https://buape.com).
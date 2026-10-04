---
"kiai.js": patch
---

feat: type the level-up message kit data

The `LevelUpMessage.messageKitData` field was typed as `unknown`. It now
exposes the actual Message Kit draft structure Kiai stores for a level-up
message: the message body is broken into `items` (message components,
including the images rendered at the bottom of the message via `MediaGallery`
/ `Thumbnail`), alongside delivery `flags` and optional `attachments` /
`actions`.

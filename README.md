![Header](https://cdn.discordapp.com/attachments/1255151320428707933/1255248088189243523/Adsz_tasarm_1.gif?ex=667c7061&is=667b1ee1&hm=00cc82377fe5d0e9512f521730b96c12f3b921a756803a5bbeb40e7a1de1343b&)


# AternosX ⏱️

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

**Keep your Aternos server alive 24/7.**

Please star this project ⭐




## Features 📙

- Moving around itself
- Easy start
- Self sign up sign in (coming soon)
- Compatible with all versions

  # Setup ⚙
1. Join your server.
2. Build a bedrock room somewhere, and stay in there.(Recommended room size: `X5 Y3 Z5`)
3. Go to [DanHosting](https://discord.gg/dbh).
4. After entering the Discord server, we go to the command channel and write: dbh!server create NodeJs
5. We go to https://github.com/ZambakExe/AternosX and download it.
6. sonra https://panel.danbot.host/ adresine gidelim ve oluşturduğumuz server a girelim ardından startup sekmesine girelim main fileyı bot.js olarak değiştirelim
7. Then let's go to the file tab and add the downloaded file here.
8. Let's start our bot from the console
9. **Teleport the bot into the bedrock room, change the bot's gamemode to `Creative` to not die!**
## FAQ ❓

## How to fix `unsupported/unknown protocol version: ###, update minecraft-data`?

```bash
This project is using the `mineflayer` module.  
It may not supported on your server version yet.
I'm trying to periodically check for updates, so please be patient.
```
## My bot leaves permanently after n hours.


```bash
Aternos automatically bans AFK players from your server.
So just unban your bot, if it's banned.
```
## How to fix Invalid move player packet received?

```bash
It seems your bot escaped from the bedrock room.    
So you have to wipe the playerdata in your server.  
1. Go to the management page of your Aternos server.
2. Click `Files` in the left section.
3. Delete the `world/playerdata/<UUID>.dat`, `<UUID>.dat_old` file. (the UUID is your bot's UUID)
4. Restart the bot.
```



  
## CAUTION ⚠

### Aternos might detect your suspicious actions and delete your account!  
**By using this, you acknowledge that you're responsible for any problems arise.**  

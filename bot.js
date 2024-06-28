const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');

const centerPosition = new Vec3(-146, 59, 38); // Center point (for example, let's think of it as (x=0, y=4, z=0))
const squareSize = 3; // Square size (side length)
const moveInterval = 5000; // Waiting time between each corner movement (in milliseconds)

const bedStand = new Vec3(-147, 59, 38);
const bed_coord = new Vec3(-146, 59, 38);
var sleepingPlayers = 0;

const sleepmessages = [
  "Be advised, I am eepy.",
  "Stand by for honk-shoo.",
  "All units, my tummy hurts. Requesting a blankie and a cup of hot choccy.",
  "Nighty night, sleep tight, don't let the bed bugs bite.",
  "Eepy time.",
  "Zzz... Zzz... Zzz...",
  "yawn... I'm sleepy...",
];

const randomMessages = [
  "I've got a tip for you...",
  "FUCK! I stubbed my toe.",
  "The weather is nice today.",
  "Beep boop.",
  "Remember to drink water.",
  "The mitochondria is the powerhouse of the cell.",
  "Have you heard of the tragedy of Darth Plagueis the Wise?",
  "Creeper, aw",
  "No one expects the Spanish Inquisition!",
  "Hello, world!",
  "My name is poopbot.",
  "the quick brown fox jumps over the lazy dog",
  "you wouldn't download a car"
];

let cornerIndex = 0;
const corners = [
  centerPosition.offset(squareSize, 0, squareSize), // upper right corner
  centerPosition.offset(-squareSize, 0, squareSize), // upper left corner
  centerPosition.offset(-squareSize, 0, -squareSize), // lower left corner
  centerPosition.offset(squareSize, 0, -squareSize) // Bottom right corner
];

function moveInSquare(bot) {
  const target = corners[cornerIndex];

  
  bot.once('move', () => checkCorner(bot, target));

  bot.pathfinder.setMovements(new Movements(bot, require('minecraft-data')(bot.version)));
  bot.pathfinder.setGoal(new goals.GoalBlock(target.x, target.y, target.z));

  console.log(`Bot ${bot.username} is moving towards the target: ${target}`);  // This code sends the character to Discord wherever it goes (delete the 2 slashes at the beginning of the code to unlock the code).

  cornerIndex = (cornerIndex + 1) % corners.length;
}

function findBed() {
  var cursor = Vec3();
  for(cursor.x = bot.entity.position.x - 4; cursor.x < bot.entity.position.x + 4; cursor.x++) {
    for(cursor.y = bot.entity.position.y - 4; cursor.y < bot.entity.position.y + 4; cursor.y++) {
      for(cursor.z = bot.entity.position.z - 4; cursor.z < bot.entity.position.z + 4; cursor.z++) {
        var block = bot.blockAt(cursor);
        if (block.type === 26) return block;
      }
    }
  }
}

function checkCorner(bot, target) {
  const pos = bot.entity.position.floored();
  if (pos.equals(target)) {
    
    const block = bot.blockAt(target);
    if (block && !block.boundingBox) {
      
      if (!bot.canDigBlock(block)) {
        console.log(`I don't have permission to break the block at the corner: ${block.name}`);
        sendWebhookMessage(`I don't have permission to break the block at the corner: ${block.name}`);
        
      } else {
        
        console.log(`Breaking the block at the corner: ${block.name}`);
        sendWebhookMessage(`Breaking the block at the corner: ${block.name}`);
        bot.dig(block);
      }
    }
  }
}

function createBot() {
  const bot = mineflayer.createBot({
    host: 'poopgc.aternos.me',    // Minecraft server IP address
    port: 35320,          // Port of the Minecraft server (default: 25565)
    username: 'poopbot',      // Bot's username
    version: '1.15.2'       // Minecraft server version (Up to 1.20 other versions work with "Via Version")
  });
  
  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log('Bot connected to the server');
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned'); // Discord WebHook : Bot has spawned
    moveInSquare(bot);
    setInterval(() => moveInSquare(bot), moveInterval); 

    setInterval(() => {
      if (Math.floor(Math.random() * 100) === 1) { // 1/100 chance
        const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        bot.chat(message);
      }
    }, 2500); // Check every 5 seconds
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`${username}: ${message}`);
    if (message === 'straight up jorkin it') { // Message (You can change this code)
      setTimeout(() => {  
        bot.chat("and by it... let's just say... my peanits"); // Feedback (You can change this code)
      }, 4000); // Sleep for 5 seconds (5000 milliseconds)
    }
    if (message === 'poopbot sleep') {
      bedBlock = bot.blockAt(bed_coord);
      bot.chat(sleepmessages[Math.floor(Math.random() * sleepmessages.length)]);
      bot.pathfinder.setGoal(new goals.GoalBlock(bedStand.x, bedStand.y, bedStand.z));
      setTimeout(() => {
        bot.sleep(bedBlock);
      }, 1000);
    }
  });

  bot.on('entitySleep', (entity) => {
    sleepingPlayers = sleepingPlayers + 1; // Ensure sleepingPlayers is declared elsewhere
    let playerCount = Object.keys(bot.players).length;
    bot.chat(`Good night, ${entity.username}. ${sleepingPlayers} / ${playerCount} asleep.`);
    
    if (sleepingPlayers === playerCount - 1) {
      bot.chat('Going to bed!');
      var bedBlock = findBed();
      if (bedBlock) {
        bot.chat("counting sheep");
        bot.sleep(bedBlock);
      } else {
        bot.chat("no nearby bed");
      }
    }
  });


  bot.on('error', err => {
    console.error(`Bot error: ${err}`);
    setTimeout(createBot, 5000); // Reconnect after 5 seconds
  });

  bot.on('end', () => {
    console.log('Bot disconnected from the server');
    setTimeout(createBot, 5000); // Reconnect after 5 seconds
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log(`Bot was kicked from the server: ${reason}`); // Terminal : Bot was kicked from the server
  });

  bot.on('death', () => {
    console.log('Bot died'); // Discord WebHook : The bot is dead
  });

  bot.on('entitySleep', (entity) => {
    if (entity === bot.entity) return;
    sleepingPlayers++;
    playerCount = Object.keys(bot.players).length;
    bot.chat(`Good night, ${entity.username}. (${sleepingPlayers}/${playerCount-1})`);
    if (sleepingPlayers === playerCount-1) {
      bedBlock = bot.blockAt(bed_coord);
      bot.chat(sleepmessages[Math.floor(Math.random() * sleepmessages.length)]);
      bot.pathfinder.setGoal(new goals.GoalBlock(bedStand.x, bedStand.y, bedStand.z));
      setTimeout(() => {
        bot.sleep(bedBlock);
      }, 1000);
    }
  });

  bot.on('entityWake', (entity) => {
    if (entity === bot.entity) return;
    playerCount = Object.keys(bot.players).length;
    sleepingPlayers--;
    // bot.chat(`Good morning, ${entity.username}. (${sleepingPlayers}/${playerCount-1})`);
  });
}

createBot();
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');
const axios = require('axios');

// const WEBHOOK_URL = ' '; //Add your Discord Webhook URL here

function sendWebhookMessage(message) {
  //axios.post(WEBHOOK_URL, {
  //  content: message
  //}).catch(error => {
  //  console.error('Discord Webhook hatası:', error);
  //});
}

const centerPosition = new Vec3(-14488, 90, 13817); // Center point (for example, let's think of it as (x=0, y=4, z=0))
const squareSize = 3; // Square size (side length)
const moveInterval = 5000; // Waiting time between each corner movement (in milliseconds)

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
    sendWebhookMessage('Bot connected to the server');
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned'); // Discord WebHook : Bot has spawned
    sendWebhookMessage('Bot has spawned'); // Discord WebHook : Bot has spawned
    moveInSquare(bot);
    setInterval(() => moveInSquare(bot), moveInterval); 
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`${username}: ${message}`);
    // sendWebhookMessage(`${username} said: ${message}`);

    if (message === 'straight up jorkin it') { // Message (You can change this code)
      setTimeout(() => {
        bot.chat("and by it... let's just say... my peanits"); // Feedback (You can change this code)
      }, 4000); // Sleep for 5 seconds (5000 milliseconds)
    }
  });

  bot.on('error', err => {
    console.error(`Bot error: ${err}`);
    sendWebhookMessage(`Bot error: ${err}`);
    setTimeout(createBot, 5000); // Reconnect after 5 seconds
  });

  bot.on('end', () => {
    console.log('Bot disconnected from the server');
    sendWebhookMessage('Bot disconnected from the server');
    setTimeout(createBot, 5000); // Reconnect after 5 seconds
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log(`Bot was kicked from the server: ${reason}`); // Terminal : Bot was kicked from the server
    sendWebhookMessage(`Bot was kicked from the server: ${reason}`); // Discord WebHook : Bot was kicked from the server
  });

  bot.on('death', () => {
    console.log('Bot died'); // Discord WebHook : The bot is dead
    sendWebhookMessage('Bot died'); // Discord WebHook : The bot is dead
  });
}

createBot();

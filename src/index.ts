import { Client, GatewayIntentBits } from 'discord.js';
import path from 'path';
import fs from 'fs';
const token = process.env.token || "";

if (!token) {
    throw new Error('missing .env');
}

const client = new Client({ intents: GatewayIntentBits.DirectMessages });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath).default;

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
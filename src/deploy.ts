import { REST, RESTPutAPIApplicationCommandsResult, Routes } from 'discord.js';
import 'dotenv/config'
import path from 'path';
import fs from 'fs';
const token = process.env.token || "";
const clientid = process.env.clientid || "";

if (!(token || clientid)) {
    throw new Error('missing .env');
}

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file == 'command.js');
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
		try {
		console.log(`refreshing ${commands.length} commands`);

		const data = await rest.put(Routes.applicationCommands(clientid), { body: commands }) as RESTPutAPIApplicationCommandsResult;

		console.log(`reloaded ${data.length} commands :)`);
	} catch (error) {
		console.error(error);
	}
})();
import { AutocompleteInteraction, BaseApplicationCommandData, ChatInputCommandInteraction, Collection, SlashCommandBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';

export const commands = new Collection<string, Command>();

interface Command extends BaseApplicationCommandData {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	autocomplete: (interaction: AutocompleteInteraction) => Promise<void>;
}

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file == 'command.js');
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

console.log(`Commands Loaded:`)
console.log(commands);
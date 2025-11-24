import { Events, MessageFlags, InteractionType, Interaction, ChatInputCommandInteraction, AutocompleteInteraction, Collection, ButtonInteraction } from "discord.js";
import { commands } from "../commands";

export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) {
		switch (interaction.type) {
			case InteractionType.ApplicationCommand:
				await Execute('Command', commands, interaction.commandName);
				break;
			case InteractionType.ApplicationCommandAutocomplete:
				await Execute('Autocomplete', commands, interaction.commandName);
				break;
			default:
				console.error(`Unhandled interaction: ${interaction.type}`);
			return;
		}
		async function Execute(type: 'Button' | 'Command' | 'Autocomplete', Object: Collection<string, any>, name: string){
			const item = Object.get(name);

			if (!item) {
				console.error(`No ${type} matching ${name} was found.`);
			}

			try {
				if (type === 'Autocomplete'){
					await item.autocomplete(interaction as AutocompleteInteraction);
				} else {
					await item.execute(interaction as ChatInputCommandInteraction | ButtonInteraction);
				}
			} catch ( error ) {
				console.error(error);
				if (interaction.isRepliable() && !interaction.replied) {
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				} else if ('followUp' in interaction) {
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
			}
		}
	},
};

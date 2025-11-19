import { ApplicationIntegrationType, ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setContexts([ InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel ])
		.setIntegrationTypes([ ApplicationIntegrationType.UserInstall ]),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('Pong!');
		
	},
};
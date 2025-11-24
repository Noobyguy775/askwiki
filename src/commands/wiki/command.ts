import { ApplicationIntegrationType, ChatInputCommandInteraction, EmbedBuilder, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { FetchPage, wikis } from "./wikis";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Searches a wiki for a page. Defaults to Wikipedia.')

        .addStringOption(option => 
            option.setName('query')
                .setDescription('The search query')
                .setRequired(true)
        )

        .addStringOption(option =>
            option.setName('wiki')
                .setDescription('The wiki to search on. Defaults to English Wikipedia.')
                .setRequired(false)
                .setChoices(wikis.map(wiki => ({ name: wiki.name, value: wiki.name })))
        )
        .setContexts([ InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel ])
        .setIntegrationTypes([ ApplicationIntegrationType.UserInstall ]),
    async execute(interaction: ChatInputCommandInteraction) {
        const wiki = wikis.find(w => w.name === interaction.options.getString('wiki')!) || wikis[0]!;
        const fetch = new FetchPage(interaction.options.getString('query')!, wiki);
        let embed: EmbedBuilder;

        try {
            switch (fetch.wiki.name) {
                case 'English Wikipedia':
                    embed = await fetch.fromWikipedia();
                    break;
                case 'BSS Fandom':
                    embed = await fetch.fromFandom(fetch.wiki.api);
                    break;
            }
        } catch (error) {
            await interaction.reply({ content: (error as Error).message, flags: MessageFlags.Ephemeral });
            return;
        }

        await interaction.reply({ embeds: [embed!] });
    }
}
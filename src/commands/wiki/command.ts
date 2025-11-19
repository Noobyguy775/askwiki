import { ApplicationIntegrationType, ChatInputCommandInteraction, EmbedBuilder, InteractionContextType, MessageFlags, SlashCommandBuilder, version as djsversion } from "discord.js";
import { version } from '../../../package.json';
import { MediaWikiAPISearchResult } from "./types";
import { wikis } from "./wikis";

import { stripHtml } from "string-strip-html";

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
        const wiki = wikis.find(w => w.name == interaction.options.getString('wiki')) || wikis[0]!;
        const query = interaction.options.getString('query') as string;

        const url = `${wiki.api}search/page?q=${query}&limit=1`;
        const userAgent = `AskWikiDiscordbot/${version} bot (github.com/Noobyguy775/askwiki) discord.js/${djsversion}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': userAgent
            }
        });

        if (response.status !== 200) {
            await interaction.reply(`Failed to fetch from wiki. Maybe it's down?`);
            return;
        }

        const FoundPages = ((await response.json()) as MediaWikiAPISearchResult);

        if (FoundPages.pages.length === 0) {
            await interaction.reply({ content: `No results found for "${query}" on the selected wiki.`, flags: MessageFlags.Ephemeral });
            return;
        }

        const page = FoundPages.pages[0]!;
        const pageurl = `${wiki.pages}${page.key}`;

        const pagepreview = new EmbedBuilder()
            .setTitle(page.title)
            .setURL(pageurl)
            .setColor(0xf2ae26)
            .setDescription(`${stripHtml(page.excerpt).result}[...](${pageurl})` + (page.title !== query ? `\n\n-# Showing similar page for query '*${query}*'` : ''));
        
        if (page.thumbnail) {
            pagepreview.setThumbnail(`https:${page.thumbnail.url}`);
        }

        await interaction.reply({ embeds: [pagepreview] });
    }
}
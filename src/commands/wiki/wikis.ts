import { version as djsversion, EmbedBuilder } from "discord.js";
import { stripHtml } from "string-strip-html";

import { version } from '../../../package.json';

import { MediaWikiApiPage, MediaWikiApiSearch } from "./types";

export const wikis = [
    {
        name: 'English Wikipedia',
        api: 'https://en.wikipedia.org/w/rest.php/v1',
        pages: 'https://en.wikipedia.org/wiki/'
    },
    {
        name: 'BSS Fandom',
        api: 'https://bee-swarm-simulator.fandom.com/rest.php/v1',
        pages: 'https://bee-swarm-simulator.fandom.com/wiki/'
    }
] as wiki[];

export interface wiki {
    name: string;
    api: string;
    pages: string;
}

export class FetchPage {
    wiki: wiki;
    query: string;
    api: MediaWikiRESTApi;

    constructor(query: string, wiki: wiki){
        this.wiki = wiki;
        this.query = query;

        this.api = new MediaWikiRESTApi(`AskWikiBot/${version} (github.com/Noobyguy775/askwiki) discord.js/${djsversion}`);
    }
    async fromWikipedia(){
        const page = await this.api.SearchPage(this.wiki.api, this.query)

        const pageurl = `${this.wiki.pages}${page.key}`;

        const pagepreview = new EmbedBuilder()
            .setTitle(page.title)
            .setURL(pageurl)
            .setColor(0xf2ae26)
            .setDescription(`${stripHtml(page.excerpt).result}[...](${pageurl})` + (page.title !== this.query ? `\n\n-# Showing similar page for query '*${this.query}*'` : ''));
        
        if (page.thumbnail) {
            pagepreview.setThumbnail(`https:${page.thumbnail.url}`);
        }
        return pagepreview as EmbedBuilder;
    }

    async fromFandom(apiUrl: string){
        const SearchResult = await this.api.SearchPage(apiUrl, this.query);

        const page = await this.api.FetchPage(apiUrl, SearchResult.key);

        const pageurl = `${this.wiki.pages}${page.key}`;

        const excerpt = 'removed for testing'

        const pagepreview = new EmbedBuilder()
            .setTitle(SearchResult.title)
            .setURL(pageurl)
            .setColor(0xf2ae26)
            .setDescription(`${stripHtml(excerpt).result}[...](${pageurl})` + (SearchResult.title !== this.query ? `\n\n-# Showing similar page for query '*${this.query}*'` : ''));
        
        return pagepreview as EmbedBuilder;
    }
}

class MediaWikiRESTApi {
    userAgent;
    constructor(userAgent: string){
        this.userAgent = userAgent;
    }

    async SearchPage(url: string, query: string){
        const API_URL = `${url}/search/page?q=${query}&limit=1`;

        const response = await this.fetch(API_URL);

        const FoundPages = (await response.json()) as { pages: MediaWikiApiSearch[] };

        if (FoundPages.pages.length === 0) {
            throw new Error(`No results found`);
        }

        return FoundPages.pages[0]!;
    }

    async FetchPage(url: string, title: string){
        const API_URL = `${url}/page/${title}/with_html`;

        const response = await this.fetch(API_URL);

        return (await response.json()) as MediaWikiApiPage & { html: string };
    }

    async fetch(url: string, method: 'GET' | 'POST' | 'HEAD' | 'PUT' = 'GET', contentType: string = 'application/json'){
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': contentType,
                'User-Agent': this.userAgent
            }
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch from wiki. Maybe it's down?`);
        }

        return response;
    }
}
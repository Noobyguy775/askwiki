import { ApplicationCommandOptionChoiceData } from "discord.js";

export const wikis = [
    {
        name: 'English Wikipedia',
        api: 'https://en.wikipedia.org/w/rest.php/v1/',
        pages: 'https://en.wikipedia.org/wiki/'
    },
    {
        name: 'BSS Fandom',
        api: 'https://bee-swarm-simulator.fandom.com/rest.php/v1/',
        pages: 'https://bee-swarm-simulator.fandom.com/wiki/'
    }
]

export const Autocompletewikis = new Array() as ApplicationCommandOptionChoiceData[];

for (const wiki of wikis) {
    Autocompletewikis.push({ name: wiki.name, value: wiki.name });
}
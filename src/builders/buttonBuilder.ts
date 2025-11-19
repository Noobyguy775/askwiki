import { Collection,ButtonBuilder, ButtonStyle, APIMessageComponentEmoji } from 'discord.js';
/**
 * @description Used for building button interactions for easy reusal
 * To use: Call `new ButtonCommandBuilder(name, description)` in the command file
 */
export class ButtonCommandBuilder { 
    static buttons = new Collection<string, ButtonData>();
    button = {} as ButtonData;
    constructor() {
        return this;
    }

    /**
     * Set a Developer-defined identifier for the button
     * @param {string} customID
     * @see {@link https://discord.com/developers/docs/components/reference#button}
     * @returns this
    */
    setcustomID(customID: string){
        this.button.customID = customID;
        return this;
    }

    /**
     * Set a label for the button
     * @param {string} label - MAX 80 characters
     * @see {@link https://discord.com/developers/docs/components/reference#button}
     * @returns this
    */
    setLabel(label: string){
        this.button.label = label;
        return this;
    }

    /**
     * Set a style for the button
     * @param ButtonStyle
     * @see {@link https://discord.com/developers/docs/components/reference#button}
     * @returns this
    */
    setStyle(style: ButtonStyle){
        this.button.style = style;
        return this;
    }

    /**
     * Set if button is disabled
     * @param boolean
     * @see {@link https://discord.com/developers/docs/components/reference#button}
     * @returns this
    */
    setDisabled(disabled: boolean){
        this.button.disabled = disabled;
        return this;
    }

    /**
     * Set if button is disabled
     * @param boolean
     * @see {@link https://discord.com/developers/docs/components/reference#button}
     * @returns this
    */
    setEmoji(emoji: APIMessageComponentEmoji){
        this.button.emoji = emoji;
        return this;
    }

    /**
     * Set URL for button (must use Link button style)
     * @param string
     * @see {@link https://discord.com/developers/docs/components/reference#button}
     * @returns this
    */
    setUrl(url: string){
        this.button.url = url;
        return this;
    }

    /**
     * Loads the button using ButtonBuilder for use in the data field of a command
     * @see {@link https://discord.js.org/docs/packages/builders/main/ButtonBuilder:TypeAlias}
     * @returns ButtonBuilder
     */
    static loadButton(name: string){
        const data = ButtonCommandBuilder.buttons.find(b => b.name === name);

        if (!data) {
            throw new Error(`[buttonBuilder] Button with the customID "${name}" not found in collection.`);
        }

        try {
            const buttonData = new ButtonBuilder()
                .setCustomId(data.customID)
                .setLabel(data.label)
                .setStyle(data.style || ButtonStyle.Primary)
                .setDisabled(data.disabled);

            if (data.emoji){
                buttonData.setEmoji(data.emoji);
            }
            if (data.url){
                buttonData.setURL(data.url);
            }
            if (data.sku_id){
                buttonData.setSKUId(data.sku_id);
            }

            return buttonData;
        } catch (error: any) {
            throw new Error(`[buttonBuilder] Failed to load button: ${error.message}`)
        }
    }

    /**
     * Converts the button to a JSON object with data for
     * @returns {Object|null}
     */
    toJSON(){
        return {
            ...this.button
        };
    }
}

export interface ButtonData {
    name: string,
    customID: string,
    description: string,
    label: string,
    style?: ButtonStyle,
    emoji?: APIMessageComponentEmoji,
    disabled?: boolean,
    url?: string,
    sku_id?: string
}
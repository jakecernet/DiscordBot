const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('favicon-grabber')
        .setDescription('Pridobi favicon iz spletne strani.')
        .addStringOption(option => option.setName('url').setDescription('URL spletne strani, iz katere želiš pridobiti favicon.').setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        await interaction.reply('https://www.google.com/s2/favicons?sz=64&domain_url=' + url);
    }
};
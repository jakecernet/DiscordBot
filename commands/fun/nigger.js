const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nigger')
        .setDescription('Calls you nigger.'),
    async execute(interaction) {
        await interaction.reply('You are a nigger!');
    },
};
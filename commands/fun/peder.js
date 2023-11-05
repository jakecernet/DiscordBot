const { SlashCommandBuilder } = require('discord.js')

vzdevki = ["peder", "pederčina", "pedr", "pederček", "Murko"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('peder')
        .setDescription('Ti si peder.'),
    async execute(interaction) {
        await interaction.reply('Živjo ' + vzdevki[Math.floor(Math.random() * vzdevki.length)] + '!');
    },
};
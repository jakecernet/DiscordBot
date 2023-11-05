const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('Generira QR kodo iz besedila.')
        .addStringOption(option => option.setName('text').setDescription('Besedilo, ki ga želiš pretvoriti v QR kodo.').setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        await interaction.reply('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + text);
    },
};
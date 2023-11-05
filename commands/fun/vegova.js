const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vegova')
        .setDescription('Pokaže, koliko je še do konca šolanja na Vegovi.'),
    async execute(interaction) {
        const endDate = new Date('2026-06-25T00:00:00');
        const today = new Date();
        const diff = endDate - today;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365);
        const months = Math.floor((days - years * 365) / 30);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        const daysLeft = days - years * 365 - months * 30;
        await interaction.reply(`Še ${years} let, ${months} mesecev, ${daysLeft} dni, ${hours} ur, ${minutes} minut in ${seconds} sekund do konca šolanja na Vegovi.`);
    },
};
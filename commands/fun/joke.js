const { SlashCommandBuilder } = require('discord.js');
const fetch = require('isomorphic-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Pove šalo.'),
    async execute(interaction) {
        try {
            const apiUrl = 'https://official-joke-api.appspot.com/random_joke';

            const response = await fetch(apiUrl);
            const jokeData = await response.json();

            const jokeSetup = jokeData.setup;
            const jokePunchline = jokeData.punchline;

            const jokeResponse = `**Setup:** ${jokeSetup}\n**Punchline:** ${jokePunchline}\n **Kategorija:** ${jokeData.type}`;

            await interaction.reply(jokeResponse);
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching a joke.');
        }
    },
};
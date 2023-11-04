const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Provides the avatar of the user.'),
    async execute(interaction) {
        await interaction.reply(`${interaction.user.displayAvatarURL({dynamic: true})}`);
    },
};
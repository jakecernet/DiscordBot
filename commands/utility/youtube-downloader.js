const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube-downloader')
        .setDescription('Prenese video iz YouTube-a.')
        .addStringOption(option => option.setName('link').setDescription('Povezava do videa, ki ga želiš prenesti.').setRequired(true)),
    async execute(interaction) {
        try {
            const link = interaction.options.getString('link');
            const title = await ytdl.getBasicInfo(link);
            const filename = title.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3';
            const path = './downloads/' + filename;

            // Create the downloads directory if it doesn't exist
            if (!fs.existsSync('./downloads')) {
                fs.mkdirSync('./downloads');
            }

            const video = ytdl(link, { filter: 'audioonly' });
            const fileStream = fs.createWriteStream(path);

            video.pipe(fileStream);

            // Defer the initial reply
            await interaction.deferReply({ content: 'Downloading...' });

            fileStream.on('finish', async () => {
                // Send the file as an attachment once the writing is complete
                await interaction.followUp({
                    content: 'Download complete!',
                    files: [{
                        attachment: path,
                        name: filename
                    }]
                });

                // Optionally, you can delete the file after sending
                fs.unlinkSync(path);
            });

            fileStream.on('error', (err) => {
                console.error('Error writing file:', err);
                interaction.followUp('There was an error downloading the file.');
            });
        } catch (error) {
            console.error('Error in command execution:', error);
            interaction.followUp('An error occurred during command execution.');
        }
    },
};

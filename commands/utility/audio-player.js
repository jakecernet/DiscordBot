const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, StreamType, AudioPlayerStatus } = require('@discordjs/voice');

const player = createAudioPlayer();

player.on(AudioPlayerStatus.Playing, () => {
    console.log('The audio player has started playing!');
});

player.on('error', error => {
    console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    // You can choose to play a new audio resource or stop playback here
    // For now, let's stop playback
    player.stop();
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('audio-player')
        .setDescription('Predvaja glasbo iz YouTube-a.')
        .addStringOption(option => option.setName('link').setDescription('Povezava do videa, ki ga želiš predvajati.').setRequired(true)),
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
                // Check if the member is in a voice channel
                const memberVoiceChannel = interaction.member.voice.channel;
                if (!memberVoiceChannel) {
                    return interaction.followUp('You need to be in a voice channel to use this command.');
                }

                // Join the voice channel using @discordjs/voice
                const connection = joinVoiceChannel({
                    channelId: memberVoiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                // Create an audio resource
                const resource = createAudioResource(path, {
                    inputType: StreamType.Arbitrary,
                });

                // Play the audio resource
                player.play(resource);
                connection.subscribe(player);

                // Send a message when the audio is finished playing
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        interaction.followUp('Finished playing!');
                        connection.destroy();
                    }
                });
            });
        } catch (error) {
            console.error('Error in command execution:', error);
            interaction.followUp('An error occurred during command execution.');
        }
    },
};

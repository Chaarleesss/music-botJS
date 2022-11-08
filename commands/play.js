const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play a song from YouTube.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Searches for a song and plays it")
        .addStringOption((option) => option.setName("searchsong").setDescription("search keywords").setRequired(true))
    ),

  execute: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel) return interaction.reply("You need to be in a Voice Channel to play a song.");

    // nunggu
    const queue = await client.player.createQueue(interaction.guild);

    if (!queue.connection) await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) return interaction.reply("No results");

      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }
    {
      let url = interaction.options.getString("searchsong");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) return interaction.editReply("No results");

      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }

    if (!queue.playing) await queue.play();

    await interaction.reply({
      embeds: [embed],
    });
  },
};

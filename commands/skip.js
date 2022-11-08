const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      await interaction.reply("There are no songs in the queue");
      return;
    }

    const currentSong = queue.current;

    queue.skip();

    await interaction.reply({
      embeds: [new EmbedBuilder().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)],
    });
  },
};

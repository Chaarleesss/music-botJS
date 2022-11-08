const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("exit").setDescription("Kick the bot from the channel."),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      await interaction.reply("There are no songs in the queue");
      return;
    }

    queue.destroy();

    await interaction.reply("babaii");
  },
};

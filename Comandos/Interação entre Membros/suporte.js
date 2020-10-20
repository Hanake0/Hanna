const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class SuporteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'suporte',
      aliases: ['staff'],
      group: 'interação',
      memberName: 'suporte',
      clientPermissions: ['ADMINISTRATOR'],
      guildOnly: true,
      description: 'Cria um chat separado para entrar em contato com a Staff',
      details: 'Serve para entrar em contato com a staff facilmente em caso de dúvida ou sugestão caso, por exemplo, não estejam online.',
      args: [
        {
            key: 'motivo',
            prompt: 'Com o quê podemos ajudar?',
            type: 'string',
            default: '',
        }
      ]
    });
  }
  
  async run(message, { motivo }) {
    const mencao = `suporte ${message.author.username}  ${message.author.id}`
    const canal = {
      type: "text",
      parent: '728074741792899123',
      permissionOverwrites: [
        {
          id: message.author.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
      ],
    }
    
    const canalSuporte = await message.guild.channels.create(mencao, canal, "canal de denúncia");
    message.delete()
    canalSuporte.send(`Canal criado com sucesso ${message.author}.`);
    if (!motivo) return canalSuporte.send('Com o que podemos ajudar?');
    const embed = new Discord.MessageEmbed()
        .setColor('#24960e')
        .setDescription(`Motivo de contato: ${motivo}`);
    canalSuporte.send(embed);
}
};
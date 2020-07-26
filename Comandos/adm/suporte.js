const { Command } = require('../../commando discord.js-v12/src/index.js');
const Discord = require('discord.js');

module.exports = class SuporteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'suporte',
      aliases: ['staff'],
      group: 'adm',
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
            default: null
        }
      ]
    });
  }
  
  async run(message, { motivo }) {
    const mencao = `${message.author.username}  ${message.author.id}`
    const canal = {
      name: `Suporte ${mencao}`,
      type: "text",
      parent: '728074741792899123',
      permissionOverwrites: [{
          id: message.author.id,
          allow: ['READ_MESSAGES', 'SEND_MESSAGES'],
        },
        {
          id: message.guild.defaultRole.id,
          deny: ['READ_MESSAGES'],
        }],
    }
    
    const canalSuporte = await message.guild.createChannel(mencao, canal, "canal de denuncia");
    message.delete()
    canalSuporte.send(`Canal criado com sucesso ${message.author}.`);
    if (!motivo) return canalSuporte.send('Com o que podemos ajudar?');
    const embed = new Discord.RichEmbed()
        .setColor('#24960e')
        .setDescription(`Motivo de contato: ${motivo}`);
}
};
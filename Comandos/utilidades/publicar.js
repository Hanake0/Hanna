const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class PublicarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'publicar',
      aliases: ['postar', 'publish', 'enviar'],
      group: 'utilidades',
      memberName: 'publicar',
      clientPermissions: ['ADMINISTRATOR'],
      description: 'Envia sua foto no "Facebook" do servidor...',
      details: 'Só funciona quando um arquivo está anexado a mensagem, então certifique-se de anexar uma.',
      args: [
        {
            key: 'título',
            prompt: 'Qual deve ser o título da sua publicação?',
            type: 'string',
            default: 'sem título',
            max: 256,
        }
      ]
    });
  }
  
    async run(message, { título }) {
        const instagram = message.client.guilds.cache.find((a) => a.id === '698560208309452810').channels.cache.find(chnl => chnl.name.toLowerCase().includes('waifusbook'))
        const img = message.attachments.first()
       
        if (img) {
            const publicação = new Discord.MessageEmbed()
            .setColor( message.member ? message.member.displayColor : Math.floor(Math.random() * 16777214) + 1)
            .setTitle(título)
            .setAuthor(message.author.username, message.author.avatarURL())
            .setImage(img.url)
            .setTimestamp()
            .setFooter('Não sabe como fazer suas publicações? hajuda publicar', message.client.user.avatarURL());

            await instagram.send({embed: publicação}).then(pub => {
                message.react('738900367814819940')
                if (message.channel.id === '698678688153206915') message.delete();
                pub.react('👍')
                    .then(() => pub.react('👎'));
            }, err => message.reply(`algo deu errado...\n${err.name}:${err.name}`));
        }
        else message.reply('cadê a image?');
    }
};
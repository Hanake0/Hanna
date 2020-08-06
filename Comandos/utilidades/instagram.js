const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class InstagramCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'instagram',
      aliases: ['instagram-postar'],
      group: 'adm',
      memberName: 'instagram',
      clientPermissions: ['ADMINISTRATOR'],
      ownerOnly: true,
      serverOnly: true,
      description: 'Envia sua foto no Instagram do servidor',
      details: '',
      args: [
        {
            key: 'usuário',
            prompt: 'de quem é a foto?',
            type: 'user',
        },
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
  
    async run(message, { usuário, título }) {
        const instagram = message.client.guilds.cache.find((a) => a.id === '698560208309452810').channels.cache.find(chnl => chnl.name.toLowerCase().includes('instagram'))
        const img = message.attachments.first()
       
        if (img) {
            const publicação = new Discord.MessageEmbed()
            .setColor( message.client.guilds.cache.find((a) => a.id === '698560208309452810').members.cache.find(u => u.id === usuário.id).displayColor)
            .setTitle(título)
            .setAuthor(usuário.username + '#' + usuário.discriminator, usuário.avatarURL())
            .setImage(img.url)
            .setTimestamp()
            .setFooter('Evento Galeria, envie sua foto/desenho para algum organizador do evento para participar', message.author.avatarURL());

            await instagram.send({embed: publicação}).then(pub => {
                message.react('738900367814819940')
                pub.react('❤️')
            }, err => message.reply(`algo deu errado...\n${err.name}:${err.name}`));
        }
        else message.reply('cadê a image?');
    }
};
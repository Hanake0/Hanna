import { Command } from '../../CommandoV12/src/index.js';
import Discord from 'discord.js';

export default class MamarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mamar',
      aliases: ['chupar'],
      group: 'interação',
      memberName: 'mamar',
      description: 'Mama um usuário ou adm do servidor.',
      guildOnly: true,
      blackListed: ['698678688153206915'],
      args: [
        {
          key: 'usuário',
          prompt: 'mamar quem?',
          type: 'user',
          default: ''
        },
			],
    });
  }

  async run(message, { usuário }) {
    const adms = message.guild.members.cache.filter( m => m._roles.includes('698565526527672331'));
    
    const mamado = usuário || adms.get(Array.from(adms.keys())[Math.floor(Math.random() * adms.size)]);
    
    const ações = ['mamou graciosamente', 'mamou delicadamente', 'MORDEU', 'mamou como um profissional'];
    
    const gifs = {
      'mamou graciosamente': ['https://cdn.discordapp.com/attachments/716538673084235790/753262719305515118/tenor.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262723441360986/316.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262781683335288/tenor_3.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262782576853153/tenor_4.gif', 'https://cdn.nekos.life/bj/bjl057.gif'],
      'mamou delicadamente': ['https://cdn.discordapp.com/attachments/716538673084235790/753262780315861092/tenor_5.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262765954564176/CG2H1Rs.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262721436221450/YzgIo75.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262728864465059/184916_v0_600x.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262715488960582/tenor_6.gif'],
      'MORDEU': ['https://cdn.discordapp.com/attachments/716538673084235790/753262718139498596/tumblr_218055b3f63abdd6c518692fba98d050_62b9b218_500.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262767489941624/df946fe46d73864e6dd53143727549e1d0135a6e_hq.gif'],
      'mamou como um profissional': ['https://cdn.discordapp.com/attachments/716538673084235790/753262784942309406/e13c8229894d80889e7ca543f5e5b174.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262782576853153/tenor_4.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262773919678495/tenor_2.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262762955636746/BLEDDeV.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262725924126810/9617eeb279df79dc5e53a731d7bfb3c723b150ad_hq.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262725651497050/5908-animated-animated-gif-blush-censored-erogos-eyes-closed-freezepop-gif-artifacts-licking-love-fe.gif', 'https://cdn.discordapp.com/attachments/716538673084235790/753262719381274714/Whenitsahotdayoutandtheicecream_fc5079e94385e77d4f7a218d2f460c3f.gif', 'https://cdn.nekos.life/bj/bjl179.gif']
    };
    
    const acao = ações[Math.floor(Math.random() * ações.length)];
    const gif = gifs[acao][Math.floor(Math.random() * gifs[acao].length)];
    
    const embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} ${acao} ${mamado}.`)
        .setImage(gif)
        .setFooter('hmmmmm, safada!', message.client.user.avatarURL());

    await message.say(embed);
    message.delete()

  }
};
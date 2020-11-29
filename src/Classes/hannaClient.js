import { CommandoClient } from '../../CommandoV12/src/index.js';
import { UsersManager } from './managers/usersManager.js';
import { VIPsManager } from './managers/VIPsManager.js';
import { ColorsManager } from './managers/colorsManager.js';
import Discord from 'discord.js';
const { Collection, LimitedCollection } = Discord;

export class HannaClient extends CommandoClient {
  constructor(options) {
    super(options);

    this.data = {
      users: new UsersManager(this),
      VIPs: new VIPsManager(this),
      colors: new ColorsManager(this),
      misc: new Collection(),
      invites: new Collection(),
      deletedMessages: new LimitedCollection(200),
    }

    this.games = new Collection();

    this._wcID = '698560208309452810';

    this.setLogEmbeds(options.logChannels);

    this.on('message', (message) => this.handleMessage(message));

    this.once('ready', () => this.prepareInvites());
  }

  get waifusClub() {
    return this.guilds.cache.get(this._wcID);
  }

  handleMessage(message) {
    const uManager = this.data.users;
    const author = message.author;

    // Cria novo usuário se não existe
    uManager.resolveUser(author);
    
    //if(uManager.resolveUser(author).lastMessage)
    // Atualiza o content de "lastMessage" e add coins e xp
    uManager.updateLastMessage(message, author, !author.bot);

    // Verifica se tem "!wc" no username e add +4 xp
    if(!author.bot) uManager.verifyUsername(author, true);

    // Verifica se tem convite permanente no status e add +1 coin
    if(!author.bot) uManager.verifyCustomActivities(author, true);

    // Verifica se é membro booster e add 15 coins a cada 1 semana
    if(!author.bot) uManager.verifyBoosts(author, true);
  }

  prepareInvites() {
    this.waifusClub.fetchInvites().then( invites => {
      invites.forEach( invite => {
        this.data.invites.set(invite.code, invite);
      })
    })
  }

  setLogEmbeds(logChannels) {
    if(logChannels) {
			const logCategories = {
				channel: { channelCreate: null, channelDelete: null, ChannelUpdate: null },
				emoji: { emojiCreate: null, emojiDelete: null, emojiUpdate: null },
				ban: { guildBanAdd: null , guildBanRemove: null },
				joinLeave: { guildMemberAdd: null, guildMemberRemove: null },
				invite: { inviteCreate: null, inviteDelete: null },
				message: { messageDelete: null, messageDeleteBulk: null, messageUpdate: null },
				role: { roleCreate: null, roleDelete: null, roleUpdate: null },
				user: { userUpdate: null }
			};

			// Coloca o id de cada canal para cada evento
			for(const [entry, id] of Object.entries(logChannels)) {

        // Caso categoria inteira
				if(Object.keys(logCategories).includes(entry))
          for(const evt of Object.keys(logCategories[entry])) logCategories[entry][evt] = id;
          
        // Caso evento específico
				else for(const [category, evts] of Object.entries(logCategories)) {
          if(Object.keys(evts).includes(entry)) logCategories[category][entry] = id;
				}
			}

			this.once('ready', () => {
        // Configura cada evento para criar os embeds
				for(const category of Object.values(logCategories)) {
					for(const [event, id] of Object.entries(category)) {
						import(`../logEmbeds/${event}.js`).then( ({ default: func }) => {
							const channel = this.channels.cache.get(id);
							this.on(event, func.bind(null, this, channel));
						})
					}
        }
      })
    }
  }

}
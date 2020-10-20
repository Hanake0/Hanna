/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable complexity */
const { escapeRegex } = require('./util');
const emojis = require('../../Assets/JSON/emojis.json');

/** Handles parsing messages and running commands from them */
class CommandDispatcher {
	/**
	 * @param {CommandoClient} client - Client the dispatcher is for
	 * @param {CommandoRegistry} registry - Registry the dispatcher will use
	 */
	constructor(client, registry) {
		/**
		 * Client this dispatcher handles messages for
		 * @name CommandDispatcher#client
		 * @type {CommandoClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * Registry this dispatcher uses
		 * @type {CommandoRegistry}
		 */
		this.registry = registry;

		/**
		 * Functions that can block commands from running
		 * @type {Set<Function>}
		 */
		this.inhibitors = new Set();

		/**
		 * Map object of {@link RegExp}s that match command messages, mapped by string prefix
		 * @type {Object}
		 * @private
		 */
		this._commandPatterns = {};

		/**
		 * Old command message results, mapped by original message ID
		 * @type {Map<string, CommandoMessage>}
		 * @private
		 */
		this._results = new Map();

		/**
		 * Tuples in string form of user ID and channel ID that are currently awaiting messages from a user in a channel
		 * @type {Set<string>}
		 * @private
		 */
		this._awaiting = new Set();
	}

	/**
	 * @typedef {Object} Inhibition
	 * @property {string} reason - Identifier for the reason the command is being blocked
	 * @property {?Promise<Message>} response - Response being sent to the user
	 */

	/**
	 * A function that decides whether the usage of a command should be blocked
	 * @callback Inhibitor
	 * @param {CommandoMessage} msg - Message triggering the command
	 * @return {boolean|string|Inhibition} `false` if the command should *not* be blocked.
	 * If the command *should* be blocked, then one of the following:
	 * - A single string identifying the reason the command is blocked
	 * - An Inhibition object
	 */

	/**
	 * Adds an inhibitor
	 * @param {Inhibitor} inhibitor - The inhibitor function to add
	 * @return {boolean} Whether the addition was successful
	 * @example
	 * client.dispatcher.addInhibitor(msg => {
	 *   if(blacklistedUsers.has(msg.author.id)) return 'blacklisted';
	 * });
	 * @example
	 * client.dispatcher.addInhibitor(msg => {
	 * 	if(!coolUsers.has(msg.author.id)) return { reason: 'cool', response: msg.reply('You\'re not cool enough!') };
	 * });
	 */
	addInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') throw new TypeError('The inhibitor must be a function.');
		if(this.inhibitors.has(inhibitor)) return false;
		this.inhibitors.add(inhibitor);
		return true;
	}

	/**
	 * Removes an inhibitor
	 * @param {Inhibitor} inhibitor - The inhibitor function to remove
	 * @return {boolean} Whether the removal was successful
	 */
	removeInhibitor(inhibitor) {
		if(typeof inhibitor !== 'function') throw new TypeError('The inhibitor must be a function.');
		return this.inhibitors.delete(inhibitor);
	}

	/**
	 * Handle a new message or a message update
	 * @param {Message} message - The message to handle
	 * @param {Message} [oldMessage] - The old message before the update
	 * @return {Promise<void>}
	 * @private
	 */
	async handleMessage(message, oldMessage) {
		/* eslint-disable max-depth */
		if(!this.shouldHandleMessage(message, oldMessage)) return;

		// Define as constantes pra facilitar depois
		const usersData = message.client.usersData;
		const iDB = message.client.invitesData;

		if(!usersData || !iDB) return;
		const dbPressets = require('../../Assets/JSON/dbPressets.json');

		const aID = message.author.id;
		const wcID = '698560208309452810';
		const aUsername = message.author.username;
		const isWC = message.guild ? message.guild.id === wcID : false;

		const wc = message.client.guilds.cache.get('698560208309452810');
		const aWcMember = wc.members.cache.get(aID);

		const vipRole = wc.roles.cache.get('754453852618489946');
		const hVip = aWcMember._roles.includes('754453852618489946');

		const familyRole = wc.roles.cache.get('750739449889030235');
		const hFamily = aWcMember._roles.includes('750739449889030235');

		const chngNickRole = wc.roles.cache.get('735677045954314362');
		const hChngNick = aWcMember._roles.includes('735677045954314362');

		const aCustomStatus = aWcMember.presence.activities.find(act => act.type === 'CUSTOM_STATUS');
		const aPresenceUndefined = aCustomStatus === undefined;
		const aPresenceNull = aPresenceUndefined ? true : aCustomStatus.state === null;


		let tempLM;

		// Cria os pressets do db se não existem
		if(!usersData.has(aID)) {
			usersData.set(aID, {
				id: aID,
				username: message.author.username,
				...dbPressets
			});

			let tempLM = 0;
		} else {
			let tempLM = new Date() - aDB.lastMessage.valueOf();
		}

		const aDB = usersData.get(aID);

		// Atualiza os valores para "lastMsg"
		aDB.lastMessage = `${message.createdAt.toISOString()}`;
		aDB.lastMessageContent = `${message.content}`;
		aDB.lastMessageChannelID = `${message.channel.id}`;
		aDB.lastMessageAttachment = message.attachments.first() ? message.attachments.first().url : null;

		// Caso o membro seja vip
		if(aDB.vip) {
			if(aDB.vipUntil < new Date()) {
				aWcMember.roles.remove(vipRole, 'VIP acaba de expirar');
				aDB.vip = false;
				aDB.vipUntil = null;
			} else if(!hVip) aWcMember.roles.add(vipRole, 'Membro VIP');
		} else if(hVip) aWcMember.roles.remove(vipRole, 'VIP expirado');

		if(isWC) {
			// Verifica se é membro ativo
			if(tempLM > 86400000) {
				// Retira 25 de xp por minuto, se ficar 1 dia inativo
				aDB.xp -= Math.floor(25 * Math.round(tempLM / 60000));
				aDB.mensagens += 1;
			} else {
				// Atualiza xp e número de mensagens
				aDB.xp += 5;
				aDB.mensagens += 1;
			}

			// Se username correto: add xp e cargo, se não tiver
			if(aUsername.startsWith('!ʷᶜ') || aUsername.startsWith('!𝓦𝓒')) {
				aDB.xp += 4;
				if(!hFamily) aWcMember.roles.add(familyRole, 'Username começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'');
			// Se username errado: retira o cargo de família, se tiver
			} else if(hFamily) aWcMember.roles.remove(familyRole, 'Username NÃO começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'');

			// Se tiver "CUSTOM_STATUS" com state
			if(!aPresenceUndefined && !aPresenceNull) {
				let codes = [];
				let incluidos = [];

				// Filtra os convites permanentes e verifica se o status do autor inclui um deles
				iDB.forEach(inv => {
					if(inv.maxAge === 0) codes.push(inv.code);
				});
				for(const code of codes) {
					if(aCustomStatus.state.includes(code)) incluidos.push(code);
				}

				// Caso tenha convite permanente
				if(incluidos.length > 0) {
					aDB.money += 1;
					// Caso não tenha a perm
					if(!hChngNick) aWcMember.roles.add(chngNickRole, 'Convite permanente no status');

				// Caso não tenha convite permanente
				} else if(hChngNick) aWcMember.roles.remove(chngNickRole, 'Não tem convite permanente no Status');

			// Caso não tenha status customizado
			} else if(hChngNick) aWcMember.roles.remove(chngNickRole, 'Não tem convite permanente no Status');
		}

		// Parse the message, and get the old result if it exists
		let cmdMsg, oldCmdMsg;
		if(oldMessage) {
			oldCmdMsg = this._results.get(oldMessage.id);
			if(!oldCmdMsg && !this.client.options.nonCommandEditable) return;
			cmdMsg = this.parseMessage(message);
			if(cmdMsg && oldCmdMsg) {
				cmdMsg.responses = oldCmdMsg.responses;
				cmdMsg.responsePositions = oldCmdMsg.responsePositions;
			}
		} else {
			cmdMsg = this.parseMessage(message);
		}

		// Run the command, or reply with an error
		let responses;
		if(cmdMsg) {
			const inhibited = this.inhibit(cmdMsg);

			if(!inhibited) {
				if(cmdMsg.command) {
					if(!cmdMsg.command.isEnabledIn(message.guild)) {
						if(!cmdMsg.command.unknown) {
							responses = await cmdMsg.embed({
								color: emojis.warningC,
								description: `emojis.warning |  \`${cmdMsg.command.name}\` está **desabilitado**.`
							});
						} else {
							/**
							 * Emitted when an unknown command is triggered
							 * @event CommandoClient#unknownCommand
							 * @param {CommandoMessage} message - Command message that triggered the command
							 */
							this.client.emit('unknownCommand', cmdMsg);
							responses = undefined;
						}
					} else if(!oldMessage || typeof oldCmdMsg !== 'undefined') {
						responses = await cmdMsg.run();
						if(typeof responses === 'undefined') responses = null;
						if(Array.isArray(responses)) responses = await Promise.all(responses);
					}
				} else {
					this.client.emit('unknownCommand', cmdMsg);
					responses = undefined;
				}
			} else {
				responses = await inhibited.response;
			}

			cmdMsg.finalize(responses);
		} else if(oldCmdMsg) {
			oldCmdMsg.finalize(null);
			if(!this.client.options.nonCommandEditable) this._results.delete(message.id);
		}

		this.cacheCommandoMessage(message, oldMessage, cmdMsg, responses);
		/* eslint-enable max-depth */
	}

	/**
	 * Check whether a message should be handled
	 * @param {Message} message - The message to handle
	 * @param {Message} [oldMessage] - The old message before the update
	 * @return {boolean}
	 * @private
	 */
	shouldHandleMessage(message, oldMessage) {
		// Ignore partial messages
		if(message.partial) return false;

		if(message.author.bot) return false;
		else if(message.author.id === this.client.user.id) return false;

		// Ignore messages from users that the bot is already waiting for input from
		if(this._awaiting.has(message.author.id + message.channel.id)) return false;

		// Make sure the edit actually changed the message content
		if(oldMessage && message.content === oldMessage.content) return false;

		return true;
	}

	/**
	 * Inhibits a command message
	 * @param {CommandoMessage} cmdMsg - Command message to inhibit
	 * @return {?Inhibition}
	 * @private
	 */
	inhibit(cmdMsg) {
		for(const inhibitor of this.inhibitors) {
			let inhibit = inhibitor(cmdMsg);
			if(inhibit) {
				if(typeof inhibit !== 'object') inhibit = { reason: inhibit, response: undefined };

				const valid = typeof inhibit.reason === 'string' && (
					typeof inhibit.response === 'undefined' ||
					inhibit.response === null ||
					inhibit.response instanceof Promise
				);
				if(!valid) {
					throw new TypeError(
						`Inhibitor "${inhibitor.name}" had an invalid result; must be a string or an Inhibition object.`
					);
				}

				this.client.emit('commandBlock', cmdMsg, inhibit.reason, inhibit);
				return inhibit;
			}
		}
		return null;
	}

	/**
	 * Caches a command message to be editable
	 * @param {Message} message - Triggering message
	 * @param {Message} oldMessage - Triggering message's old version
	 * @param {CommandoMessage} cmdMsg - Command message to cache
	 * @param {Message|Message[]} responses - Responses to the message
	 * @private
	 */
	cacheCommandoMessage(message, oldMessage, cmdMsg, responses) {
		if(this.client.options.commandEditableDuration <= 0) return;
		if(!cmdMsg && !this.client.options.nonCommandEditable) return;
		if(responses !== null) {
			this._results.set(message.id, cmdMsg);
			if(!oldMessage) {
				setTimeout(() => { this._results.delete(message.id); }, this.client.options.commandEditableDuration * 1000);
			}
		} else {
			this._results.delete(message.id);
		}
	}

	/**
	 * Parses a message to find details about command usage in it
	 * @param {Message} message - The message
	 * @return {?CommandoMessage}
	 * @private
	 */
	parseMessage(message) {
		// Find the command to run with default command handling
		const prefix = message.guild ? message.guild.commandPrefix : this.client.commandPrefix;
		if(!this._commandPatterns[prefix]) this.buildCommandPattern(prefix);
		let cmdMsg = this.matchDefault(message, this._commandPatterns[prefix], 2);
		if(!cmdMsg && !message.guild) cmdMsg = this.matchDefault(message, /^([^\s]+)/i, 1, true);

		// Find the command to run by patterns
		for(const command of this.registry.commands.values()) {
			if(!command.patterns) continue;
			for(const pattern of command.patterns) {
				const matches = pattern.exec(message.content);
				if(matches && !cmdMsg) return message.initCommand(command, null, matches);
			}
		}
		return cmdMsg;
	}

	/**
	 * Matches a message against a guild command pattern
	 * @param {Message} message - The message
	 * @param {RegExp} pattern - The pattern to match against
	 * @param {number} commandNameIndex - The index of the command name in the pattern matches
	 * @param {boolean} prefixless - Whether the match is happening for a prefixless usage
	 * @return {?CommandoMessage}
	 * @private
	 */
	matchDefault(message, pattern, commandNameIndex = 1, prefixless = false) {
		const matches = pattern.exec(message.content);
		if(!matches) return null;
		const commands = this.registry.findCommands(matches[commandNameIndex], true);
		if(commands.length !== 1 || !commands[0].defaultHandling) {
			return message.initCommand(this.registry.unknownCommand, prefixless ? message.content : matches[1]);
		}
		const argString = message.content.substring(matches[1].length + (matches[2] ? matches[2].length : 0));
		return message.initCommand(commands[0], argString);
	}

	/**
	 * Creates a regular expression to match the command prefix and name in a message
	 * @param {?string} prefix - Prefix to build the pattern for
	 * @return {RegExp}
	 * @private
	 */
	buildCommandPattern(prefix) {
		let pattern;
		if(prefix) {
			const escapedPrefix = escapeRegex(prefix);
			pattern = new RegExp(
				`^(<@!?${this.client.user.id}>\\s+(?:${escapedPrefix}\\s*)?|${escapedPrefix}\\s*)([^\\s]+)`, 'i'
			);
		} else {
			pattern = new RegExp(`(^<@!?${this.client.user.id}>\\s+)([^\\s]+)`, 'i');
		}
		this._commandPatterns[prefix] = pattern;
		this.client.emit('debug', `Regex contruída para o prefixo "${prefix}": ${pattern}`);
		return pattern;
	}
}

module.exports = CommandDispatcher;

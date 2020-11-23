/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable complexity */
import { escapeRegex } from './util.js';
import emojis from '../../Assets/JSON/emojis.js';
import wcUser from '../../Assets/Custom Classes/user.js';

/** Handles parsing messages and running commands from them */
export class CommandDispatcher {
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

	resolveUserData(user) {
		let userData = this.client.usersData.get(user.id);
		if(userData) return userData;
		else {
			userData = new wcUser({ num: this.client.usersData.size + 1, id: user.id });
			this.client.usersData.set(user.id, userData);
			return userData;
		}
	}

	updateLastMessage(message, user) {
		const aDB = this.client.usersData.get(user.id);
		aDB.xp += 5;
		aDB.messages++;
		aDB.wallet.coins++;
		aDB.lastMessage = {}
		aDB.lastMessage.createdAt = `${message.createdAt.toISOString()}`;
		aDB.lastMessage.content = `${message.content}`;
		aDB.lastMessage.channel = `${message.channel.id}`;
		aDB.lastMessage.attachment = message.attachments.first() ? message.attachments.first().url : null;
	}

	verifyItens(user) {
		const uData = this.client.usersData.get(user.id);
		for(const item of uData.inventory.temporary) {
			if(item.validTime < Date.now()) item.expire(client, user)
		}
	}

	verifyUsername(user) {
		const wc = this.client.guilds.cache.get('698560208309452810');
		const member = wc.members.cache.get(user.id);
		const role = wc.roles.cache.get('750739449889030235');
		const hRole = member._roles.includes('750739449889030235');

		if(user.username.startsWith('!ʷᶜ') || user.username.startsWith('!𝓦𝓒')) {
			this.client.usersData.get(user.id).xp += 4;
			if(!hRole) aWcMember.roles.add(role, 'Username começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'');
		} else if(hRole) aWcMember.roles.remove(role, 'Username NÃO começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'');
	}

	verifyCustomActivities(user) {
		const wc = this.client.guilds.cache.get('698560208309452810');
		const wcMember = wc.members.cache.get(user.id);
		const role = wc.roles.cache.get('735677045954314362');
		const hRole = wcMember._roles.includes('735677045954314362');

		if(user.presence) {
			const customStatus = user.presence.activities.find(act => act.type === 'CUSTOM_STATUS');
			const undefinedOrNull = customStatus === undefined ? true : customStatus.state === null;

			if(!undefinedOrNull) {
				const inclui = this.client.invitesData.some(i => customStatus.state.includes(i.code));
				if(inclui) {
					this.client.usersData.get(user.id).wallet.coins++;
					if(!hRole) wcMember.roles.add(role, 'Convite permanente no status');
				}
			} else if(hRole) wcMember.roles.remove(role, 'Não tem convite permanente no Status');
		} else if(hRole) wcMember.roles.remove(role, 'Não tem convite permanente no Status');
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

		if(!this.client.usersData || !this.client.invitesData) return;

		const isWC = message.guild ? message.guild.id === '698560208309452810' : false;

		// Cria os pressets do db se não existem
		this.resolveUserData(message.author);

		// Atualiza os valores para "lastMsg"
		this.updateLastMessage(message, message.author);

		// Verifica os itens expirados
		this.verifyItens(message.author);

		if(isWC) {
			// Se username correto: add xp e cargo, se não tiver
			this.verifyUsername(message.author)

			// Verifica se tiver "CUSTOM_STATUS" com convite
			this.verifyCustomActivities(message.author);
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
					//if(!cmdMsg.command.isEnabledIn(message.channel)) {
						/*
						if(!cmdMsg.command.unknown) {
							responses = await cmdMsg.embed({
								color: emojis.warningC,
								description: `${emojis.warning} |  \`${cmdMsg.command.name}\` está **desabilitado**.`
							});
						} else {
							this.client.emit('unknownCommand', cmdMsg);
							responses = undefined;
						}
						*/
					//} else if(!oldMessage || typeof oldCmdMsg !== 'undefined') {
						responses = await cmdMsg.run();
						if(typeof responses === 'undefined') responses = null;
						if(Array.isArray(responses)) responses = await Promise.all(responses);
					//}
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


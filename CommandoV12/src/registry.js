//import { createRequire } from 'module';
//const require = createRequire(import.meta.url);

import { readdirSync } from 'fs';
import path from 'path';
import discord from 'discord.js';
import { Command } from './commands/base.js';
import { CommandGroup } from './commands/group.js';
import { CommandoMessage } from './extensions/message.js';
import { ArgumentType } from './types/base.js';

/** Handles registration and searching of commands and groups */
export class CommandoRegistry {
	/** @param {CommandoClient} [client] - Client to use  */
	constructor(client) {
		/**
		 * The client this registry is for
		 * @name CommandoRegistry#client
		 * @type {CommandoClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * Registered commands, mapped by their name
		 * @type {Collection<string, Command>}
		 */
		this.commands = new discord.Collection();

		/**
		 * Registered command groups, mapped by their ID
		 * @type {Collection<string, CommandGroup>}
		 */
		this.groups = new discord.Collection();

		/**
		 * Registered argument types, mapped by their ID
		 * @type {Collection<string, ArgumentType>}
		 */
		this.types = new discord.Collection();

		/**
		 * Fully resolved path to the bot's commands directory
		 * @type {?string}
		 */
		this.commandsPath = null;

		/**
		 * Command to run when an unknown command is used
		 * @type {?Command}
		 */
		this.unknownCommand = null;
	}

	/**
	 * Registers a single group
	 * @param {CommandGroup|Function|Object|string} group - A CommandGroup instance, a constructor, or the group ID
	 * @param {string} [name] - Name for the group (if the first argument is the group ID)
	 * @param {boolean} [guarded] - Whether the group should be guarded (if the first argument is the group ID)
	 * @return {CommandoRegistry}
	 * @see {@link CommandoRegistry#registerGroups}
	 */
	registerGroup(group, name, guarded) {
		if(typeof group === 'string') {
			group = new CommandGroup(this.client, group, name, guarded);
		} else if(typeof group === 'function') {
			group = new group(this.client); // eslint-disable-line new-cap
		} else if(typeof group === 'object' && !(group instanceof CommandGroup)) {
			group = new CommandGroup(this.client, group.id, group.name, group.guarded);
		}

		const existing = this.groups.get(group.id);
		if(existing) {
			existing.name = group.name;
			this.client.emit('debug', `Group ${group.id} is already registered; renamed it to "${group.name}".`);
		} else {
			this.groups.set(group.id, group);
			/**
			 * Emitted when a group is registered
			 * @event CommandoClient#groupRegister
			 * @param {CommandGroup} group - Group that was registered
			 * @param {CommandoRegistry} registry - Registry that the group was registered to
			 */
			this.client.emit('groupRegister', group, this);
			this.client.emit('debug', `Grupo ${group.id} registrado.`);
		}

		return this;
	}

	/**
	 * Registers multiple groups
	 * @param {CommandGroup[]|Function[]|Object[]|Array<string[]>} groups - An array of CommandGroup instances,
	 * constructors, plain objects (with ID, name, and guarded properties),
	 * or arrays of {@link CommandoRegistry#registerGroup} parameters
	 * @return {CommandoRegistry}
	 * @example
	 * registry.registerGroups([
	 * 	['fun', 'Fun'],
	 * 	['mod', 'Moderation']
	 * ]);
	 * @example
	 * registry.registerGroups([
	 * 	{ id: 'fun', name: 'Fun' },
	 * 	{ id: 'mod', name: 'Moderation' }
	 * ]);
	 */
	registerGroups(groups) {
		if(!Array.isArray(groups)) throw new TypeError('Groups must be an Array.');
		for(const group of groups) {
			if(Array.isArray(group)) this.registerGroup(...group);
			else this.registerGroup(group);
		}
		return this;
	}

	/**
	 * Registers a single command
	 * @param {Command|Function} command - Either a Command instance, or a constructor for one
	 * @return {CommandoRegistry}
	 * @see {@link CommandoRegistry#registerCommands}
	 */
	registerCommand(command) {
		/* eslint-disable new-cap */
		if(typeof command === 'function') command = new command(this.client);
		else if(typeof command.default === 'function') command = new command.default(this.client);
		/* eslint-enable new-cap */

		if(!(command instanceof Command)) throw new Error(`Invalid command object to register: ${command}`);

		// Make sure there aren't any conflicts
		if(this.commands.some(cmd => cmd.name === command.name || cmd.aliases.includes(command.name))) {
			throw new Error(`A command with the name/alias "${command.name}" is already registered.`);
		}
		for(const alias of command.aliases) {
			if(this.commands.some(cmd => cmd.name === alias || cmd.aliases.includes(alias))) {
				throw new Error(`A command with the name/alias "${alias}" is already registered.`);
			}
		}
		const group = this.groups.find(grp => grp.id === command.groupID);
		if(!group) throw new Error(`Group "${command.groupID}" is not registered.`);
		if(group.commands.some(cmd => cmd.memberName === command.memberName)) {
			throw new Error(`A command with the member name "${command.memberName}" is already registered in ${group.id}`);
		}
		if(command.unknown && this.unknownCommand) throw new Error('An unknown command is already registered.');

		// Add the command
		command.group = group;
		group.commands.set(command.name, command);
		this.commands.set(command.name, command);
		if(command.unknown) this.unknownCommand = command;

		/**
		 * Emitted when a command is registered
		 * @event CommandoClient#commandRegister
		 * @param {Command} command - Command that was registered
		 * @param {CommandoRegistry} registry - Registry that the command was registered to
		 */
		this.client.emit('commandRegister', command, this);
		this.client.emit('debug', `Comando ${group.id}:${command.memberName} registrado.`);

		return this;
	}

	/**
	 * Registers multiple commands
	 * @param {Command[]|Function[]} commands - An array of Command instances or constructors
	 * @param {boolean} [ignoreInvalid=false] - Whether to skip over invalid objects without throwing an error
	 * @return {CommandoRegistry}
	 */
	registerCommands(commands, ignoreInvalid = false) {
		if(!Array.isArray(commands)) throw new TypeError('Commands must be an Array.');
		for(const command of commands) {
			const valid = typeof command === 'function' || typeof command.default === 'function' ||
				command instanceof Command || command.default instanceof Command;
			if(ignoreInvalid && !valid) {
				this.client.emit('warn', `Tentando registrar um comando inválido: ${command}; pulando.`);
				continue;
			}
			this.registerCommand(command);
		}
		return this;
	}

	/**
	 * Registers all commands in a directory. The files must export a Command class constructor or instance.
	 * @param {string|RequireAllOptions} options - The path to the directory, or a require-all options object
	 * @return {CommandoRegistry}
	 * @example
	 * const path = require('path');
	 * registry.registerCommandsIn(path.join(__dirname, 'commands'));
	 */
	async registerCommandsIn(options) {
		if(typeof options === 'string' && !this.commandsPath) this.commandsPath = options;
		else if(typeof options === 'object' && !this.commandsPath) this.commandsPath = options.dirname;

		const commandPaths = []
		readdirSync(this.commandsPath).forEach(grupo => {
			readdirSync(`${this.commandsPath}/${grupo}`).forEach(arquivo => {
				commandPaths.push(`../.${this.commandsPath}/${grupo}/${arquivo}`);
			})
		})

		const commands = [];
		for(const command of commandPaths) {
			const classe = await import(command);
			commands.push(classe.default);
		}

		return this.registerCommands(commands, true);

	}

	/**
	 * Registers a single argument type
	 * @param {ArgumentType|Function} type - Either an ArgumentType instance, or a constructor for one
	 * @return {CommandoRegistry}
	 * @see {@link CommandoRegistry#registerTypes}
	 */
	registerType(type) {
		/* eslint-disable new-cap */
		if(typeof type === 'function') type = new type(this.client);
		else if(typeof type.default === 'function') type = new type.default(this.client);
		/* eslint-enable new-cap */

		if(!(type instanceof ArgumentType)) throw new Error(`Invalid type object to register: ${type}`);

		// Make sure there aren't any conflicts
		if(this.types.has(type.id)) throw new Error(`An argument type with the ID "${type.id}" is already registered.`);

		// Add the type
		this.types.set(type.id, type);

		/**
		 * Emitted when an argument type is registered
		 * @event CommandoClient#typeRegister
		 * @param {ArgumentType} type - Argument type that was registered
		 * @param {CommandoRegistry} registry - Registry that the type was registered to
		 */
		this.client.emit('typeRegister', type, this);
		this.client.emit('debug', `Tipo de argumento ${type.id} registrado.`);

		return this;
	}

	/**
	 * Registers multiple argument types
	 * @param {ArgumentType[]|Function[]} types - An array of ArgumentType instances or constructors
	 * @param {boolean} [ignoreInvalid=false] - Whether to skip over invalid objects without throwing an error
	 * @return {CommandoRegistry}
	 */
	registerTypes(types, ignoreInvalid = false) {
		if(!Array.isArray(types)) throw new TypeError('Types must be an Array.');
		for(const type of types) {
			const valid = typeof type === 'function' || typeof type.default === 'function' ||
				type instanceof ArgumentType || type.default instanceof ArgumentType;
			if(ignoreInvalid && !valid) {
				this.client.emit('warn', `Tentando registrar um tipo de argumento inválido: ${type}; pulando.`);
				continue;
			}
			this.registerType(type);
		}
		return this;
	}

	/**
	 * Registers all argument types in a directory. The files must export an ArgumentType class constructor or instance.
	 * @param {string|RequireAllOptions} options - The path to the directory, or a require-all options object
	 * @return {CommandoRegistry}
	 */
	registerTypesIn(options) {
		const obj = require('require-all')(options);
		const types = [];
		for(const type of Object.values(obj)) types.push(type);
		return this.registerTypes(types, true);
	}

	/**
	 * Registers the default argument types, groups, and commands. This is equivalent to:
	 * ```js
	 * registry.registerDefaultTypes()
	 * 	.registerDefaultGroups()
	 * 	.registerDefaultCommands();
	 * ```
	 * @return {CommandoRegistry}
	 */
	registerDefaults() {
		this.registerDefaultTypes();
		this.registerDefaultGroups();
		this.registerDefaultCommands();
		return this;
	}

	/**
	 * Registers the default groups ("util" and "commands")
	 * @return {CommandoRegistry}
	 */
	registerDefaultGroups() {
		return this.registerGroups([
			['commands', 'Dono', true],
			['util', 'Básicos']
		]);
	}

	/**
	 * Registers the default commands to the registry
	 * @param {Object} [commands] - Object specifying which commands to register
	 * @param {boolean} [commands.help=true] - Whether to register the built-in help command
	 * (requires "util" group and "string" type)
	 * @param {boolean} [commands.prefix=true] - Whether to register the built-in prefix command
	 * (requires "util" group and "string" type)
	 * @param {boolean} [commands.eval=true] - Whether to register the built-in eval command
	 * (requires "util" group and "string" type)
	 * @param {boolean} [commands.ping=true] - Whether to register the built-in ping command (requires "util" group)
	 * @param {boolean} [commands.unknownCommand=true] - Whether to register the built-in unknown command
	 * (requires "util" group)
	 * @param {boolean} [commands.commandState=true] - Whether to register the built-in command state commands
	 * (enable, disable, load, unload, reload, list groups - requires "commands" group, "command" type, and "group" type)
	 * @return {CommandoRegistry}
	 */
	registerDefaultCommands(commands = {}) {
		commands = {
			help: true, prefix: true, ping: true, eval: true,
			unknownCommand: true, commandState: true, ...commands
		};
		if(commands.help) import('./commands/util/help.js').then(command => this.registerCommand(command.default));
		if(commands.prefix) import('./commands/util/prefix.js').then(command => this.registerCommand(command.default));
		if(commands.ping) import('./commands/util/ping.js').then(command => this.registerCommand(command.default));
		if(commands.eval) import('./commands/util/eval.js').then(command => this.registerCommand(command.default));
		if(commands.commandState) {
			import('./commands/commands/groups.js').then(command => this.registerCommand(command.default));
			import('./commands/commands/enable.js').then(command => this.registerCommand(command.default));
			import('./commands/commands/disable.js').then(command => this.registerCommand(command.default));
			import('./commands/commands/reload.js').then(command => this.registerCommand(command.default));
			import('./commands/commands/load.js').then(command => this.registerCommand(command.default));
			import('./commands/commands/unload.js').then(command => this.registerCommand(command.default));
		}
		return this;
	}

	/**
	 * Registers the default argument types to the registry
	 * @param {Object} [types] - Object specifying which types to register
	 * @param {boolean} [types.string=true] - Whether to register the built-in string type
	 * @param {boolean} [types.integer=true] - Whether to register the built-in integer type
	 * @param {boolean} [types.float=true] - Whether to register the built-in float type
	 * @param {boolean} [types.boolean=true] - Whether to register the built-in boolean type
	 * @param {boolean} [types.user=true] - Whether to register the built-in user type
	 * @param {boolean} [types.member=true] - Whether to register the built-in member type
	 * @param {boolean} [types.role=true] - Whether to register the built-in role type
	 * @param {boolean} [types.channel=true] - Whether to register the built-in channel type
	 * @param {boolean} [types.textChannel=true] - Whether to register the built-in text-channel type
	 * @param {boolean} [types.voiceChannel=true] - Whether to register the built-in voice-channel type
	 * @param {boolean} [types.categoryChannel=true] - Whether to register the built-in category-channel type
	 * @param {boolean} [types.message=true] - Whether to register the built-in message type
	 * @param {boolean} [types.customEmoji=true] - Whether to register the built-in custom-emoji type
	 * @param {boolean} [types.command=true] - Whether to register the built-in command type
	 * @param {boolean} [types.group=true] - Whether to register the built-in group type
	 * @return {CommandoRegistry}
	 */
	registerDefaultTypes(types = {}) {
		types = {
			string: true, integer: true, float: true, boolean: true,
			user: true, member: true, role: true, channel: true, textChannel: true,
			voiceChannel: true, categoryChannel: true, message: true, customEmoji: true,
			command: true, group: true, ...types
		};

		if(types.string) import('./types/string.js').then(type => this.registerType(type.default));
		if(types.integer) import('./types/integer.js').then(type => this.registerType(type.default));
		if(types.float) import('./types/float.js').then(type => this.registerType(type.default));
		if(types.boolean) import('./types/boolean.js').then(type => this.registerType(type.default));
		if(types.user) import('./types/user.js').then(type => this.registerType(type.default));
		if(types.member) import('./types/member.js').then(type => this.registerType(type.default));
		if(types.role) import('./types/role.js').then(type => this.registerType(type.default));
		if(types.channel) import('./types/channel.js').then(type => this.registerType(type.default));
		if(types.textChannel) import('./types/text-channel.js').then(type => this.registerType(type.default));
		if(types.voiceChannel) import('./types/voice-channel.js').then(type => this.registerType(type.default));
		if(types.categoryChannel) import('./types/category-channel.js').then(type => this.registerType(type.default));
		if(types.message) import('./types/message.js').then(type => this.registerType(type.default));
		if(types.customEmoji) import('./types/custom-emoji.js').then(type => this.registerType(type.default));
		if(types.command) import('./types/command.js').then(type => this.registerType(type.default));
		if(types.group) import('./types/group.js').then(type => this.registerType(type.default));
		return this;
	}

	/**
	 * Reregisters a command (does not support changing name, group, or memberName)
	 * @param {Command|Function} command - New command
	 * @param {Command} oldCommand - Old command
	 */
	reregisterCommand(command, oldCommand) {
		/* eslint-disable new-cap */
		if(typeof command === 'function') command = new command(this.client);
		else if(typeof command.default === 'function') command = new command.default(this.client);
		/* eslint-enable new-cap */

		if(command.name !== oldCommand.name) throw new Error('Command name cannot change.');
		if(command.groupID !== oldCommand.groupID) throw new Error('Command group cannot change.');
		if(command.memberName !== oldCommand.memberName) throw new Error('Command memberName cannot change.');
		if(command.unknown && this.unknownCommand !== oldCommand) {
			throw new Error('An unknown command is already registered.');
		}

		command.group = this.resolveGroup(command.groupID);
		command.group.commands.set(command.name, command);
		this.commands.set(command.name, command);
		if(this.unknownCommand === oldCommand) this.unknownCommand = null;
		if(command.unknown) this.unknownCommand = command;

		/**
		 * Emitted when a command is reregistered
		 * @event CommandoClient#commandReregister
		 * @param {Command} newCommand - New command
		 * @param {Command} oldCommand - Old command
		 */
		this.client.emit('commandReregister', command, oldCommand);
		this.client.emit('debug', `Comando ${command.groupID}:${command.memberName} reregistrado.`);
	}

	/**
	 * Unregisters a command
	 * @param {Command} command - Command to unregister
	 */
	unregisterCommand(command) {
		this.commands.delete(command.name);
		command.group.commands.delete(command.name);
		if(this.unknownCommand === command) this.unknownCommand = null;

		/**
		 * Emitted when a command is unregistered
		 * @event CommandoClient#commandUnregister
		 * @param {Command} command - Command that was unregistered
		 */
		this.client.emit('commandUnregister', command);
		this.client.emit('debug', `Comando ${command.groupID}:${command.memberName} desregistrado.`);
	}

	/**
	 * Finds all groups that match the search string
	 * @param {string} [searchString] - The string to search for
	 * @param {boolean} [exact=false] - Whether the search should be exact
	 * @return {CommandGroup[]} All groups that are found
	 */
	findGroups(searchString = null, exact = false) {
		if(!searchString) return this.groups;

		// Find all matches
		const lcSearch = searchString.toLowerCase();
		const matchedGroups = Array.from(this.groups.filter(
			exact ? groupFilterExact(lcSearch) : groupFilterInexact(lcSearch)
		).values());
		if(exact) return matchedGroups;

		// See if there's an exact match
		for(const group of matchedGroups) {
			if(group.name.toLowerCase() === lcSearch || group.id === lcSearch) return [group];
		}
		return matchedGroups;
	}

	/**
	 * A CommandGroupResolvable can be:
	 * * A CommandGroup
	 * * A group ID
	 * @typedef {CommandGroup|string} CommandGroupResolvable
	 */

	/**
	 * Resolves a CommandGroupResolvable to a CommandGroup object
	 * @param {CommandGroupResolvable} group - The group to resolve
	 * @return {CommandGroup} The resolved CommandGroup
	 */
	resolveGroup(group) {
		if(group instanceof CommandGroup) return group;
		if(typeof group === 'string') {
			const groups = this.findGroups(group, true);
			if(groups.length === 1) return groups[0];
		}
		throw new Error('Unable to resolve group.');
	}

	/**
	 * Finds all commands that match the search string
	 * @param {string} [searchString] - The string to search for
	 * @param {boolean} [exact=false] - Whether the search should be exact
	 * @param {Message} [message] - The message to check usability against
	 * @return {Command[]} All commands that are found
	 */
	findCommands(searchString = null, exact = false, message = null) {
		if(!searchString) {
			return message ?
				Array.from(this.commands.filter(cmd => cmd.isUsable(message)).values()) :
				Array.from(this.commands);
		}

		// Find all matches
		const lcSearch = searchString.toLowerCase();
		const matchedCommands = Array.from(this.commands.filter(
			exact ? commandFilterExact(lcSearch) : commandFilterInexact(lcSearch)
		).values());
		if(exact) return matchedCommands;

		// See if there's an exact match
		for(const command of matchedCommands) {
			if(command.name === lcSearch || (command.aliases && command.aliases.some(ali => ali === lcSearch))) {
				return [command];
			}
		}

		return matchedCommands;
	}

	/**
	 * A CommandResolvable can be:
	 * * A Command
	 * * A command name
	 * * A CommandoMessage
	 * @typedef {Command|string} CommandResolvable
	 */

	/**
	 * Resolves a CommandResolvable to a Command object
	 * @param {CommandResolvable} command - The command to resolve
	 * @return {Command} The resolved Command
	 */
	resolveCommand(command) {
		if(command instanceof Command) return command;
		if(command instanceof CommandoMessage && command.command) return command.command;
		if(typeof command === 'string') {
			const commands = this.findCommands(command, true);
			if(commands.length === 1) return commands[0];
		}
		throw new Error('Unable to resolve command.');
	}

	/**
	 * Resolves a command file path from a command's group ID and memberName
	 * @param {string} group - ID of the command's group
	 * @param {string} memberName - Member name of the command
	 * @return {string} Fully-resolved path to the corresponding command file
	 */
	resolveCommandPath(group, memberName) {
		return path.join(this.commandsPath, group, `${memberName}.js`);
	}
}

function groupFilterExact(search) {
	return grp => grp.id === search || grp.name.toLowerCase() === search;
}

function groupFilterInexact(search) {
	return grp => grp.id.includes(search) || grp.name.toLowerCase().includes(search);
}

function commandFilterExact(search) {
	return cmd => cmd.name === search ||
		(cmd.aliases && cmd.aliases.some(ali => ali === search)) ||
		`${cmd.groupID}:${cmd.memberName}` === search;
}

function commandFilterInexact(search) {
	return cmd => cmd.name.includes(search) ||
		`${cmd.groupID}:${cmd.memberName}` === search ||
		(cmd.aliases && cmd.aliases.some(ali => ali.includes(search)));
}

import { Structures } from 'discord.js';
import { Command } from '../commands/base.js';
import { ChannelSettingsHelper } from '../providers/helper.js';

export const CommandoDMChannel = Structures.extend('DMChannel', DMChannel => {
	/**
	 * A fancier DMChannel for fancier people.
	 * @extends DMChannel
	 */
  class CommandoDMChannel extends DMChannel {
		constructor(...args) {
			super(...args);

			/**
			 * Shortcut to use setting provider methods for this guild
			 * @type {GuildSettingsHelper}
			 */
			this.settings = new ChannelSettingsHelper(this.client, this);

		}

		/**
		 * Sets whether a command is enabled in the guild
		 * @param {CommandResolvable} command - Command to set status of
		 * @param {boolean} enabled - Whether the command should be enabled
		 */
		setCommandEnabled(command, enabled) {
			command = this.client.registry.resolveCommand(command);
			if(command.guarded) throw new Error('The command is guarded.');
			if(typeof enabled === 'undefined') throw new TypeError('Enabled must not be undefined.');
			enabled = Boolean(enabled);
			if(!this._commandsEnabled) {
				/**
				 * Map object of internal command statuses, mapped by command name
				 * @type {Object}
				 * @private
				 */
				this._commandsEnabled = {};
			}
			this._commandsEnabled[command.name] = enabled;
			/**
			 * Emitted whenever a command is enabled/disabled in a guild
			 * @event CommandoClient#commandStatusChange
			 * @param {?CommandoGuild} guild - Guild that the command was enabled/disabled in (null for global)
			 * @param {Command} command - Command that was enabled/disabled
			 * @param {boolean} enabled - Whether the command is enabled
			 */
			this.client.emit('commandStatusChange', this, command, enabled);
		}

		/**
		 * Checks whether a command is enabled in the guild (does not take the command's group status into account)
		 * @param {CommandResolvable} command - Command to check status of
		 * @return {boolean}
		 */
		isCommandEnabled(command) {
			command = this.client.registry.resolveCommand(command);
			if(command.guarded) return true;
			if(!this._commandsEnabled || typeof this._commandsEnabled[command.name] === 'undefined') {
				return command._globalEnabled;
			}
			return this._commandsEnabled[command.name];
		}

		/**
		 * Sets whether a command group is enabled in the guild
		 * @param {CommandGroupResolvable} group - Group to set status of
		 * @param {boolean} enabled - Whether the group should be enabled
		 */
		setGroupEnabled(group, enabled) {
			group = this.client.registry.resolveGroup(group);
			if(group.guarded) throw new Error('The group is guarded.');
			if(typeof enabled === 'undefined') throw new TypeError('Enabled must not be undefined.');
			enabled = Boolean(enabled);
			if(!this._groupsEnabled) {
				/**
				 * Internal map object of group statuses, mapped by group ID
				 * @type {Object}
				 * @private
				 */
				this._groupsEnabled = {};
			}
			this._groupsEnabled[group.id] = enabled;
			/**
			 * Emitted whenever a command group is enabled/disabled in a guild
			 * @event CommandoClient#groupStatusChange
			 * @param {?CommandoGuild} guild - Guild that the group was enabled/disabled in (null for global)
			 * @param {CommandGroup} group - Group that was enabled/disabled
			 * @param {boolean} enabled - Whether the group is enabled
			 */
			this.client.emit('groupStatusChange', this, group, enabled);
		}

		/**
		 * Checks whether a command group is enabled in the guild
		 * @param {CommandGroupResolvable} group - Group to check status of
		 * @return {boolean}
		 */
		isGroupEnabled(group) {
			group = this.client.registry.resolveGroup(group);
			if(group.guarded) return true;
			if(!this._groupsEnabled || typeof this._groupsEnabled[group.id] === 'undefined') return group._globalEnabled;
			return this._groupsEnabled[group.id];
		}

	}

	return CommandoDMChannel;
});

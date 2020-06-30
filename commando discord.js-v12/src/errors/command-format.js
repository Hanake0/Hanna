const FriendlyError = require('./friendly');

/**
 * Has a descriptive message for a command not having proper format
 * @extends {FriendlyError}
 */
class CommandFormatError extends FriendlyError {
	/**
	 * @param {CommandMessage} msg - The command message the error is for
	 */
	constructor(msg) {
		super(
			`Forma de utilização de comando errada. A forma certa de usar o comando \`${msg.command.name}\` é: ${msg.usage(
				msg.command.format,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)}. Utlize ${msg.anyUsage(
				`ajuda ${msg.command.name}`,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)} para mais informações.`
		);
		this.name = 'CommandFormatError';
	}
}

module.exports = CommandFormatError;

import { FriendlyError } from './friendly.js';

/**
 * Has a descriptive message for a command not having proper format
 * @extends {FriendlyError}
 */
export class CommandFormatError extends FriendlyError {
	/**
	 * @param {CommandoMessage} msg - The command message the error is for
	 */
	constructor(msg) {
		super(
			`Formato de uso errado. \`${msg.command.name}\` aceita os formatos: ${msg.usage(
				msg.command.format,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)}. Use ${msg.anyUsage(
				`ajuda ${msg.command.name}`,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)} para mais informações.`
		);
		this.name = 'CommandFormatError';
	}
}


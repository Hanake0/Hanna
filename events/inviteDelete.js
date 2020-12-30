import { hora } from '../index.js';

export default async (client, invite) => {
	console.log(hora(), 'Evento `inviteDelete` emitido...');
	// client.data.invites.delete(invite.code);
};

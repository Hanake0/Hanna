import { hora } from '../index.js';

export default async (client, invite) => {
	console.log(hora(), 'Evento `inviteCreate` emitido...');
	client.data.invites.set(invite.code, invite);
};

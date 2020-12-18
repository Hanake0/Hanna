import { hora } from '../index.js';

export default async (client, membro) => {
	console.log(hora(), 'Evento `guildMemberRemove` emitido...');

	const id = membro.guild.id;

	const WC = '698560208309452810';

	const WS = '749990911802474667';
	const Wstore = client.guilds.cache.get(WS);

	const roleID = '750073380711170142';
	const role = Wstore.roles.cache.get(roleID);

	// verifica de que servidor o membro saiu e remove o cargo
	switch (id) {
	case WC:
		if (Wstore.members.cache.has(membro.id)) {
			const membro2 = Wstore.members.cache.get(membro.id);
			membro2.roles.remove(role);
			break;
		}
	}
};
function escapeRegex(str) {
	return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

function disambiguation(items, label, property = 'name') {
	const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
	return `Multiplos ${label} encontrados, por favor seja mais específico:\n ${itemList}`;
}

function paginate(items, page = 1, pageLength = 10) {
	const maxPage = Math.ceil(items.length / pageLength);
	if(page < 1) page = 1;
	if(page > maxPage) page = maxPage;
	const startIndex = (page - 1) * pageLength;
	return {
		items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
		page,
		maxPage,
		pageLength
	};
}

const permissions = {
	ADMINISTRATOR: 'Administrador',
	VIEW_AUDIT_LOG: 'Ver o registro de auditoria',
	MANAGE_GUILD: 'Gerenciar servidor',
	MANAGE_ROLES: 'Gerenciar cargos',
	MANAGE_CHANNELS: 'Gerenciar canais',
	KICK_MEMBERS: 'Expulsar membros',
	BAN_MEMBERS: 'Banir membros',
	CREATE_INSTANT_INVITE: 'Criar convites',
	CHANGE_NICKNAME: 'Alterar apelido',
	MANAGE_NICKNAMES: 'Gerenciar apelidos',
	MANAGE_EMOJIS: 'Gerenciar emojis',
	MANAGE_WEBHOOKS: 'Gerenciar webhooks',
	VIEW_CHANNEL: 'Ler canais de texto e ver canais de voz',
	SEND_MESSAGES: 'Enviar mensagens',
	SEND_TTS_MESSAGES: 'Enviar mensagens em TTS',
	MANAGE_MESSAGES: 'Gerenciar mensagens',
	EMBED_LINKS: 'Inserir links',
	ATTACH_FILES: 'Anexar arquivos',
	READ_MESSAGE_HISTORY: 'Ver histórico de mensagens',
	MENTION_EVERYONE: 'Mencionar everyone, here e todos os cargos',
	USE_EXTERNAL_EMOJIS: 'Usar emojis externos',
	ADD_REACTIONS: 'Adicionar reações',
	CONNECT: 'Conectar',
	SPEAK: 'Falar',
	MUTE_MEMBERS: 'Silenciar membros',
	DEAFEN_MEMBERS: 'Ensurdecer membros',
	MOVE_MEMBERS: 'Mover membros',
	USE_VAD: 'Usar detecção de voz'
};

export {
	escapeRegex,
	disambiguation,
	paginate,
	permissions
};

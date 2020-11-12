const commando = require('./CommandoV12/src/index.js');
const { CommandoClient} = require('./CommandoV12/src/index.js');
const path = require('path');
const { readdirSync } = require('fs');
const { Intents } = require('discord.js');

function hora() {
	const dataUTC = new Date(new Date().toUTCString());
	const dataBR = new Date(dataUTC.getTime() - 10800000);
	let hora = `${dataBR.toISOString().slice(11, -1)} `;
	return hora
}

// Inicializa o banco de dados (firebase) e exporta o banco Online
/*
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
*/
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
module.exports.db = db;

//cria um client do Comando
const donos = new Set();
  donos.add('380512056413257729');
  donos.add('348664615175192577');
  donos.add('398852531259965440');
  donos.add('755067822086029424');
const client = new CommandoClient({
	ws: { intents: Intents.ALL },
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	commandPrefix: 't//',
	unknownCommandResponse: false,
	owner: donos,
	disableEveryone: true
});


//registra os comandos no client do Commando
client.registry
	.registerDefaults()
	.registerGroups([
		['autorespostas', 'Auto Respostas'],
		['utilidades', 'Utilidades'],
		['interação', 'Interação entre Membros'],
		['singleplayer', 'Jogos Single Player'],
		['imgs-ia', 'Imagens Geradas com Inteligência Artificial'],
		['p&i', 'Perfil & Inventário'],
		['adm', 'Reservados á Staff'],
		['eventos', 'Relacionados a Eventos']
	])
	.registerCommandsIn(path.join(__dirname, 'Comandos'));


// Guarda os dados localmente e exporta o banco Offline
db.collection('usuarios').get().then(docs => docs.forEach(snap => {

	var usersOff = new Map(Object.entries(snap.data()));

  usersOff.forEach(user => {
      client.usersData.set(`${user.id}`, user);
	});
	
}));

setInterval(async () => {
	console.log(hora(), 'Iniciando update geral...');
	try {
		let repeats = Math.ceil((client.usersData.size + 1)/250);
		let now = 1;
		
		while(now <= repeats) {
			let users = {};

			client.usersData.forEach(user => {
				if(user.num > ((now - 1) * 250) && user.num < (now * 250)) {
					Object.defineProperty(users, user.id, {
						value: user,
						writable: true,
						enumerable: true,
						configurable: true
					});
				}
			});
			console.log(hora(), `Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados`);
			console.log(hora(),`Iniciado update do doc ${now}...`);
			await db.collection('usuarios').doc(`${now}`).set(users);
			console.log(hora(),`Update de doc ${now} concluído !`);
			now ++;
		}
	} catch(err) {
		console.log(hora(), `Erro durante update ${err.name}: ${err.message}`);
		client.guilds.cache.get('698560208309452810').channels.cache.get('732710544330457161').send(`${hora()}Erro ao atualizar Firestore: ${err.name}: ${err.message}`)
	}
	console.log(hora(), 'Fim do Update geral.')
}, 900000);


//Event Handler(Project-A) && erros
const evtFiles = readdirSync('./Eventos/');
console.log(hora(), `Carregando o total de ${evtFiles.length} eventos`);
evtFiles.forEach(f => {
  const eventName = f.split('.')[0];
  const event = require(`./Eventos/${f}`);

  client.on(eventName, event.bind(null, client));
});

// Loja
const items = readdirSync('./Assets/Loja/Items');
const shopItens = client.registry.shopItens;

client.once('ready', () => { 
	items.forEach(item => {
		const nome = item.split('.')[0];
		let ação = require(`./Assets/Loja/Items/${nome}`);
		ação = new ação(client);
		shopItens.set(ação.message.id, ação);
	})
});

client.on('messageReactionAdd', async (reaction, user) => {
	if(user.id === client.user.id) return;

	const mID = reaction.message.id;
	const item = shopItens.get(mID);

	if(shopItens.has(mID)) {
		const reacts = reaction.message.reactions.cache;
		reacts.forEach(async react => {
			if(react._emoji.name == reaction._emoji.name) {
				react.remove()
					.catch(err => console.log('Loja => Falha ao remover emoji: ', err))
					.then(() => {
						reaction.message.react(reaction._emoji)
							.catch(err => console.error('Loja => Falha ao adicionar emoji: ', err))
					})
			};
		});
		try { 
			console.log(hora(), `Loja => Executando item ${item.nome}`);
			item.run(client, reaction, user);
		} catch(err) {
			console.log(hora(), `Loja => Erro ao executar item ${item.nome}: `, err);
		}
	};
});

	client
		.on('error', console.error)
		.on('warn', console.warn)
		.on('debug', (debug) => { if (!debug.includes('[WS => ')) console.log(hora(), debug); })
		.on('disconnect', () => { console.warn('Disconectado!'); })
		.on('reconnecting', () => { console.warn('Reconectando...'); })
		.on('commandError', (cmd, err) => {
			if(err instanceof commando.FriendlyError) return;
			console.error(hora(), `Erro no comando ${cmd.groupID}:${cmd.memberName}`, err);
		})
		.on('commandBlocked', (msg, reason) => {
			console.log(oneLine`
				Comando ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
				bloqueado; ${reason}
			`);
		});

//login && token
client.login('NzQzOTgwMzgwNzU4OTk5MDgx.XzcjuQ.O_aWG0d4WfVA3qhkznhuR4A-7w0');
const d = Date.now() - 10800000;
let hora = `${new Date(d).getHours() - 3}:${new Date(d).getMinutes()}:${new Date(d).getSeconds()} `;

module.exports = async (client, db) => { 
  console.log(hora, 'Iniciando update geral...');
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
			console.log(hora, `Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados`);
			console.log(hora,`Iniciado update do doc ${now}...`);
			await db.collection('usuarios').doc(`${now}`).set(users);
			console.log(hora,`Update de doc ${now} concluído !`);
			now ++;
		}
	} catch(err) {
		console.log(hora, `Erro durante update ${err.name}: ${err.message}`);
		client.guilds.cache.get('698560208309452810').channels.cache.get('732710544330457161').send(`${hora}Erro ao atualizar Firestore: ${err.name}: ${err.message}`)
	}
	console.log(hora, 'Fim do Update geral.')
}
function hora() {
	const dataUTC = new Date(new Date().toUTCString());
	const dataBR = new Date(dataUTC.getTime() - 10800000);
	let hora = `${dataBR.toISOString().slice(11, -1)} `;
	return hora
}

export default async (client) => {
  console.log(hora(), 'Evento \`ready\` emitido...');

  function ready() {
    if(client.guilds.cache.get('698560208309452810').channels.cache.get('732710544330457161')) {
      console.log(hora(), 'Client pronto!')
      const WaifusClub = client.guilds.cache.get('698560208309452810');

      console.log(hora(), `Logado como ${client.user.tag}! (${client.user.id})`);
      WaifusClub.channels.cache.get('732710544330457161').send(`Online!`);
      setInterval(async () => {
      let users = WaifusClub.members.cache.size - 1;
    
        await client.user.setActivity(`${users} usuário${users !== 1 ? 's' : ''}`, {type: 'WATCHING'})
        .catch(err => console.error());
      }, 15000);
    
      /*
      WaifusClub.fetchInvites().then( invites => {
        invites.forEach( invite => {
          client.invitesData.set(invite.code, invite);
        })
      })
      */

    } else {
      console.log(hora(), 'Client ainda não está pronto.')
      setTimeout(ready(), 3000);
    }
  }

  ready();

}

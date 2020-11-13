function hora() {
	const dataUTC = new Date(new Date().toUTCString());
	const dataBR = new Date(dataUTC.getTime() - 10800000);
	
	let hora = `${dataBR.toISOString().slice(11, -1)} `;
	return hora
}

export default async (client, membro) => {
  console.log(hora(), 'Evento \`guildMemberRemove\` emitido...');

  const id = membro.guild.id;
  
  const WC = '698560208309452810';
  const Wclub = client.guilds.cache.get(WC);

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
}
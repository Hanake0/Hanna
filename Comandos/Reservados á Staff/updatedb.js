import { Command } from '../../CommandoV12/src/index.js';
import { db } from '../../index.js';

export default class UpdatedbCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'updatedb',
      aliases: ['update_db', 'update-db', 'sincronizardb'],
      group: 'adm',
      memberName: 'sincronizardb',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['ADMINISTRATOR'],
      ownerOnly: true,
      description: 'Sincroniza o banco de dados no Firebase'
    });
  }

  async run(message) {
    function hora() {
      const dataUTC = new Date(new Date().toUTCString());
      const dataBR = new Date(dataUTC.getTime() - 10800000);
      let hora = `${dataBR.toISOString().slice(11, -1)} `;
      return hora
    }
    const client = message.client;

    console.log(hora(), 'Iniciando update geral...');
    await message.channel.send(`${hora()} Iniciando update geral...`);
    try {
      let repeats = Math.ceil((client.usersData.size + 1)/250);
      let now = 1;
      
      while(now <= repeats) {
        let users = {};
  
        client.usersData.forEach(user => {
          if(user.num > ((now - 1) * 250) && user.num <= (now * 250)) {
            users[user.id] = user.toFirestore();
          }
        });
        console.log(hora(), `Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados e convertidos`);
        await message.channel.send(`${hora()} Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados e convertidos`);
        console.log(hora(),`Iniciado update do doc ${now}...`);
        await message.channel.send(`${hora()} Iniciado update do doc ${now}...`);
        await db.collection('usuarios').doc(`${now}`).set(users);
        console.log(hora(),`Update de doc ${now} concluído !`);
        await message.channel.send(`${hora()} Update de doc ${now} concluído !`);
        now ++;
      }
    } catch(err) {
      console.log(hora(), `Erro durante update ${err.name}: ${err.message}`);
      await message.channel.send(`${hora()} Erro durante update ${err.name}: ${err.message}`);
    }
    console.log(hora(), 'Fim do Update geral.')
    await message.channel.send(`${hora()} Fim do Update geral.`);
  }
};
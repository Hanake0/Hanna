import { Command } from '../../CommandoV12/src/index.js';

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
    const { db } = require('../../index');
    let d = Date.now() - 10800000;
    let hora = `${new Date(d).getHours() - 3}:${new Date(d).getMinutes()}:${new Date(d).getSeconds()} `;
    const client = message.client;
    
    console.log(hora, 'Iniciando update geral...');
    await message.channel.send(`${hora}Iniciando update geral...`);
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
        })
        console.log(hora, `Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados`);
        await message.channel.send(`${hora}Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados`);
        console.log(hora,`Iniciado update do doc ${now}...`);
        await message.channel.send(`${hora}Iniciado update do doc ${now}...`);
        await db.collection('usuarios').doc(`${now}`).set(users);
        console.log(hora,`Update de doc ${now} concluído !`);
        await message.channel.send(`${hora}Update de doc ${now} concluído !`);
        now ++;
      }
    } catch(err) {
      console.log(hora, `Erro durante update ${err.name}: ${err.message}`);
      await message.channel.send(`${hora}Erro durante update ${err.name}: ${err.message}`);
    }
    console.log(hora, 'Fim do Update geral.')
    await message.channel.send(`${hora}Fim do Update geral.`);
  }
};
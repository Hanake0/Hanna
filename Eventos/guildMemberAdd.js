const wait = require('util').promisify(setTimeout);
var { usersOffDB, invitesDB } = require('../index.js');
module.exports = async (client, membro) => {
  const membro2 = membro;

  const id = membro.guild.id;
  
  const WC = '698560208309452810';
  const Wclub = client.guilds.cache.get(WC);

  const WS = '749990911802474667';
  const Wstore = client.guilds.cache.get(WS);
  
  const roleID = '750073380711170142';
  const role = Wstore.roles.cache.get(roleID);

  // verifica em que servidor o membro entrou
  switch (id) {
    case WS:
      if (Wclub.members.cache.has(membro.id)) {
        membro.roles.add(role);
      }
      break;
    case WC:
      if (Wstore.members.cache.has(membro.id)) {
        const membro2 = Wstore.members.cache.get(membro.id);
        membro2.roles.add(role);
      }
      let invite = {};
      let invitess = {}
      Wclub.fetchInvites().then(invites => {

        // pega os convites e descobre o certo

        invitess = invites

        invite = invitess.find(i => invitesDB.get(i.code).value().uses < i.uses);
        console.log(invite)
      }).then(() => 

        // Envia o embed

        Wclub.channels.cache.get('751568642545680485').send({embed: {
          color: '#ffa41c',
          title: 'Uso de Convite:',
          author: {
            name: invite.inviter.tag,
            icon_url: invite.inviter.avatarURL()
          },
          description: `Código: **\'${invite.code}\'**
          Usos: ${invite.uses}
          Temporário: **${invite.maxAge === 0 ? 'Não' : 'Sim'}**
          
          Usuário: ${membro.tag} (${membro.id})`,
//          fields: [
//            {
//              name: membro.tag,
//              value: usersOffDB.has(membro.id).value() ? '<a:cross_gif:738900572664496169> | Não é membro novo.' : '<a:checkmark_gif:738900367814819940> | É membro novo.'
//            }
//          ],
          timestamp: invite.maxAge != 0 ? invite.createdTimestamp + (invite.maxAge * 1000) : invite.createdTimestamp,
          footer: {
            text: invite.maxAge != 0 ? 'Válido até: ' : 'Criado:  '
          }
        }}));

      wait(1000);

      // Atualiza o db

      invites.forEach( invite => {
        invitesDB.set(invite.code, invite).write()
      })
      break;
  }
}
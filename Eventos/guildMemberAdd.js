var { usersOffDB, invitesDB } = require('../index.js');
const emojis = require('../Assets/JSON/emojis.json');
const dbPressets= require('../Assets/JSON/dbPressets.json');
const { stripIndents } = require('common-tags');
const d = new Date();
const hora = `${d.getHours() - 3}:${d.getMinutes()}:${d.getSeconds()} `;

module.exports = async (client, membro) => {
  console.log(hora, 'Evento \`guildMemberAdd\` emitido...');

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

      // Cria um mapa dos convites atuais
      let invitesA = new Map();
      invitesDB.forEach(invite => invitesA.set(invite.code, invite)).value()

      Wclub.fetchInvites().then(invitesN => {

        invite = invitesN.find(i => invitesDB.get(i.code).value().uses < i.uses);

        // Atualiza o db
        invitesN.forEach( invite => {
          invitesDB.set(invite.code, invite).write()
        })

        if(usersOffDB.get(invite.inviter.id).has('invites').value() && !usersOffDB.has(membro.id).value()) {
          usersOffDB.get(invite.inviter.id)
            .update('invites', num => num + 1) 
            .update('gems', num => num + 1)
            .write();
          
        } else if(!usersOffDB.has(membro.id).value()){
          usersOffDB.get(invite.inviter.id)
            .set('invites', 1)
            .set('gems', 1)
            .write();
        } else if(!usersOffDB.get(invite.inviter.id).has('invites').value()) {
          usersOffDB.get(invite.inviter.id)
          .set('invites', 0)
          .set('gems', 0)
          .write();
        }
      }).then(() => {

        // Envia o embed
        Wclub.channels.cache.get('751568642545680485').send({embed: {
          color: emojis.warningC,
          title: 'Uso de Convite:',
          author: {
            name: `${invite.inviter.tag} (${usersOffDB.get(invite.inviter.id).has('invites').value() ? usersOffDB.get(invite.inviter.id).value().invites : 0} invites)`,
            icon_url: invite.inviter.avatarURL()
          },
          description: stripIndents`
          Código: **\'${invite.code}\'**
          Usos(convite): ${invite.uses}
          Temporário: **${invite.maxAge === 0 ? 'Não' : 'Sim'}**`,
          fields: [
            {
              name: `${membro.user.tag} (${membro.id})`,
              value: usersOffDB.has(membro.id).value() ? `${emojis.fail} | Não é membro novo.` : `${emojis.success} | É membro novo.`
            }
          ],
          timestamp: invite.maxAge != 0 ? invite.createdTimestamp + (invite.maxAge * 1000) : invite.createdTimestamp,
          footer: {
            text: invite.maxAge != 0 ? 'Válido até: ' : 'Criado:  '
          }
        }})

      }).then(() => {
        if(!usersOffDB.has(membro.id).value()) {
          usersOffDB
          .set(membro.id, {
            id: membro.id,
            username: membro.user.username
          })
          .get(membro.id)
          .assign(dbPressets)
          .write();  
        }
      });
      break;
  }
}
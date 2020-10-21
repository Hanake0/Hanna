const emojis = require('../Assets/JSON/emojis.json');
const dbPressets= require('../Assets/JSON/dbPressets.json');
const { stripIndents } = require('common-tags');
const d = Date.now() - 10800000;
let hora = `${new Date(d).getHours() - 3}:${new Date(d).getMinutes()}:${new Date(d).getSeconds()} `;

module.exports = async (client, membro) => {
  console.log(hora, 'Evento \`guildMemberAdd\` emitido...');

  const invitesData = client.invitesData;
  const usersData = client.usersData;

  const id = membro.guild.id;
  
  const WC = '698560208309452810';
  const Wclub = client.guilds.cache.get(WC);

  const WS = '749990911802474667';
  const Wstore = client.guilds.cache.get(WS);
  
  const roleID = '750073380711170142';
  const role = Wstore.roles.cache.get(roleID);

  let iDB = {};

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
      const invitesA = invitesData;

      Wclub.fetchInvites().then(invitesN => {

        invite = invitesN.find(i => invitesA.get(i.code).uses < i.uses);
        uDB = usersData.get(invite.inviter.id);

        // Atualiza os convites
        invitesN.forEach( invite => {
          invitesData.set(invite.code, invite);
        })

        // Atualiza as gems
        if(!usersData.has(membro.id) && !invite.inviter.bot) {
          if(iDB.invites && iDB.gems) {
            iDB.invites += 1;
            iDB.gems += 1;
          } else {
            iDB.invites = 1;
            iDB.gems = 1;
          };

        };
      }).then(() => {

        // Envia o embed
        Wclub.channels.cache.get('751568642545680485').send({embed: {
          color: emojis.warningC,
          title: 'Uso de Convite:',
          author: {
            name: `${invite.inviter.tag} (${uDB ? uDB.invites ? uDB.invites : 0 : ''})`,
            icon_url: invite.inviter.avatarURL()
          },
          description: stripIndents`
          Código: **\'${invite.code}\'**
          Usos(convite): ${invite.uses}
          Temporário: **${invite.maxAge === 0 ? 'Não' : 'Sim'}**`,
          fields: [
            {
              name: `${membro.user.tag} (${membro.id})`,
              value: usersData.has(membro.id) ? `${emojis.fail} | Não é membro novo.` : `${emojis.success} | É membro novo.`
            }
          ],
          timestamp: invite.maxAge != 0 ? invite.createdTimestamp + (invite.maxAge * 1000) : invite.createdTimestamp,
          footer: {
            text: invite.maxAge != 0 ? 'Válido até: ' : 'Criado:  '
          }
        }})

      }).then(() => {
        if(!usersData.has(membro.id)) {
          usersData.set(membro.id, 
            {
              id: membro.id,
              username: membro.user.username,
              ...dbPressets
            });
        }
      });
      break;
  }
}
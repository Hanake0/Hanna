import emojis from '../Assets/JSON/emojis.js';
import dbPressets from '../Assets/JSON/dbPressets.js';
import { stripIndents } from 'common-tags';
function hora() {
	const dataUTC = new Date(new Date().toUTCString());
	const dataBR = new Date(dataUTC.getTime() - 10800000);
	let hora = `${dataBR.toISOString().slice(11, -1)} `;
	return hora
}

export default async (client, membro) => {
  console.log(hora(), 'Evento \`guildMemberAdd\` emitido...');

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
      let invite, uDB;

      Wclub.fetchInvites().then(invitesN => {

        invite = invitesN.find(i => invitesA.get(i.code).uses < i.uses);
        uDB = usersData.get(invite.inviter.id);

        // Atualiza os convites
        invitesN.forEach( invite => {
          invitesData.set(invite.code, invite);
        })

        // Atualiza as gems
        if(!usersData.has(membro.id) && !invite.inviter.bot) {
          uDB.wallet.gems++;
          uDB.invites++;
        };
      }).then(() => {

        // Envia o embed
        Wclub.channels.cache.get('751568642545680485').send(`${invite.inviter} convidou ${membro}`, {embed: {
          color: emojis.warningC,
          title: 'Uso de Convite:',
          author: {
            name: `${invite.inviter.tag} (${uDB ? ~~uDB.invites : ''})`,
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
        // Coloca o novo membro no db
        client.dispatcher.resolveUserData(membro);
      });
      break;
  }
}
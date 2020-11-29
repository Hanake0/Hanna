import emojis from '../../Assets/JSON/emojis.js';

export default async function(client, logChannel, member) {

  // Verifica se member novo e adiciona no db
  const membroNovo = client.data.users.cache.has(member.id);
  client.data.users.resolveUser(member.user);

  // Cria um mapa dos convites atuais
  const invitesA = client.data.invites;

  // Guarda e atualiza os dados dos convites
  const invitesN = await client.waifusClub.fetchInvites();
  invitesN.forEach( invite => {
    client.data.invites.set(invite.code, invite);
  })

  // Acha o convite usado
  const invite = invitesN.find(i => invitesA.get(i.code).uses < i.uses);

  if(invite) {
    const inviterDB = client.data.users.resolveUser(invite.inviter);

    // Atualiza as gems
    if(!membroNovo) {
      if(!invite.inviter.bot) inviterDB.wallet.gems++;
      inviterDB.invites++;
    };

    // Envia o embed
    await logChannel.send(
      `${invite.inviter} convidou ${member}`,
      {
        embed: {
          color: emojis.warningC,
          title: 'Uso de Convite:',
          author: {
            name: `${invite.inviter.tag} (${inviterDB.invites})`,
            icon_url: invite.inviter.avatarURL()
          },
          description: stripIndents`
            Código: **\'${invite.code}\'**
            Usos(convite): ${invite.uses}
            Temporário: **${invite.maxAge === 0 ? 'Não' : 'Sim'}**`,
          fields: [{
            name: `${member.user.tag} (${member.id})`,
            value: membroNovo ? `${emojis.fail} | Não é membro novo.` : `${emojis.success} | É membro novo.`
          }],
          timestamp: invite.maxAge !== 0 ? invite.createdTimestamp + (invite.maxAge * 1000) : invite.createdTimestamp,
          footer: { text: invite.maxAge != 0 ? 'Válido até: ' : 'Criado: ' },
        }
      }
    )
  }
}
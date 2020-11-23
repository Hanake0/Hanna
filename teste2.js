client.on('raw', async dados => {
  if (dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE") return
  if (dados.d.message_id != "780169693406429235") return

  let servidor = client.guilds.cache.get("774274642520965180")
  let membro = servidor.members.cache.get(dados.d.user_id);

  let cafet = servidor.roles.cache.get("<@&780176147681378335>"),
      inkei = servidor.roles.cache.get("<@&780175676380414002>"),
      mokuzai = servidor.roles.cache.get("<@&780175676380414002>");
  if(dados.t === "MESSAGE_REACTION_ADD") {
      if (dados.d.emoji.id === "774669881996083220") {
          if (membro.roles.cache.has(cafet)) return
          membro.roles.add(cafet);
      } else if (dados.d.emoji.id === "775031385542885406") {
          if (membro.roles.cache.has(inkei)) return
          membro.roles.add(inkei);
      } else if (dados.d.emoji.id === "774665913559023738") {
          if (membro.roles.cache.has(mokuzai)) return
          membro.roles.add(mokuzai);
      }
  }
})
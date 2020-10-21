const { stripIndents } = require('common-tags');
const probe = require('probe-image-size');
const catálogo = require('../Assets/JSON/catálogo.json');
const emojis = require('../Assets/JSON/emojis.json');
const { comprar, shopEmbed, question } = require('../Assets/util/util2.js');
const d = Date.now() - 10800000;
let hora = `${new Date(d).getHours() - 3}:${new Date(d).getMinutes()}:${new Date(d).getSeconds()} `;
const { Permissions } = require('discord.js');

module.exports = async (client, reaction, user) => {
  if(user.id === client.user.id || user.bot) return;
  console.log(hora, 'Evento \`messageReactionAdd\` emitido...');

  if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
		}
	}

  const WS = '749990911802474667';
  const Wstore = client.guilds.cache.get(WS);
  const confirmação = Wstore.channels.cache.get('750022485126414406');
  const shopLog = Wstore.channels.cache.get('768228937762603049');

  const WC = '698560208309452810';
  const Wclub = client.guilds.cache.get(WC);
  const wcMember = Wclub.members.cache.get(user.id);
  const categApart = '754411415548199054';
  const categVip = '764628856883511346';

  const emojiId = reaction.emoji.id;
  const id = reaction.message.id;
  const gc = emojiId === '750840705269891112' ? 'gems' : 'coins';
  const gm = gc === 'gems' ? 'gems' : 'money';

  let nome = false;
  let nomeM = false;
  let pergunta = '';
  let sucesso = '';
  let falha = '';
  let falhaT = '';
  let filtro;

  // Todos os id's (Array)
  let mIDs = [];

  // Coloca os id's de cada categoria em mIDs([]) e guarda as informações de cada categoria ({})
  
  // Mensagens de informação e textos { <categoria>: { texto: '', mID: '' } }
  let infos = [];
  Object.keys(catálogo.infos).forEach(categoria => {
    if(catálogo.infos[categoria].mID !== undefined) {
      infos.push(catálogo.infos[categoria]);
      mIDs.push(catálogo.infos[categoria].mID);
    }
  });
  const info = infos.find(info => info.mID === id);
  
  // Loja de cores { nome: '', aliases: [], valor: '', mID: '', rID: '' }
  let cores = [];
  Object.keys(catálogo.cores).forEach(cor => {
    if(catálogo.cores[cor].mID !== undefined) {
      cores.push(catálogo.cores[cor]);
      mIDs.push(catálogo.cores[cor].mID);
    }
  });
  const cor = cores.find(cor => cor.mID === id);
  
  // Loja de VIP's { nome: '', valor: '', mID: '' }
  let vips = [];
  Object.keys(catálogo.vips).forEach(tempo => {
    if(catálogo.vips[tempo].mID !== undefined) {
      vips.push(catálogo.vips[tempo]);
      mIDs.push(catálogo.vips[tempo].mID);
    }
  });
  const vip = vips.find(tempo => tempo.mID === id);

  // Outros itens genéricos { nome: '', valor: '', mID: '' }
  let outros = [];
  Object.keys(catálogo).forEach(item => {
    if(catálogo[item].valor !== undefined) {
      outros.push(catálogo[item]);
      mIDs.push(catálogo[item].mID)
    }
  });
  const outro = outros.find(item => item.mID === id);

  // Verifica se a mensagem está dentre as da loja e aciona a função do item
  if(!mIDs.includes(id)) return;

  if(!client.usersData.get(user.id)) return;
  const uDB = client.usersData.get(user.id);

  // Apaga a reação selecionada
  const reacts = reaction.message.reactions.cache;
  await reacts.forEach(async react => {
    if(react._emoji.name == reaction._emoji.name) {
      await react.remove()
        .catch(error => console.error('messageReactionAdd => Falha ao remover emoji: ', error))
    }
  });

  // Reage denovo
  reaction.message.react(reaction._emoji)
  .catch(error => console.error('messageReactionAdd => Falha ao adicionar emoji: ', error))

  // Caso o id seja de info
  if(info !== undefined) {
    user.send(info.texto);

   // Caso o id seja de uma cor
  } else if(cor) {
    const valor = gc === 'gems' ? cor.valor/1000 : cor.valor;
    let cores = uDB.cores ? uDB.cores : []; 

    // Caso já tenha essa cor

    if(cores.includes(cor.rID)) confirmação.send(`${user}`, 
      { embed: { 
        color: emojis.warningC,
        description: `${emojis.warning} | Você já possui a cor **${cor.nome}**`
      }}).then(() => shopLog.send(shopEmbed(0, cor.nome, valor, gc, user, uDB)))

      // Caso não tenha essa cor
    else {
      const compra = await comprar(cor.nome, valor, confirmação, user, gc, client);
      shopLog.send({ embed : shopEmbed(compra, cor.nome, valor, gc, user, uDB) });
      cores.push(cor.rID);
      
      // Caso compra sucedida
      if(compra === true) {
        uDB['cores'] = cores;
      }
    }

  // Caso o id seja de um vip
  } else if(vip) { 
    const valor = gc === 'gems' ? vip.valor/1000 : vip.valor;
    const compra = await comprar(vip.nome, valor, confirmação, user, gc, client);
    shopLog.send({ embed : shopEmbed(compra, vip.nome, valor, gc, user, uDB) });

    const timestamp = uDB.vip ? parseInt(uDB.vipUntil) + parseInt(vip.tempo) : d.valueOf() + parseInt(vip.tempo);
    if(compra === true) {
      uDB.vip = true;
      uDB.vipUntil = timestamp;

      // Cria o apartamento
      const canal = {
        type: 'voice',
        parent: categVip,
        permissionOverwrites: [
          {
            id: user.id,
            allow: Permissions.ALL,
          }
        ],
      }
      try { 
        await Wclub.channels.create(`Apartamento de ${user.tag}`, canal, `Apartamento comprado por ${user.tag}`)
        confirmação.send({embed: { color: emojis.successC , description: stripIndents`${emojis.success} | Canal criado com sucesso, agora basta personalizar ele como quiser.
        
        Por enquanto todos podem ver seu canal, mas você pode mudar isso.
        
        Você tem permissão para modificar as permissões do seu canal e até apaga-lo se desejar(mas não espere que criemos outro pra você).`}});
        shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });
      } catch(err) {
          console.log(err);
          confirmação.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | Algo deu errado tentando criar seu canal, suas ${valor} ${gc} foram devolvidas`}});
          uDB[gm] += valor;
          shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB)});
      }

      // Define as perguntas e respostas para a cor da tag
      pergunta = 'Escolha uma cor dentre as disponíveis em <#754552398751596644> para sua tag:\n\nEu só vou responder quando você responder com o nome de uma cor válida ou demorar demais...';
      sucesso = `Cor selecionada com sucesso\!`;
      falha = `Você não enviou uma cor válida a tempo, tente denovo:\n\nEu só vou responder quando você responder com o nome de uma cor válida ou demorar demais...\n\n • __As cores válidas são as disponíveis em <#754552398751596644>__`;
      falhaT = `Suas tentativas acabaram, suas ${valor} ${gc} foram devolvidas`;
      filtro = res => {
        const value = res.content.toLowerCase();
        return (user ? res.author.id === user.id : true) && (cores.some(cor => cor.aliases.includes(value)));
      };

      // Pergunta a cor da tag
      const corM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 5, 30000, filtro);
      if(corM) cor = Wclub.roles.cache.get(cores.find(cor => cor.aliases.includes(corM.content.toLowerCase())).rID).color;
      else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);

      // Define as perguntas e respostas para o nome da tag
      pergunta = 'Agora, escolha o nome da sua tag:';
      sucesso = `Nome selecionado com sucesso! Criando tag...`;
      falha = `Você não enviou um nome válido a tempo, suas ${valor} ${gc} foram devolvidas`;
      filtro = res => { return (user ? res.author.id === user.id : true) };
      
      // Pergunta o nome da tag
      nomeM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 2, 60000, filtro);
      if(nomeM) nome = nomeM.content;
      else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);
      
      // Criando e adicionando tag
      try {
        const tag = await Wclub.roles.create({
          data: {
            name: nome,
            color: cor,
            permissions: 0,
            position: Wclub.roles.cache.get('750037696570851422').rawPosition - 1,
            mentionable: true
          },
          reason: `Tag comprada por ${user.tag}`
        });
        await wcMember.roles.add(tag);
        confirmação.send(`${user}`, {embed: {color: emojis.successC, description: stripIndents`${emojis.success} | Sua tag já foi criada e adicionada ao seu usuário no server principal !`} });
        shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });
      
      // Caso algo dê errado
      } catch(err) {
        console.log(err);
        uDB[gm] += valor;
        shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) });
        confirmação.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | Algo deu errado tentando criar sua tag, suas ${valor} ${gc} foram devolvidas`}})

      }
      Wstore.channels.cache.get('750031689132277901').send(stripIndents`
      <@&750084283481325671> ${user} criou uma **TAG** com o nome \`${nome}\`, verifiquem lá...
      `)
    }

  } else if(outro) {
    valor = gc === 'gems' ? outro.valor/1000 : outro.valor;
    const compra = await comprar(outro.nome, valor, confirmação, user, gc, client);

    if(compra === true) {
      switch(outro.mID){
        // Emoji
        case '754553933489373246':
          nome = false;
          let img = false;

          // Define as perguntas para o nome do emoji
          pergunta = 'Escolha um nome para o emoji(pelomenos 2 caracteres):\n\nEu só vou responder quando você mandar um nome válido ou demorar demais...';
          sucesso = `Nome selecionado com sucesso\!`;
          falha = `Você não enviou um nome válido a tempo, tente denovo:\n\nEu só vou responder quando você mandar um nome válido ou demorar demais...\n\n • __O nome dos emojis tem que ter pelomenos 2 caracteres__\n • __O nome dos emojis só pode conter caracteres alfanuméricos e underlines__`;
          falhaT = `Suas tentativas acabaram, suas ${valor} ${gc} foram devolvidas`;
          filtro = res => {
            const value = res.content.toLowerCase();
            return (user ? res.author.id === user.id : true) &&
            (value.length >= 2) && (value.match(/^[0-9a-zA-Z]*_*$/));
          };

          // Pergunta o nome do emoji
          nomeM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 3, 30000, filtro);
          if(nomeM) nome = nomeM.content;
          else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);

          // Define as perguntas para o emoji
          pergunta = 'Agora, envie uma imagem para ser usada como emoji (128x128):\n\nEu só vou responder quando você mandar uma imagem com um tamanho válido ou demorar demais...';
          sucesso = `Imagem selecionada com sucesso\!`;
          falha = `Você não enviou uma imagem válida a tempo, tente denovo:\n\nEu só vou responder quando você mandar uma imagem com um tamanho válido ou demorar demais...\n\n • __As imagens válidas tem que ter menos que 256kb e no máximo 128px x 128px__`;
          falhaT = `Suas tentativas acabaram, suas ${valor} ${gc} foram devolvidas`;
          filtro = async res => {
            if(!res.attachments.first()) return false;
            const img = res.attachments.first().url;
            const probe = require('probe-image-size');
            const dados = await probe(img);
            return (user ? res.author.id === user.id : true) &&
            (dados.width <= 128) && (dados.height <= 128);
          }

          // pergunta a imagem
          const imgM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 3, 450000, filtro);
          if(imgM) img = imgM.attachments.first().url;
          else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);

          // Criando emoji
          try {
            const emoji = await Wclub.emojis.create(img, nome, {reason: `Emoji comprado por ${user.tag}`});
            confirmação.send(`${user}`, {embed: {color: emojis.successC, description: stripIndents`${emojis.success} | ${emoji} criado com sucesso!`}});
            shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });

          // Caso algo dê errado
          } catch(err) {
            console.log(err);
            uDB[gm] += valor;
            shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) });
            confirmação.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | Algo deu errado tentando criar sua tag, suas ${valor} ${gc} foram devolvidas`}})
          }

          Wstore.channels.cache.get('750031689132277901').send(stripIndents`
          <@&750084283481325671> ${user} comprou o **EMOJI** :${nome}:, olhem aí...
          `)
          break;

        // Tag
        case '754554148556505118':
          let cor = false;
          nome = false;

          // Define as perguntas e respostas para a cor da tag
          pergunta = 'Escolha uma cor dentre as disponíveis em <#754552398751596644> para sua tag:\n\nEu só vou responder quando você responder com o nome de uma cor válida ou demorar demais...';
          sucesso = `Cor selecionada com sucesso\!`;
          falha = `Você não enviou uma cor válida a tempo, tente denovo:\n\nEu só vou responder quando você responder com o nome de uma cor válida ou demorar demais...\n\n • __As cores válidas são as disponíveis em <#754552398751596644>__`;
          falhaT = `Suas tentativas acabaram, suas ${valor} ${gc} foram devolvidas`;
          filtro = res => {
            const value = res.content.toLowerCase();
            return (user ? res.author.id === user.id : true) && (cores.some(cor => cor.aliases.includes(value)));
          };

          // Pergunta a cor da tag
          const corM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 5, 30000, filtro);
          if(corM) cor = Wclub.roles.cache.get(cores.find(cor => cor.aliases.includes(corM.content.toLowerCase())).rID).color;
          else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);

          // Define as perguntas e respostas para o nome da tag
          pergunta = 'Agora, escolha o nome da sua tag:';
          sucesso = `Nome selecionado com sucesso! Criando tag...`;
          falha = `Você não enviou um nome válido a tempo, suas ${valor} ${gc} foram devolvidas`;
          filtro = res => { return (user ? res.author.id === user.id : true) };
          
          // Pergunta o nome da tag
          nomeM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 2, 60000, filtro);
          if(nomeM) nome = nomeM.content;
          else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);
          
          // Criando e adicionando tag
          try {
            const tag = await Wclub.roles.create({
              data: {
                name: nome,
                color: cor,
                permissions: 0,
                position: Wclub.roles.cache.get('750037696570851422').rawPosition - 1,
                mentionable: true
              },
              reason: `Tag comprada por ${user.tag}`
            });
            await wcMember.roles.add(tag);
            confirmação.send(`${user}`, {embed: {color: emojis.successC, description: stripIndents`${emojis.success} | Sua tag já foi criada e adicionada ao seu usuário no server principal !`} });
            shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });
          
          // Caso algo dê errado
          } catch(err) {
            console.log(err);
            uDB[gm] += valor;
            shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) });
            confirmação.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | Algo deu errado tentando criar sua tag, suas ${valor} ${gc} foram devolvidas`}})

          }
          Wstore.channels.cache.get('750031689132277901').send(stripIndents`
          <@&750084283481325671> ${user} comprou uma **TAG** com o nome \`${nome}\`, verifiquem lá...
          `)
          break;

        // Apartamento
        case '754554310620348426':
          const canal = {
            type: 'voice',
            parent: categApart,
            permissionOverwrites: [
              {
                id: user.id,
                allow: Permissions.ALL,
              }
            ],
          }
          try { 
            await Wclub.channels.create(`Apartamento de ${user.tag}`, canal, `Apartamento comprado por ${user.tag}`)
            confirmação.send({embed: { color: emojis.successC , description: stripIndents`${emojis.success} | Canal criado com sucesso, agora basta personalizar ele como quiser.
            
            Por enquanto todos podem ver seu canal, mas você pode mudar isso.
            
            Você tem permissão para modificar as permissões do seu canal e até apaga-lo se desejar(mas não espere que criemos outro pra você).`}});
            shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });
          } catch(err) {
              console.log(err);
              confirmação.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | Algo deu errado tentando criar seu canal, suas ${valor} ${gc} foram devolvidas`}});
              uDB[gm] += valor;
              shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB)});
          }
          
          break

      }
    } else return shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });
  }
}
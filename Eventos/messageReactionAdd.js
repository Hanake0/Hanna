const { stripIndents } = require('common-tags');
const catálogo = require('../Assets/JSON/catálogo.json');
const emojis = require('../Assets/JSON/emojis.json');
const { comprar, shopEmbed } = require('../Assets/util/util2.js');
const d = Date.now() - 10800000;
let hora = `${new Date(d).getHours() - 3}:${new Date(d).getMinutes()}:${new Date(d).getSeconds()} `;

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
  const categApart = '754411415548199054';

  const emojiId = reaction.emoji.id;
  const id = reaction.message.id;
  const gc = emojiId === '750840705269891112' ? 'gems' : 'coins';

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
  await reaction.message.reactions.cache.forEach(async react => {
    if(react.emoji.id == emojiId) {
      await reaction.remove()
        .catch(error => console.error('messageReactionAdd => Falha ao remover emoji: ', error))
    }
  });
  // Reage denovo
  reaction.message.react(emojiId)
    .catch(error => console.error('messageReactionAdd => Falha ao adicionar emoji: ', error))

  // Caso o id seja de info
  if(info !== undefined) {
    user.send(info.texto);

   // Caso o id seja de uma cor
  } else if(cor) {
    const valor = gc === 'gems' ? cor.valor/1000 : cor.valor;
    let cores = uDB.cores ? uDB.cores : []; 

    // Caso já tenha essa cor
    if(uDB.cores.includes(cor.rID)) confirmação.send(`${user}`, 
      { embed: { 
        color: emojis.warningC,
        description: `${emojis.warning} | Você já possui a cor **${cor.nome}**`
      }}).then(() => shopLog.send(shopEmbed(0, cor.nome, valor, gc, user, uDB)))
   
      // Caso não tenha essa cor
    else {
      const compra = await comprar(cor.nome, valor, confirmação, user, gc, uDB);
      shopLog.send({ embed : shopEmbed(compra, cor.nome, valor, gc, user, uDB) });
      cores.push(cor.rID);
      
      // Caso compra sucedida
      if(compra === true) {
        uDB['cores'] = cores;
        uDB[gc === 'gems' ? 'gems' : 'money'] -= valor;
      }
    }

  // Caso o id seja de um vip
  } else if(vip) { 
    const valor = gc === 'gems' ? vip.valor/1000 : vip.valor;
    const compra = await comprar(vip.nome, valor, confirmação, user, gc, uDB);
    shopLog.send({ embed : shopEmbed(compra, vip.nome, valor, gc, user, uDB) });

    const timestamp = uDB.vip ? parseInt(uDB.vipUntil) + parseInt(vip.tempo) : d.valueOf() + parseInt(vip.tempo);
    if(compra === true) {
      uDB.vip = true;
      uDB.vipUntil = timestamp;
      uDB[gc === 'gems' ? 'gems' : 'money'] -= valor;
    }

  } else if(outro) {
    valor = gc === 'gems' ? outro.valor/1000 : outro.valor;
    const compra = await comprar(outro.nome, valor, confirmação, user, gc, uDB);
    shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });

    switch(outro.mID){
      // Emoji
      case '754553933489373246':
        if(compra === true) {
          Wstore.channels.cache.get('750031689132277901').send(stripIndents`
          ${user} comprou um **EMOJI**, faz o bagulho lá meo <@&750084283481325671>
          `)
        }
        break;

      // Tag
      case '754554148556505118':
        if(compra === true) {
          Wstore.channels.cache.get('750031689132277901').send(stripIndents`
          ${user} comprou uma **TAG**, faz o bagulho lá meo <@&750084283481325671>
          `)
        }
        break;

      // Apartamento
      case '754554310620348426':
        if(compra === true) {
          const canal = {
            type: 'voice',
            parent: categApart,
            permissionOverwrites: [
              {
                id: user.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNEL'],
              },
              {
                id: Wclub.id,
                deny: ['VIEW_CHANNEL'],
              },
            ],
          }
          await Wclub.channels.create(`Apartamento de ${user.tag}`, canal, 'Apartamento comprado.')
          user.send(stripIndents`${emojis.success} | Canal criado com sucesso, agora basta personalizar ele como quiser.
          
          Por enquanto apenas você tem permissão para ver este canal, mas você pode mudar isso.
          
          Você tem permissão para modificar as permissões do seu canal e até apaga-lo se desejar(mas não espere que criemos outro pra você).`);
        }
        break

    }
  }
}
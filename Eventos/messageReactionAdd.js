const catálogo = require('../Assets/JSON/catálogo.json');
const emojis = require('../Assets/JSON/emojis.json');
const { cor } = require('../Assets/util/inventário.js');
const { usersOffDB } = require('../index.js');
const { comprar } = require('../Assets/util/util2.js');
const d = new Date();
const hora = `${d.getHours() - 3}:${d.getMinutes()}:${d.getSeconds()} `

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
    if(catálogo[item].mID !== undefined) {
      outros.push(catálogo[item]);
      mIDs.push(catálogo[item].mID)
    }
  });

  // Verifica se a mensagem está dentre as da loja e aciona a função do item
  if(!mIDs.includes(id)) return;

  if(!usersOffDB.has(user.id).value()) return;
  const uDB = usersOffDB.get(user.id);

  // Apaga a reação selecionada
  await reaction.message.reactions.cache.forEach(async reaction => {
    if(reaction.count > 1) {
      await reaction.remove()
        .catch(error => console.error('messageReactionAdd => Falha ao remover emoji: ', error))
    }
  });
  // Reage denovo
  reaction.message.react(emojiId);


  // Caso o id seja de uma cor
  if(cor !== undefined) {
    const valor = gc === 'gems' ? cor.valor/1000 : cor.valor;
    let cores = uDB.value().cores ? uDB.value().cores : []; 

    // Caso já tenha essa cor
    if(uDB.value().cores.includes(cor.rID)) confirmação.send(`${user}`, 
      { embed: { 
        color: emojis.warningC,
        description: `${emojis.warning} | Você já possui a cor **${cor.nome}**`
      }});
    // Caso não tenha essa cor
    else {
      const compra = await comprar(cor.nome, valor, confirmação, user, gc);
      cores.push(cor.rID);
      if(compra) uDB
        .set('cores', cores)
        .update(gc === 'gems' ? 'gems' : 'money', num => num - valor)
        .write();
    }

  // Caso o id seja de um vip
  } else if(vip !== undefined) { 
    const valor = gc === 'gems' ? vip.valor/1000 : vip.valor;
    const compra = await comprar(vip.nome, valor, confirmação, user, gc);

    const timestamp = uDB.value().vip ? parseInt(uDB.value().vipUntil) + parseInt(vip.tempo) : d.valueOf() + parseInt(vip.tempo);
    if(compra) uDB
      .assign({
        vip: true,
        vipUntil: timestamp
      })
      .update(gc === 'gems' ? 'gems' : 'money', num => num - valor)
      .write();

    
  } else if(outros.find(item => item.mID === id) !== undefined) {
    return
  }
}
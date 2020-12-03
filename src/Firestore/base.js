import { hora } from '../util.js';
import { wcUser } from '../Classes/user.js';

export class FirestoreManager {
  constructor(client, db) {
    this.db = db;

    this.client = client;
  }

  init() {
    this.initUsers();
    this.initExpiringItens();
  }
  
  initUsers() {
    // Baixa os dados e armazena no cache
    this.db.collection('usuarios').get()
      .then(docs => docs.forEach(snap => {
        for (const [id, data] of Object.entries(snap.data())) {
          this.client.data.users.cache.set(id, new wcUser(this.client, data))
        }
      }));

    // Configura updates a cada 15 min 
    this.client.setInterval(async () => {
      this.client.emit('firestoreDebug', hora(), 'Iniciando update de usuários...');
      try {
        let repeats = Math.ceil((this.client.data.users.cache.size)/250);
        let now = 1;
        
        while(now <= repeats) {
          let users = {};
    
          this.client.data.users.cache.forEach(user => {
            if(user.num > ((now - 1) * 250) && user.num <= (now * 250)) {
              users[user.id] = user.toFirestore();
            }
          });
          this.client.emit('firestoreDebug', hora(), `Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados e convertidos`);
          this.client.emit('firestoreDebug', hora(),`Iniciado update do doc ${now}...`);
          await this.db.collection('usuarios').doc(`${now}`).set(users);
          this.client.emit('firestoreDebug', hora(),`Update de doc ${now} concluído !`);
          now ++;
        }
      } catch(err) {
        this.client.emit('firestoreDebug', hora(), `Erro durante update dos usuários ${err.name}: ${err.message}`);
        this.client.waifusClub.channels.cache.get('732710544330457161')
          .send(`${hora()}Erro durante update dos usuários: ${err.name}: ${err.message}`)
      }
      this.client.emit('firestoreDebug', hora(), 'Fim do update de usuários.')
    }, 900000);
  }

  initExpiringItens() {
    // Baixa os dados e armazena no cache
    this.db.collection('expiring').get()
      .then(docs => docs.forEach(async snap => {
        for (const [idType, data] of Object.entries(snap.data())) {
          const id = idType.slice(0, 18);
          const type = idType.slice(id.length);

          if(type === 'misc') await this.setupItem(id, type, data, true, true);
          else await this.setupItem(id, type, data);
        }
      }))
    
    // Configura updates a cada 15 min
    this.client.setInterval(async () => {
      this.client.emit('firestoreDebug', hora(), 'Iniciando update de itens temporários...');
      try {
        const data = this.client.data;

        // Junta todos os itens em um map só
        const totalItens = new Map();
        for(const category of Object.keys(data)) {
          if(!['users', 'invites', 'deletedMessages'].includes(category)) {
            const collection = data[category].cache ? data[category].cache : data[category];

            collection.forEach((item, id) => { 
              if(item instanceof Set) item.forEach(item => totalItens.set(`${id}${category}`, item));
              else totalItens.set(`${id}${category}`, item);
            });
          }
        }
        const keys  = Array.from(totalItens.keys());

        const repeats = Math.ceil(totalItens.size/250);
        let now = 1;
        
        // Divide em docs com 250 itens
        do {
          const itensObject = {};

          for(let i = 1; i < 250; i++) {
            // Define o ID/Tipo e remove do array com as keys
            const idType = keys.pop();

            // Define o ID/Tipo no objecto com os itens
            if(idType) itensObject[idType] = totalItens.get(idType).toFirestore();
          }

          this.client.emit('firestoreDebug', hora(), `Itens temporários de ${(now - 1) * 250} a ${(now * 250)} filtrados e convertidos`);
          this.client.emit('firestoreDebug', hora(),`Iniciado update do doc ${now}...`);
          await this.db.collection('expiring').doc(`${now}`).set(itensObject);
          this.client.emit('firestoreDebug', hora(),`Update de doc ${now} concluído !`);
          now ++;
        } while(now < repeats);
      } catch(err) {
        this.client.emit('firestoreDebug', hora(), `Erro durante update dos itens temporários ${err.name}: ${err.message}`);
        this.client.waifusClub.channels.cache.get('732710544330457161')
          .send(`${hora()}Erro durante update dos itens temporários: ${err.name}: ${err.message}`)
      }
      this.client.emit('firestoreDebug', hora(), 'Fim do update de itens temporários.')
    }, 900000);
  }

  // Configura um item específico vindo do Firestore
  async setupItem(id, type, data, inventory = false, set = false) {
    const { default: ItemConstructor } = await import(data._path);
    const item = new ItemConstructor(this.client, data);

    // Configura o timeout se dentro de um tempo razoável
    if(0 < item.remainingTime < 86400000) 
      item.timeout = this.client.setTimeout(item.expire.bind(item), item.remainingTime);
    else if(item.remainingTime < 0) item.expire.bind(item);

    // Adiciona ao inventario se necessário
    if(inventory) this.client.data.users.resolveUser({id: id}).inventory.temporary.push(item);

    // Adiciona ao cache
    const clientData = this.client.data[type].cache ? this.client.data[type].cache : this.client.data[type];
    if(set) {
      if(clientData.has(id)) clientData.get(id).add(item);
      else clientData.set(id, new Set([ item ]));
    } else clientData.set(id, item);
  }
}
import admin from 'firebase-admin';
import serviceAccount from './serviceAccount.js';
import serviceAccount2 from './serviceAccount2.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const objectUser = {
  num: 1,
  id: '380512056413257729',
  invites: 2,
  wallet: { coins: 3, gems: 4 },
  messages: 3,
  buddy: {
    hat: 'preto',
  },
  xp: 5,
  lastMessage: { content: 'aaa' },
  inventory: {
    permanent: [],
    temporary: [],
  },
  jobs: {
    1: { _type: 'ProgrammerJob', _path: '../Trabalhos/programmer.js', lastWork: 1605556071750, cooldown: 1606160906159 },
    2: { _type: 'DesignerJob', _path: '../Trabalhos/designer.js', lastWork: 1605556071750, cooldown: 1606160906159 },
  },
};

const objectEmoji = {
  _type: 'EmojiN1',
  _path: '../Inventário/Items/Misc/emoji1.js',
  _userID: '380512056413257729',
  type: 'misc',
  emojiID: '747487589639913564',
  expiringTime: 1606953938971
}

console.log(objectUser)

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount2)
});

const db = admin.firestore();

const users = {};
users[objectUser.id] = objectUser;

const itens = {};
itens[`${objectEmoji._userID}misc`] = objectEmoji;

db.collection('usuarios').doc('1').set(users);
db.collection('expiring').doc('1').set(itens);
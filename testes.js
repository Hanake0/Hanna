import admin from 'firebase-admin';
import serviceAccount from './serviceAccount.js';
import serviceAccount2 from './serviceAccount2.js';
import wcUser from './Assets/Custom Classes/user.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const wUser = new wcUser({
  num: 1,
  id: '380512056413257729',
  invites: 2,
  wallet: { coins: 3, gems: 4 },
  messages: 3,
  lastMessage: { content: 'aaa' },
  inventory: {
    permanent: [],
    temporary: [ { _type: 'UsedEmojiN1', _path: '../Inventário/Items/usedEmoji1.js', validTimestamp: 1606160906159 } ],
  },
  jobs: {
    1: { _type: 'ProgrammerJob', _path: '../Trabalhos/programmer.js', lastWork: 1605556071750, cooldown: 1606160906159 },
    2: { _type: 'DesignerJob', _path: '../Trabalhos/designer.js', lastWork: 1605556071750, cooldown: 1606160906159 },
  }
});
const objectUser = {
  num: 1,
  id: '380512056413257729',
  invites: 2,
  wallet: { coins: 3, gems: 4 },
  messages: 3,
  xp: 5,
  lastMessage: { content: 'aaa' },
  inventory: {
    permanent: [],
    temporary: [ { _type: 'UsedEmojiN1', _path: '../Inventário/Items/usedEmoji1.js', validTimestamp: 1606160906159 } ],
  },
  jobs: {
    1: { _type: 'ProgrammerJob', _path: '../Trabalhos/programmer.js', lastWork: 1605556071750, cooldown: 1606160906159 },
    2: { _type: 'DesignerJob', _path: '../Trabalhos/designer.js', lastWork: 1605556071750, cooldown: 1606160906159 },
  },
};

console.log(objectUser)

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount2)
});

const db = admin.firestore();

const users = {};
users[objectUser.id] = objectUser;
console.log(users)
db.collection('usuarios').doc('1').set(users)
import admin from 'firebase-admin';
import serviceAccount from './serviceAccount.js';
import serviceAccount2 from './serviceAccount2.js';

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}



admin.initializeApp({
	credential: admin.credential.cert(serviceAccount2),
});

const db = admin.firestore();


db.collection('usuarios').doc('1').set({ data: [] });
db.collection('itens').doc('1').set({ data: [] });

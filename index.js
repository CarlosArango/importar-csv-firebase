const fs = require('fs');
const csv = require('csv-parser');
var admin = require('firebase-admin');

const results = [];
const serviceAccount = require('./config/firebase_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const importData = (results = []) => {
  const docRef = db.collection('matches').doc('7vtBm1Zrd8cqhwZOO9MX');
  docRef.set({ detPart: results }, { merge: true });
};

fs.createReadStream('detallPartido1.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    importData(results);
  });

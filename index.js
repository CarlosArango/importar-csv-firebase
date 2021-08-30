const csv = require('csv-parser');
const fs = require('fs');
const admin = require('firebase-admin');
const results = [];
const serviceAccount = require('./config/firebase.json');
const file = 'users.csv';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const returnFlattenObject = (arr) => {
  const flatObject = {};
  for (let i = 0; i < arr.length; i++) {
    for (const property in arr[i]) {
      flatObject[`${property}`] = arr[i][property];
    }
  }
  return flatObject;
};

const importUsers = (users = []) => {
  const db = admin.firestore();
  const usersCollection = db.collection('users');
  users.forEach((user = {}) => {
    const array = [];
    Object.keys(user).forEach((key) => {
      const splittedKey = key.split('.');
      if (splittedKey.length > 1) {
        const keyObject = splittedKey[0];
        const value = splittedKey[1];
        array.push({ [value]: user[key] });
      }
      user.dept = [returnFlattenObject(array)];
    });

    usersCollection.add(user);

    /*     if (splittedKey.length > 1) {
      dep.push();
    } */
  });
};

fs.createReadStream(file)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    importUsers(results);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });

console.log('Working...');

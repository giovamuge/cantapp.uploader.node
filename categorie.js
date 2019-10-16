// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require('firebase/app');
const fs = require('fs');
const path = require('path');

// Add the Firebase products that you want to use
require('firebase/auth');
require('firebase/firestore');

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAvY92afgZ7gtRvlZSaodFrgG0ORZRozFw',
	authDomain: 'mgc-cantapp.firebaseapp.com',
	databaseURL: 'https://mgc-cantapp.firebaseio.com',
	projectId: 'mgc-cantapp',
	storageBucket: 'mgc-cantapp.appspot.com',
	messagingSenderId: '44505885939',
	appId: '1:44505885939:web:86ad78b7062564f47ddb86'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const file = path.join(__dirname, './upload/categorie.txt');
fs.readFile(file, (err, data) => {
	if (err) throw err;
	const res = `${data}`;
	const lines = res.split('\n');
	let currentCateogry = '';
	let category = { name: '', songs: [] };
	let categories = [];
	for (let i = 0; i < lines.length; i++) {
		// linea
		const line = lines[i];

		if (/^[0-9]{1,3}\./.test(line) || /^{b}[0-9]{1,3}\./.test(line)) {
			// ottengo il titolo
			// rimuovo numero e "-"
			const title = line
				.replace(/^[0-9]{1,3}\./g, '')
				.replace(/^{b}[0-9]{1,3}\./g, '')
				.replace(/&+[A-z]+;/g, '')
				.replace(/({\/b})/g, '')
				.replace(/({b})/g, '')
				.replace('-', '')
				.replace('.', '');

			const titleDecoded = title.trim();
			category.songs.push(titleDecoded);
		} else {
			categories.push(category);
			category = { name: line, songs: [] };
			// currentCateogry = line;
		}
	}

	// rimuovi primo elemento vuoto
	categories.shift();

	categories.forEach(c =>
		// console.log(`categoria: ${c.name} | canzoni: ${c.songs.length}`)
		c.songs.forEach(s =>
			db
				.collection('songs')
				.where('title', '==', camelCase(s.toLowerCase()))
				.get()
				.then(snapshot => {
					if (snapshot.empty) {
						console.log('No matching documents.');
						return;
					}

					snapshot.forEach(doc => {
						// console.log(doc.id, '=>', doc.data());
						const data = doc.data();
						if (!data.categories) {
							data.categories = [];
						}

						data.categories.push(c.name);
						db.doc(`songs/${doc.id}`)
							.update(data)
							.then(() => console.log(doc.id, '=>', c.name));
					});
				})
				.catch(err => {
					console.log('Error getting documents', err);
				})
		)
	);
});

const camelCase = value =>
	value.substring(0, 1).toUpperCase() + value.substring(1);

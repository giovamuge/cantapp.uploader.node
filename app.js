// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require('firebase/app');
const fs = require('fs');
const path = require('path');
const express = require('express');
// @ts-ignore
const app = express();
const jsdom = require('jsdom');
const JSDOM = jsdom.JSDOM;

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

const songs = [];

// app.get('/', (req, res) => res.send('Hello World!'));
// // app.use('/static', express.static('upload'));
// app.get('/canti', (req, res) =>
// 	res.sendFile(path.join(__dirname, './upload/canti.html'))
// );
// app.listen(3000, () => console.log('server listening port 3000'));

const file = path.join(__dirname, './upload/canti.html');
fs.readFile(file, (err, data) => {
	if (err) console.error(err);
	const dom = new JSDOM(data);
	const document = dom.window.document;

	const lines = document.getElementsByTagName('p');
	let song = { title: '', lyric: '' };

	for (let i = 0; i < lines.length; i++) {
		const line = getline(lines[i]);

		// has any number in line
		if (/^[0-9]{1,3}\./.test(line) || /^{b}[0-9]{1,3}\./.test(line)) {
			// aggiungo song
			// rimuovo campi vuoti prima e dopo string
			song.lyric = song.lyric.trim();
			songs.push(song);
			song = { title: '', lyric: '' };
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

			// const titleDecoded = title;
			song.title = camelCase(title.trim().toLowerCase());
			continue;
		}

		const textDecoded = decode(line);
		song.lyric += `${textDecoded}\n`;

		if (i === lines.length - 1) {
			song.lyric = song.lyric.trim();
			songs.push(song);
		}
	}

	// 			// rimuovi primo elemento vuoto
	songs.shift();
	// fs.writeFile('stringfy.json', JSON.stringify(songs), 'utf8', () =>
	// 	console.log('song uploaded with success')
	// );

	let k = 0;
	songs.forEach(async song => {
		await db.collection('songs').add(song);
		k++;
		console.log(`song uploaded ${k}/${songs.length}`);

		if (k == songs.length) {
			console.log('song uploaded with success');
		}
	});
});

const camelCase = value =>
	value.substring(0, 1).toUpperCase() + value.substring(1);

const getline = html => {
	const spans = html.getElementsByTagName('span');
	let text = '';
	// isBold = false;
	for (let i = 0; i < spans.length; i++) {
		// if (!isBold) isBold = spans[i].style.fontWeight === 'bold';
		const isBold = spans[i].style.fontWeight === 'bold';
		if (isBold) text += `{b}${spans[i].innerHTML}{/b}`;
		else text += spans[i].innerHTML;
	}
	// return { text, isBold };
	return text;
};

/**
 * Converts an html characterSet into its original character.
 *
 * @param {String} str htmlSet entities
 **/
const decode = str => str.replace(/&+[A-z]+;/g, '');
// str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

// fs.readdir('upload', (err, files) =>
// 	files.forEach(file =>
// 		// console.log(file)
// 		fs.readFile(`upload/${file}`, (err, data) => {
// 			if (err) throw err;
// 			const res = `${data}`;
// 			const lines = res.split('\n');
// 			let song = { title: '', lyric: '' };

// 			for (var i = 0; i < lines.length; i++) {
// 				// has any number in line
// 				if (/[0-9]/.test(lines[i])) {
// 					// if (songs.length !== 0) {
// 					songs.push(song);
// 					song = { title: '', lyric: '' };
// 					// }

// 					// ottengo il titolo
// 					// rimuovo numero e "-"
// 					const title = lines[i]
// 						.replace(/[0-9]/g, '')
// 						.replace('-', '');

// 					console.log(title);

// 					song.title = title;
// 					continue;
// 				}

// 				song.lyric += `${lines[i]}\n`;

// 				if (i === lines.length - 1) {
// 					songs.push(song);
// 				}
// 			}

// 			// rimuovi primo elemento vuoto
// 			songs.shift();
// 			console.log(songs);

// 			songs.forEach(async song => await db.collection('songs').add(song));
// 		})
// 	)
// );

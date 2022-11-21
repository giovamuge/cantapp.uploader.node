// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Add the Firebase products that you want to use
require("firebase/firestore");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mgc-cantapp.firebaseio.com",
});

const db = admin.firestore();
db.collection("songs")
    .orderBy("title")
    .get()
    .then((querySnapshot) => {
        console.log(`get songs...`);
        const songs = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            songs.push({
                title: data.title,
                artist: data.artist ?? "",
                id: doc.id,
            });
        });

        db.doc("songs_index/v1")
            .get()
            .then(
                (doc) => {
                    const batch = db.batch();
                    // const data = doc.data();
                    // console.log(songs);
                    // const songs = data.index;

                    // console.log(`number: ${data.number} | index: ${data.title}`);
                    batch.update(doc.ref, {
                        index: songs,
                        updatedAt: admin.firestore.Timestamp.now(),
                    });
                    console.log(`batch songs index ${songs.length}`);

                    // Commit the batch
                    batch.commit().then(() => console.log("batch committed"));
                },
                (err) => console.error(err)
            );
    });

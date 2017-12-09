var async = require('async');
const vision = require('@google-cloud/vision');

var gcloud = require('google-cloud')({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    key: process.env.G_API_KEY
});

exports.checkIfLaughing = function(fileName, next) {
    checkIfLaughing(fileName,next);
}

function checkIfLaughing(fileName, next) {
    //future: compress images? + test with image without face
    const client = new vision.ImageAnnotatorClient();
    client.faceDetection(fileName)
    .then((results) => {
        const faces = results[0].faceAnnotations;

        console.log(JSON.stringify(faces));
        console.log('Faces:');
        faces.forEach((face, i) => {
            console.log(`  Face #${i + 1}:`);
            console.log(`    Joy: ${face.joyLikelihood}`);
        });
        next(faces);
    })
    .catch((err) => {
        console.error('ERROR:', err);
        next();
    });
}
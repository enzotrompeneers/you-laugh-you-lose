var async = require('async');
const vision = require('@google-cloud/vision');

var gcloud = require('google-cloud')({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    key: process.env.G_API_KEY
});

function checkIfLaughing(image, next) {
    //future: compress images? + test with image without face
    const client = new vision.ImageAnnotatorClient();
    const fileName = './images/people.jpg';
    client.faceDetection(fileName)
    .then((results) => {
        const faces = results[0].faceAnnotations;

        /* console.log('Faces:');
        faces.forEach((face, i) => {
            console.log(`  Face #${i + 1}:`);
            console.log(`    Joy: ${face.joyLikelihood}`);
        }); */
        next(faces);
    })
    .catch((err) => {
        console.error('ERROR:', err);
        next();
    });
}
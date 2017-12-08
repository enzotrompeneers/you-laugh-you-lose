require('dotenv').config();

var async = require('async');
/* const vision = require('@google-cloud/vision');

var gcloud = require('google-cloud')({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    key: process.env.G_API_KEY
});
 
//future: compress images?

const client = new vision.ImageAnnotatorClient();
const fileName = './images/people.jpg';
client.faceDetection(fileName)
  .then((results) => {
    const faces = results[0].faceAnnotations;

    console.log('Faces:');
    faces.forEach((face, i) => {

      console.log(`  Face #${i + 1}:`);
      console.log(`    Joy: ${face.joyLikelihood}`);
      console.log(`    Anger: ${face.angerLikelihood}`);
      console.log(`    Sorrow: ${face.sorrowLikelihood}`);
      console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });
  })
  .catch((err) => {
    console.error('ERROR:', err);
  }); */



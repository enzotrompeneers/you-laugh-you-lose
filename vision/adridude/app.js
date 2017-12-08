require('dotenv').config();

var projectId = process.env.PROJECT_ID;

var gcloud = require('google-cloud')({
    projectId: projectId,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    key: process.env.GOOGLE_API_KEY
});


const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

// Performs label detection on the image file
client
 .labelDetection('./images/people.jpg')
 .then(results => {
   const labels = results[0].labelAnnotations;

   console.log('Labels:');
   labels.forEach(label => console.log(label.description));
 })
 .catch(err => {
   console.error('ERROR:', err);
 });
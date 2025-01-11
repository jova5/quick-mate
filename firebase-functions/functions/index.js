/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import admin from 'firebase-admin';

admin.initializeApp();

export const pushNotification = onDocumentCreated("posts/{docId}", (event) => {

  const snapshot = event.data; // Firestore document snapshot
  if (!snapshot) {
    console.warn("No document snapshot found in the event.");
    return;
  }

  const cityId = snapshot.get("cityId");
  const postTitle = snapshot.get("title");

  if (!cityId) {
    console.warn("cityId field not found in the document.");
    return;
  }

  if (!title) {
    console.warn("post title field not found in the document.");
    return;
  }

  const message = {
    topic: `${cityId}`,
    notification: {
      title: 'newPost',
      body: `{newPostAdded}: ${postTitle}`
    }
  };

  admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
})

const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');

// Write the service account JSON from an env var to a temporary file
const serviceAccountPath = './firebase-credentials.json';
fs.writeFileSync(serviceAccountPath, process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// Initialize Firebase Admin with the temp credentials file
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = 4000;

app.get('/:targetDeviceToken', async (req, res) => {
  const targetDeviceToken = req.params.targetDeviceToken;

  if (!targetDeviceToken) {
    return res.status(400).json({ error: 'Device token is missing in the URL.' });
  }

  const message = {
    notification: {
      title: 'New order',
      body: 'New order received, please check your dashboard!',
    },
    data: {
      source: 'Qellner',
      timestamp: new Date().toISOString(),
    },
    token: targetDeviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).json({ success: true, messageId: response, description: 'FCM message sent successfully.' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send FCM message.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

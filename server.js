const express = require('express');
const admin = require('firebase-admin');

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} catch (error) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_JSON:', error);
  process.exit(1);
}

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

  console.log(`Received request for device token: ${targetDeviceToken}`);

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
  console.log(`Access it at http://localhost:${PORT}/{yourDeviceToken}`);
});

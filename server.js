const express = require('express');
const admin = require('firebase-admin');

let serviceAccount;

try {
  const envVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  // Double parse: some systems wrap JSON strings in quotes
  const firstParse = JSON.parse(envVar); // this removes outer quotes and backslashes if present

  // If firstParse is already an object, keep it. Otherwise, parse again.
  serviceAccount = typeof firstParse === 'string' ? JSON.parse(firstParse) : firstParse;

  console.log("✅ Firebase service account parsed successfully.");
} catch (error) {
  console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT_JSON:', error.message);
  process.exit(1);
}

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
    res.status(200).json({
      success: true,
      messageId: response,
      description: 'FCM message sent successfully.',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send FCM message.',
      details: error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.send('Push notification server is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Express server listening on http://localhost:${PORT}`);
});

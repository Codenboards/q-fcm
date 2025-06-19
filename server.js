const express = require('express');
const admin = require('firebase-admin');

let serviceAccount;



const app = express();
const PORT = 4000;

app.get('/:targetDeviceToken', async (req, res) => {
  const targetDeviceToken = req.params.targetDeviceToken;

  if (!targetDeviceToken) {
    return res.status(400).json({ error: 'Device token is missing in the URL.' });
  }

  console.log(`Received request for device token: ${targetDeviceToken}`);

  console.log("RAW ENV VALUE:", process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

 
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
  console.log(`Access it at http://localhost:${PORT}/{yourDeviceToken}`);
});

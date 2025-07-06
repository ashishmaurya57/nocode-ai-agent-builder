import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/test-telegram', async (req, res) => {
  try {
    const botToken = '7153944140:AAG58rNMz3gyR5T9QTFEQtN5Yc8lyL1O_34';  // Replace with your actual bot token
    const chatId = '5083511455'; // Replace with your chat ID (user ID or @channelusername)
    const message = '✅ Telegram bot is working!';

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });

    res.json({ success: true, message: 'Message sent to Telegram!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

export default router;

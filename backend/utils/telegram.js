import fetch from 'node-fetch';

export const sendTelegramMessage = async (botToken, chatId, message) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown'
  };

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};

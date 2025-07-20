const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Show a thinking message for better UX
  const botMessageElement = appendMessage('bot', 'Gemini is thinking...');

  // Send user message to the backend
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then((res) => {
      if (!res.ok) {
        // Coba ambil pesan error dari backend jika ada
        return res.json().then(errData => {
            throw new Error(errData.reply || 'Network response was not ok');
        });
      }
      return res.json();
    })
    .then((data) => {
      botMessageElement.textContent = data.reply;
    })
    .catch((error) => {
      console.error('Error:', error);
      botMessageElement.textContent = error.message || 'Failed to get response from Gemini. Please try again later.';
    });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
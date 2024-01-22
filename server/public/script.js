// document.addEventListener('DOMContentLoaded', () => {
//     const socket = io();

//     function sendMessage() {
//         const messageInput = document.getElementById('message-input');
//         const message = messageInput.value.trim();

//         if (message !== '') {
//             socket.emit('chat message', { username: '<%= username %>', message });
//             messageInput.value = '';
//         }
//     }

//     socket.on('chat message', (data) => {
//         const chatContainer = document.getElementById('chat-container');
//         const messageElement = document.createElement('p');
//         messageElement.textContent = `${data.username}: ${data.message}`;
//         chatContainer.appendChild(messageElement);
//     });

//     // Retrieve chat history when connecting to the chatroom
//     socket.on('chat history', (history) => {
//         const chatContainer = document.getElementById('chat-container');
//         history.forEach((message) => {
//             const messageElement = document.createElement('p');
//             messageElement.textContent = `${message.sender_username}: ${message.content}`;
//             chatContainer.appendChild(messageElement);
//         });
//     });
// });

// Define the sendMessage function
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message !== '') {
        socket.emit('chat message', { username: 'username', message });
        messageInput.value = '';
    }
}

const socket = io();

socket.on('chat message', (data) => {
    const chatContainer = document.getElementById('chat-container');
    // const messageElement = document.createElement('p');
    // messageElement.innerHTML += `${data.username}:`;
    // messageElement.innerHTML += data.message;
    // chatContainer.appendChild(messageElement);
    chatContainer.innerHTML += '<p>' + data.message + '</p>';
});

socket.on('chat history', (history) => {
    const chatContainer = document.getElementById('chat-container');
    history.forEach((message) => {
        // const messageElement = document.createElement('p');
        // messageElement.textContent = `${message.sender_username}: ${message.content}`;
        // chatContainer.appendChild(messageElement);
        chatContainer.innerHTML += '<p>' + message.content + '</p>';

    });
});

const username = localStorage.getItem('name');
if(!username){
    window.location.replace('/');
    throw new Error('Username is required!');
}

// Referencias html
const lblStatusOnline = document.querySelector("#status-online");
const lblStatusOffline = document.querySelector("#status-offline");

const nameClient = document.querySelector(".name");
const usersUlElement = document.querySelector("ul");
const form = document.querySelector("form");
const input = document.querySelector("input");
const chatEmelent = document.querySelector("#chat");

const renderUsers = ( users ) => {
    usersUlElement.innerHTML = "";
    users.forEach(user => {
        const liElement = document.createElement('li');
        liElement.innerText = user.name;
        usersUlElement.appendChild(liElement);
    });
}

const renderMessage = ( payload ) => {
    const { userId, name, message } = payload;
    const divElement = document.createElement('div');
    divElement.classList.add('message');
    if( userId !== socket.id ){
        divElement.classList.add('incoming');
    }

    divElement.innerHTML = `
    <small>${name}</small>
    <p>${message}</p>
    `;
    chatEmelent.appendChild(divElement);

    // Scroll al final del mensage
    chatEmelent.scrollTop = chatEmelent.scrollHeight;
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = input.value;
    input.value = '';

    socket.emit('send-message', message);
})

const socket = io({
    auth: {
        token: 'ABC-123',
        name: username,
    }
});

socket.on('connect', (data)=>{
    console.log('Conectado')
    lblStatusOnline.classList.remove('hidden');
    lblStatusOffline.classList.add('hidden');
    nameClient.innerText = localStorage.getItem('name');
});

socket.on('disconnect', ()=>{
    // console.log('Desconectado')
    lblStatusOnline.classList.add('hidden')
    lblStatusOffline.classList.remove('hidden')
});

socket.on('welcome-message', (data)=>{
    // console.log({data});
});

socket.on('on-clients-changed', (data)=>{

    renderUsers(data)

});

socket.on('on-message', renderMessage);

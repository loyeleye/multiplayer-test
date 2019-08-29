const writeEvent = (text) => {
    // <ul> element
    const parent = document.querySelector('#events');

    // <li> element
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight - parent.clientHeight;
};

const updateScore = (id, text) => {
    const el = document.querySelector(`#${id}-score`);
    el.innerHTML = text;
};

const onFormSubmitted = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit('message', text);
};

const addButtonListeners = () => {
    ['rock', 'paper', 'scissors'].forEach((id) => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
           sock.emit('turn', id);
        });
    });
};

writeEvent('Welcome to RPS');

const sock = io();
sock.on('message', writeEvent);
sock.on('you', (msg) => updateScore('you', msg));
sock.on('opp', (msg) => updateScore('opp', msg));

document.querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitted);

addButtonListeners();
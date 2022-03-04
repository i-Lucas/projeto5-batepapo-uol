let ultimaMensagem;
let nomeDeUsuario;

function scrollarAteUltimaMensagem() {
    
    const ulMensagens = document.querySelector(".mensagens-container");
    const liUltimaMensagem = ulMensagens.lastElementChild;

    if (ultimaMensagem !== liUltimaMensagem) {
        liUltimaMensagem.scrollIntoView();
        ultimaMensagem = liUltimaMensagem;
    }
}

function Mensagem(dados) {

    let classeMensagem = '';
    let destinatario = '';

    if (dados.type === 'status') {
        classeMensagem = 'entrada-saida';
    }

    if (dados.type === 'private_message') {
        if (dados.to !== nomeDeUsuario &&
            dados.to !== "Todos" &&
            dados.from !== nomeDeUsuario) {
            return ""
        }

        classeMensagem = 'conversa-privada';
        destinatario = `<span> para </span>
        <strong>${dados.to}: </strong>`;
    }

    if (dados.type === 'message') {
        classeMensagem = 'conversa-publica';
        destinatario = `<span> para </span>
        <strong>${dados.to}: </strong>`;
    }

    return `
        <li class="${classeMensagem}" data-identifier="message">
            <span class="horario">(${dados.time})</span>
            <strong>${dados.from}</strong>
            ${destinatario}
            <span>${dados.text}</span>
        </li>`
}

function carregarMensagens() {

    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then((resposta, statusCode) => {

        const mensagens = resposta.data;
        const ulMensagens = document.querySelector(".mensagens-container");
        ulMensagens.innerHTML = '';

        for (let i = 0; i < mensagens.length; i++) {
            ulMensagens.innerHTML += Mensagem(mensagens[i]);
        }

        scrollarAteUltimaMensagem();
    });
}

function perguntarNome() {

    nomeDeUsuario = prompt("Qual seu lindo nome?");
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {
        name: nomeDeUsuario
    });

    promessa.then(() => {

        setInterval(() => {
            axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {
                name: nomeDeUsuario
            });
        }, 4800);
    });

    promessa.catch(() => {
        alert("Nome indisponivel");
        perguntarNome();
    });
}

function iniciarApp() {

    carregarMensagens();
    setInterval(carregarMensagens, 3000);
    const mensagens = [...document.querySelectorAll('[data-identifier="message"]')]
    mensagens.map(mensagem => console.log(mensagem));
    perguntarNome();

    const inputMensagem = document.querySelector('.input-mensagem');
    inputMensagem.onkeydown = (e) => {
        if (e.code === 'Enter') {
            enviarMensagem();
        }
    };
}

function enviarMensagem() {

    const inputMensagem = document.querySelector('.input-mensagem');
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
        from: nomeDeUsuario,
        to: "Todos",
        text: inputMensagem.value,
        type: "message"
    });

    inputMensagem.value = '';
    promessa.then(carregarMensagens);
    promessa.catch(() => {
        window.location.reload();
    });
}

function toggleMenu() {
    const menu = document.querySelector('.menu');
    const menuFundo = document.querySelector('.menu-fundo');
    menu.classList.toggle("escondido");
    menuFundo.classList.toggle("fundo-escondido");
}

iniciarApp();

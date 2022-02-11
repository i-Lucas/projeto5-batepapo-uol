// Entrar()



let UserName = {}

// GetUserName()

function GetUserName() {

    let user = document.querySelector('.user-name').value
    user = user.toString()
    UserName = {
        name: user
    }
    SendServerUserName(UserName)
}

function Entrar() {

    const homescreen = document.querySelector('.home-screen')
    homescreen.classList.add('hidden')

    const main = document.querySelector('main')
    main.classList.remove('hidden')

    const sidebar = document.querySelector('nav')
    sidebar.classList.add('hidden')
}

function RemoveSidebar() {

    const sidebar = document.querySelector('nav')
    const blackout = document.querySelector('.blackout')
    blackout.classList.add('removegradient')

    sidebar.classList.remove('anim-show')
    sidebar.classList.add('anim-hidden')

    setTimeout(() => {
        sidebar.classList.add('hidden')
        sidebar.classList.remove('anim-hidden')

        blackout.classList.remove('removegradient')
        blackout.classList.add('hidden')
    }, 2000);
}

function ShowSidebar() {

    const sidebar = document.querySelector('nav')
    const blackout = document.querySelector('.blackout')

    blackout.classList.remove('hidden')

    sidebar.classList.add('anim-show')
    sidebar.classList.remove('hidden')
}

let optionChecked = false
let thisOptionChecked = 'none'
let typeSelected = 'message'

let userChecked = false
let thisUserChecked = 'none'
let userSelected = 'Todos'

function SelectUser(user) {

    user = user.querySelector('.user-selected')

    if (userChecked === false) {
        user.classList.remove('hidden')
        thisUserChecked = user
        userChecked = true
    }

    if (userChecked === true) {
        thisUserChecked.classList.add('hidden')
        user.classList.remove('hidden')
        thisUserChecked = user
    }

    user = user.parentNode;
    user = user.querySelector('p')
    user = user.innerHTML

    userSelected = user
}

function SelectOption(option, type) {

    option = option.querySelector('.user-selected')

    if (optionChecked === false) {

        if (type === 'message') {
            option.classList.remove('hidden')
            thisOptionChecked = option
            optionChecked = true

            userSelected = 'Todos'
            typeSelected = 'message'
        }

        if (type === 'private_message') {
            option.classList.remove('hidden')
            thisOptionChecked = option
            optionChecked = true

            typeSelected = 'private_message'
        }
    }

    if (optionChecked === true) {

        thisOptionChecked.classList.add('hidden')
        option.classList.remove('hidden')
        thisOptionChecked = option

        typeSelected = type
    }

    console.log('tipo selecionado ' + typeSelected)
}

document.addEventListener('keypress', GetUserMessage)


function GetTime() {

    let data = new Date();
    let hr = data.getHours();
    let min = data.getMinutes();
    let seg = data.getSeconds();
    return `${hr}:${min}:${seg}`
}

function GetUserMessage(userkey) {

    if (userkey.key === 'Enter' || userkey === 'button') {

        let text = document.querySelector('#usertext').value
        document.querySelector('#submit').click();
        document.querySelector('#usertext').value = ''

        console.log(typeSelected, text, userSelected)
        SendMessage(UserName, typeSelected, text, userSelected, 0)

        const msgObj = {

            from: `${UserName}`,
            to: `${userSelected}`,
            text: `${text}`,
            type: `${typeSelected}`
        }


        axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', msgObj)


    }
}


function SendMessage(user, type, text, receive, time) {

    if (text.length === 0) return

    const page = document.querySelector('.page-content')

    if (type === 'private_message') {

        page.innerHTML += `

        <div class="message ${type}">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${user}</span>
            reservadamente para<span class = 'span-user'>${receive}</span>:
            <span class = 'span-message'>
            ${text}</p></span>
        </div>
    `
        return
    }

    if (type === 'message') {

        page.innerHTML += `

            <div class="message">
                <p><span class = 'span-time'>
                (${time})</span> 
                <span class = 'span-user'> ${user}</span> para<span class = 'span-user'>${receive}</span>:
                <span class = 'span-message'>
                ${text}</p></span>
            </div>
        `
        return
    }

    if (type === 'status') {


        page.innerHTML += `

        <div class="message status">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${user}</span>
            <span class = 'span-message'>
            entra na sala ...</p></span>
        </div>
    `
    }
}

function DeleteMessages() {

    const page = document.querySelector('.page-content')
    while(page.firstChild) {
        page.removeChild(page.firstChild)
    }
}

// UserConnected(GetTime(), 'Lucas')

// conectar com o servidor
// obter as mensagens 
// enviar as mensagens 

function SendServerUserName(userObj) {

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', userObj)
    promise.then(PromiseReceived); // deu tudo certo
    promise.catch(ErrorReceived) // deu erro
}

let interval_CheckOnlineUser = undefined
let interval_LoadMessages = undefined

function PromiseReceived(promise) {

    console.log(promise)
    interval_CheckOnlineUser = setInterval(CheckOnlineUser(UserName), 5000)
    interval_LoadMessages = setInterval(LoadMessagesPromise, 5000)
    Entrar()
    // LoadMessagesPromise()
}

function ErrorReceived(error) {

    console.log('error code: ' + error.response.status)
    console.log('error msg: ' + error.response.data)

    if (error.response.status === 400) {
        return alert('Já existe um usuário online com esse nickname. Por favor escolha outro')
    }
}

// load messages
function LoadMessagesPromise() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promise.then(LoadMessages)
    promise.catch(LoadMessagesError)
}

function LoadMessages(promise) {

    console.log(promise.data)
    let lista = promise.data

    DeleteMessages()

    for (let i = 0; i < lista.length; i++) {

        // console.log(lista[i].from, lista[i].type, lista[i].text, lista[i].to, lista[i].time)
        SendMessage(lista[i].from, lista[i].type, lista[i].text, lista[i].to, lista[i].time)
    }

}

function LoadMessagesError(error) {
    console.log('error code: ' + error.response.status)
    console.log('error msg: ' + error.response.data)
    return
}

// check if the user is online every 5 seconds
function CheckOnlineUser(userObj) {

    const promise = axios.post(' https://mock-api.driven.com.br/api/v4/uol/status', userObj)
    promise.then(CheckOnlineUserPromise)
    promise.catch(CheckOnlineUserError)
}

const CheckOnlineUserPromise = (promise) => console.log('user online')
const CheckOnlineUserError = (error) => console.log('user offline')

let UserName = ''
let UserOnline = false

let userSelected = 'Todos'
let typeSelected = 'message'

function GetUserName() {

    UserName = document.querySelector('.user-name').value
    if (UserName.length >= 5) {
        let promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', { name: UserName })
        promise.then(PromiseNameReceived)
        promise.catch(PromiseNameError)
    } else
        return alert('choose a name with at least 5 characters')
}

function PromiseNameError(error) {
    console.log(`error code: ${error.response.status} msg: ${error.response.data}`)
    if (error.response.status === 400) {
        return alert('There is already a user online with that username. Try again')
    }
}

let IntervalSendStatusOnline
let IntervalGetServerMessages

function PromiseNameReceived(response) {
    Login()
    IntervalSendStatusOnline = setInterval(SendStatusOnline, 5000)
    IntervalGetServerMessages = setInterval(GetServerMessagesPromise, 5000)
}

function SendStatusOnline() {
    let promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', { name: UserName })
    promise.then(ConfirmUserOnline)
    promise.catch(DisconnectedUser)
}

function ConfirmUserOnline(promise) {

    UserOnline = true
    GetUsersOnline()
}

function DisconnectedUser(error) {

    UserOnline = false
    console.log('unable to check your status at this time')
    console.log(`error code: ${error.response.status} msg: ${error.response.data}`)
    CheckDisconectedUser()
}

function GetServerMessagesPromise() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    promise.then(RenderMessages)
}

function RenderMessages(promise) {
    DeleteMessages()
    let list = promise.data
    for (let i = 0; i < list.length; i++) {
        BuildMessages(list[i].from, list[i].to, list[i].text, list[i].type, list[i].time)
    }
}

function DeleteMessages() {
    let page = document.querySelector('.page-content')
    if (page.firstChild !== null || page.firstChild !== undefined) {
        while (page.firstChild) {
            page.removeChild(page.firstChild)
        }
    }
}

function BuildMessages(from, to, text, type, time) {

    const container = document.querySelector('.page-content')

    if (type === 'status') {
        container.innerHTML += `
        <div class="message status">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${from}</span>
            <span class = 'span-message'>
            ${text} ...</p></span>
        </div>`
    }
    if (type === 'message') {
        container.innerHTML += `
        <div class="message">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${from}</span> para<span class = 'span-user'>${to}</span>:
            <span class = 'span-message'>
            ${text}</p></span>
        </div>`
    }
    if (type === 'private_message') {
        container.innerHTML += `
        <div class="message private">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${from}</span>
            reservadamente para<span class = 'span-user'>${to}</span>:
            <span class = 'span-message'>
            ${text}</p></span>
        </div>`
    }
}

function SendMessageUserToServer(to, text, type) {

    let msgdata = {
        from: UserName,
        to: to,
        text: text,
        type: type
    }

    let time = GetUserTime()
    BuildMessages(UserName, to, text, type, time)

    let userpost = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', msgdata)
    userpost.then(SendMessageUserToServerPromise)
    userpost.catch(SendMessageUserToServerError)
}

function SendMessageUserToServerPromise(promise) {
    // console.log('Message sent successfully')
}

function SendMessageUserToServerError(error) {
    alert('It was not possible to send your message')
    console.log(`error code: ${error.response.status} msg: ${error.response.data}`)
}

function CheckDisconectedUser() {
    if (!UserOnline) {
        Exit()
    }
}

// login
const homescreen = document.querySelector('.home-screen')
const main = document.querySelector('main')

// sidebar
const blackout = document.querySelector('.blackout')
const sidebar = document.querySelector('nav')

function Exit() {
    console.log('You have been disconnected')
    homescreen.classList.remove('hidden')
    main.classList.add('hidden')
    sidebar.classList.remove('hidden')

    clearInterval(IntervalSendStatusOnline)
    clearInterval(IntervalGetServerMessages)
}

function Login() {
    console.log('welcome to the jungle')
    homescreen.classList.add('hidden')
    main.classList.remove('hidden')
    sidebar.classList.add('hidden')
}

// sidebar 
function RemoveSidebar() {

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
    blackout.classList.remove('hidden')
    sidebar.classList.add('anim-show')
    sidebar.classList.remove('hidden')
}

// send messages using enter
document.addEventListener('keypress', GetUserMessage)

function GetUserMessage(userkey) {

    if (userkey.key === 'Enter' || userkey === 'button') {

        let text = document.querySelector('#usertext').value
        document.querySelector('#submit').click();
        document.querySelector('#usertext').value = ''
        SendMessageUserToServer(userSelected, text, typeSelected)
    }
}

function GetUserTime() {
    let data = new Date();
    let hr = data.getHours();
    let min = data.getMinutes();
    let seg = data.getSeconds();
    return `${hr}:${min}:${seg}`
}

// fill the sidebar with users who are online
function GetUsersOnline() {

    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    promise.then(GetUsersOnlinePromise)
    promise.catch(GetUsersOnlineError)
}

function GetUsersOnlinePromise(promise) {

    let UsersOnlineNames = []
    let list = promise.data

    for (let i = 0; i < list.length; i++) {
        UsersOnlineNames.push(list[i].name)
        FillSidebar(UsersOnlineNames)
    }
}

function GetUsersOnlineError(error) {
    console.log('could not get list of online users')
    console.log(`error code: ${error.response.status} msg: ${error.response.data}`)
}

function FillSidebar(users) {

    const sidebar = document.querySelector('nav .container')
    sidebar.innerHTML = ''
    for (let i = 0; i < users.length; i++) {
        sidebar.innerHTML += `
        <div class='display-flex box' onclick='SelectUser(this)'>
            <ion-icon name="person-circle"></ion-icon>
            <p class="spacing">${users[i]}</p>
            <ion-icon name="checkmark-outline" class='user-selected hidden'></ion-icon>
        </div>`
    }
}

let optionChecked = false
let thisOptionChecked = 'none'

let userChecked = false
let thisUserChecked = 'none'

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
            return
        }
        if (type === 'private_message') {
            option.classList.remove('hidden')
            thisOptionChecked = option
            optionChecked = true
            typeSelected = 'private_message'
            return
        }
    } else if (optionChecked === true) {

        thisOptionChecked.classList.add('hidden')
        option.classList.remove('hidden')
        thisOptionChecked = option

        if (type === 'message') {
            userSelected = 'Todos'
        }

        typeSelected = type
        return
    }
}

// resta fazer:

// refatorar as funções SelectUser e SelectOption
// ajustar Css do sidebar (nome dos usuarios)
// ajustar largura máxima das caixas de mensagem
// ajustar quebra de linha dos textos e espaçamento
// verificar pq o blackout (animação de background sidebar) não está funcionando
// Entrar()

function GetUserName() {

    const username = document.querySelector('.user-name').value
    console.log(username)

    if (username === 'Lucas') {
        Entrar()
    }
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
let typeSelected = 'public'

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

        if (type === 'public') {
            option.classList.remove('hidden')
            thisOptionChecked = option
            optionChecked = true

            userSelected = 'Todos'
            typeSelected = 'public'
        }

        if (type === 'private') {
            option.classList.remove('hidden')
            thisOptionChecked = option
            optionChecked = true

            typeSelected = 'private'
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

function GetUserMessage(userkey) {

    if (userkey.key === 'Enter' || userkey === 'button') {

        let text = document.querySelector('#usertext').value
        document.querySelector('#submit').click();
        document.querySelector('#usertext').value = ''

        console.log(typeSelected, text, userSelected)
        SendMessage('Lucas', typeSelected, text, userSelected, GetTime())
    }
}

function SendMessage(user, type, text, receive, time) {

    if(text.length > 50) {
        alert('texto muito grande')
        return
    }

    if (text.length === 0) return

    const page = document.querySelector('.page-content')
    const [hr, min, seg] = time

    if (type === 'private') {

        page.innerHTML += `

        <div class="message ${type}">
            <p><span class = 'span-time'>
            (${hr}:${min}:${seg})</span> 
            <span class = 'span-user'> ${user}</span>
            reservadamente para<span class = 'span-user'>${receive}</span>:
            <span class = 'span-message'>
            ${text}</p></span>
        </div>
    `
        return
    }

    if (type === 'public') {

        page.innerHTML += `

            <div class="message">
                <p><span class = 'span-time'>
                (${hr}:${min}:${seg})</span> 
                <span class = 'span-user'> ${user}</span> para<span class = 'span-user'>${receive}</span>:
                <span class = 'span-message'>
                ${text}</p></span>
            </div>
        `
        return
    }
}

function UserConnected(time, user) {

    const page = document.querySelector('.page-content')
    const [hr, min, seg] = time

    page.innerHTML += `

        <div class="message status">
            <p><span class = 'span-time'>
            (${hr}:${min}:${seg})</span> 
            <span class = 'span-user'> ${user}</span>
            <span class = 'span-message'>
            entra na sala ...</p></span>
        </div>
    `
}

// essa função vai obter o time da API
function GetTime() {

    let data = new Date();
    let hr = data.getHours();
    let min = data.getMinutes();
    let seg = data.getSeconds();
    return [hr, min, seg]
}

UserConnected(GetTime(), 'Lucas')
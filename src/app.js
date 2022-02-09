Entrar()

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


// desmarcar opções 
// selecionar somente um usuário

function SelectUser(user) {

    user = user.querySelector('.user-selected')
    user.classList.toggle('hidden')
    // console.log(user)
}

document.addEventListener('keypress', GetUserMessage)

function GetUserMessage(userkey) {

    if (userkey.key === 'Enter' || userkey === 'button') {

        let text = document.querySelector('#usertext').value
        // console.log(text)
        SendMessage(text)
        document.querySelector('#submit').click();
        document.querySelector('#usertext').value = ''
    }
}

function SendMessage(text) {

    if(text.length === 0) return
    alert(text)
}
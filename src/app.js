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

    sidebar.classList.remove('anim-show')
    sidebar.classList.add('anim-hidden')

    setTimeout(() => {
        sidebar.classList.add('hidden')
        sidebar.classList.remove('anim-hidden')
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
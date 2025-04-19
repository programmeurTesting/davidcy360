
(function () {
    'use strict'

    document.querySelector('#navbarSideCollapse').addEventListener('click', function () {
        document.querySelector('.offcanvas-collapse').classList.toggle('open')
    })
})()


//redirect to login page
async function openUserPage() {
    const res = await fetch('/user/profile', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        // body: JSON.stringify(userdata)
    })

    if (!res.ok) {
        return window.location = '/login';
    }

    window.location = '/en/account';
}



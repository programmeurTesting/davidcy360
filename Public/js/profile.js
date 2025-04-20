
async function loadUserDetails() {

    let userProfileNames = document.getElementById('userProfileNames');
    let userProfileEmail = document.getElementById('userProfileEmail');
    let userProfileAddressDiv = document.getElementById('userProfileAddressDiv');
    let userProfilePaymentMethodsDiv = document.getElementById('userProfilePaymentMethodsDiv');
    let welcomeUserProfile = document.getElementById('welcomeUserProfile');
    let userprofileOrdersDiv = document.getElementById('userprofileOrdersDiv');

    const res = await fetch('/user/profile/details', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
    }).then(response => response.json())
        .then(data => {
            // console.log(data.data)
            welcomeUserProfile.innerText = `${data.data.firstName}`;
            userProfileNames.innerHTML = `${data.data.firstName}  ${data.data.lastName}`;
            userProfileEmail.innerHTML = `${data.data.email}`;

            //edith profile details for session storage
            sessionStorage.setItem('firstName', data.data.firstName);
            sessionStorage.setItem('middleName', data.data.middleName);
            sessionStorage.setItem('lastName', data.data.lastName);
            sessionStorage.setItem('email', data.data.email)


            data.data.address.map((item, index) => {
                userProfileAddressDiv.innerHTML += `<div>${item}</div>`;
            })

            if (data.data.paymentMethods.length == 0) {
                userProfilePaymentMethodsDiv.innerHTML = `<div> No saved payment methods </div>`;
            } else {
                data.data.paymentMethods.map((item, index) => {
                    userProfilePaymentMethodsDiv.innerHTML += `<div> ${item.name} ${item.type} ${item.url}</div>`;
                })
            }

            if (data.data.orders.length == 0) {
                userprofileOrdersDiv.innerHTML = `Your first order will display here`;
            } else {
                userprofileOrdersDiv.innerHTML += ``;
            }

        })
        .catch(error => window.location = '/login')
}


async function edithUsername() {

    const res = await fetch('/edith/myProfile', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
    })

    if (!res.ok) {
        return window.location = '/login';
    }
    window.location = '/en/profile';
}

async function edithPassword() {

    const res = await fetch('/edith/myPassword', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
    })

    if (!res.ok) {
        return window.location = '/login';
    }
    window.location = '/en/Account-EditPassword';
}


async function addAddress() {

    const res = await fetch('/edith/myProfile', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
    })

    if (!res.ok) {
        return window.location = '/login';
    }
    window.location = '/en/Account-AddAddress';
}



window.onload = async () => {
    await loadUserDetails();
}
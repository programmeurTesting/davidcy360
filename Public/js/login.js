const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = (() => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (() => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});
signupLink.onclick = (() => {
    signupBtn.click();
    return false;
});



function containsNumber(str) {
    return str.match(/\d+/) !== null;
}




async function verifyConfirmationCode(e) {

    const userVerificationInput = document.getElementById('userVerificationInput').value;

    const res = await fetch('/verification', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({ userVerificationInput })
    })

    console.log(res);

    //modal
    let trigger_modal = document.getElementById('trigger-model');
    let modal_title_local = document.querySelector('.modal-title-local');
    let modal_body_local = document.getElementById('modal-body-local');

    if (!res.ok) {
        modal_title_local.innerText = `Miss Match`;
        modal_body_local.innerText = `Sorry, confirmation code does not match, please try again!`;
        return trigger_modal.click();
    }

    if (res.ok) {
        let loginWrapper = document.getElementById('loginWrapper');
        loginWrapper.innerHTML = `
        <div>
            <div class="mb-3">
                <div class='d-flex justify-content-center align-items-center flex-row'>
                    <img src="assets/icons/check-verified.png" width="50px" alt="">
                </div>
                <label for="confirmationInputCode" class="form-label fs-2 d-flex justify-content-center align-items-center flex-row"> Email Verified!</label>
                <label for="confirmationInputCode" class="form-label  text-small-local">
                    Congratulations! your email address has been verified. 
                </label>
            </div>
            <div class="d-grid gap-2 col-6 mx-auto mt-4">
            <a href='/login' class="btn btn-primary mt-3">Proceed to login</a>
           </div>
        </div>
        `
    }
}

//signup function
async function signup() {
    let signup_firstname = document.getElementById('signup-firstname').value;
    // let signup_middlename = document.getElementById('signup-middlename').value;
    let signup_lastname = document.getElementById('signup-lastname').value;
    let signup_email = document.getElementById('signup-email').value;
    let signup_password = document.getElementById('signup-password').value;
    let signup_password_confirm = document.getElementById('signup-password-confirm').value;

    //modal
    let trigger_modal = document.getElementById('trigger-model');
    let modal_title_local = document.querySelector('.modal-title-local');
    let modal_body_local = document.getElementById('modal-body-local');


    ///validate front end userinput (sign up)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(signup_email);
    if (signup_firstname == `` || signup_lastname == `` || signup_email == `` || signup_password == `` || signup_password_confirm == ``) {
        modal_title_local.innerText = `Input Error`;
        modal_body_local.innerText = `Sorry, All input field are required!`;
        return trigger_modal.click();
    }
    if (!isValid) {
        modal_title_local.innerText = `Invalid Email`;
        modal_body_local.innerText = `Sorry, This Email address does not exist! Try again.`;
        return trigger_modal.click();
    }

    if (signup_password.length < 8) {
        modal_title_local.innerText = `Weak Password`;
        modal_body_local.innerText = `Your password is to short!`;
        return trigger_modal.click();
    }

    if (!containsNumber(signup_password)) {
        modal_title_local.innerText = `Weak Password`;
        modal_body_local.innerText = `Your password must contain a number!`;
        return trigger_modal.click();
    }

    if (signup_password !== signup_password_confirm) {
        modal_title_local.innerText = `Miss Match`;
        modal_body_local.innerText = `Sorry, Password does not match! Try again.`;
        return trigger_modal.click();
    }


    //sign up form is okay, send daata to backend
    const userdata = {
        firstName: signup_firstname,
        // middleName: signup_middlename,
        lastName: signup_lastname,
        email: signup_email,
        password: signup_password
    }

    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(userdata)
    })


    //if ok 
    if (res.ok) {
        let loginWrapper = document.getElementById('loginWrapper');
        loginWrapper.innerHTML = `
        <div>
            <div class="mb-3">
                <label for="confirmationInputCode" class="form-label fs-2">Confirm Email Address</label>
                <label for="confirmationInputCode" class="form-label text-small-local">
                    A verification Code has been sent to ${signup_email}, Check your inbox or spam folder to confirm your
                    Email.
                </label>
                <input type="text" class="form-control  mt-4" placeholder="Confirmation Code" id="userVerificationInput"
                    aria-describedby="emailHelp">
            </div>
            <div class="d-grid gap-2 col-6 mx-auto mt-4">
            <button onclick="verifyConfirmationCode()"  class="btn btn-primary mt-3">Verify</button>
           </div>
        </div>`;
    }
}

//userLogin 
async function userLogin() {

    let login_email = document.getElementById('login_email').value;
    let login_password = document.getElementById('login_password').value;

    //llogin details
    const userdata = {
        email: login_email,
        password: login_password
    }


    const res = await fetch('/userLogin', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(userdata)
    })

    if (res.ok) {
        window.location = '/';
    } else {
        //modal
        let trigger_modal = document.getElementById('trigger-model');
        let modal_title_local = document.querySelector('.modal-title-local');
        let modal_body_local = document.getElementById('modal-body-local');


        modal_title_local.innerText = `Wrong Login Details`;
        modal_body_local.innerText = `Sorry, your Email and password does not match!`;
        return trigger_modal.click();
    }

}
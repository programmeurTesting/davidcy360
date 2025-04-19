window.onload = () => {
    let floatingFirstName = document.getElementById('floatingFirstName');
    let floatingMiddleName = document.getElementById('floatingMiddleName');
    let floatingLastName = document.getElementById('floatingLastName');
    let floatingEmail = document.getElementById('floatingEmail');

    let firstName = sessionStorage.getItem('firstName');
    let middleName = sessionStorage.getItem('middleName');
    let lastName = sessionStorage.getItem('lastName');
    let email = sessionStorage.getItem('email');

    floatingFirstName.value = firstName;
    // floatingMiddleName.value = middleName;
    floatingLastName.value = lastName;
    floatingEmail.value = email;
}
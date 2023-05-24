const loginForm = document.querySelector('.loginForm');
const statusText = document.querySelector('.statusText');

const login = async user => {
    const res = await fetch('/user-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user
        })
    });
    
    const result = await(res.json());
    
    console.log(result);
    
    // feedback til bruker
    statusText.innerText = result.status;
    
    // fjern gamle classes fra bruker feedback
    const classCodes = ['userErr', 'serverErr', 'ok'];
    
    classCodes.forEach(classCode => {
        statusText.classList.remove(classCode);
    });

    // legg til ny status class
    if (result.code === 'userErr') {
        statusText.classList.add('userErr');
    } else if (result.code === 'serverErr') {
        statusText.classList.add('serverErr');
    } else {
        statusText.classList.add('ok');
        window.location = '/home';
    };
};

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const user = {
        email: loginForm.email.value,
        password: loginForm.password.value
    };

    login(user);
});
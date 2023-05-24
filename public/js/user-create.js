const createUserForm = document.querySelector('.createUserForm');
const statusText = document.querySelector('.statusText');

const createUser = async user => {
    const res = await fetch('/user-create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user
        })
    });
    
    const result = await(res.json());
    
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

    statusText.classList.remove('hidden');
};

createUserForm.addEventListener('submit', e => {
    e.preventDefault();

    const user = {
        email: createUserForm.email.value,
        username: createUserForm.username.value,
        password: createUserForm.password.value
    };

    createUser(user);
});
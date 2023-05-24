const form = document.querySelector('.createGrid');
const createFeedback = document.querySelector('.createFeedback');
const updateFeedback = document.querySelector('.updateFeedback');
const createDropZone = document.querySelector('#image');
const updateDropzone = document.querySelector('#imageUD');
const dropZones = [createDropZone, updateDropzone];
const hideMe = document.querySelector('.hideMe');
const chinpokomonDisplay = document.querySelector('.chinpokomonDisplay');
const actionsPopup = document.querySelector('.updateDelGrid');
const body = document.querySelector('body');
const updateButton = actionsPopup.querySelector('#updateButton');
const deleteButton = actionsPopup.querySelector('#deleteButton');

// maks filstørrelse (1048576 = 1mb)
const fileSizeLimit = 5 * 1048576;

// bilde brukeren kan laste opp, id brukes til oppdatering & sletting av chinpokomon
let img;
let id;

// finn brukernavn
const urlLocation = window.location.toString();
const username = urlLocation.slice(urlLocation.indexOf('/home/') + 6, urlLocation.length);

dropZones.forEach(dropZone => {
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
    });
});

const showFeedback = (status, code, element) => {
    // user feedback ------------------

    // fjern gamle status classes fra feedback
    const statusClasses = ['userErr', 'serverErr', 'ok'];
    statusClasses.forEach(statusClass => {
        element.classList.remove(statusClass);
    });

    // vis status tekst
    element.innerText = status;

    // legg til statuskode class & vis feedback
    element.classList.add(code);
    element.classList.remove('hidden');

    // hvis ok, refresh siden
    if (code === 'ok') {
        // reset form verdier
        form.name.value = null;
        form.ability1.value = null;
        form.ability2.value = null;
        form.ability3.value = null;
        window.location.reload();
    };
}

// hvis brukeren slipper et bilde over dropsonen
createDropZone.addEventListener('drop', e => {
    e.preventDefault();

    // fjern forrige bilde når nytt bilde lastes opp
    img = null;

    // hent ut filen
    let file = e.dataTransfer.files[0];

    // sjekk om filen er under maksimal grensen
    if (file.size > fileSizeLimit) {
        // feedback til bruker
        showFeedback('Maksimal filstørrelse er 5mb', 'userErr', createFeedback);
        createDropZone.style.backgroundImage = '';

        // slett filen brukeren lastet opp fra variabelen
        file = null;
    } else {
        // les av filen
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener('loadend', () => {
            // når filen er ferdig å lese, lagre den i variabelen som blir lastet opp når formen blir submittet
            img = reader.result;
            hideMe.classList.add('hidden');

            // sett bakgrunnsbildet til dropsonen så brukeren kan se bildet de lastet opp
            createDropZone.style.backgroundImage = `url('${img}')`;
        });
    };
});

// dropzone for update
updateDropzone.addEventListener('drop', e => {
    e.preventDefault();

    // fjern forrige bilde når nytt bilde lastes opp
    img = null;

    // hent ut filen
    let file = e.dataTransfer.files[0];

    // sjekk om filen er under maksimal grensen
    if (file.size > fileSizeLimit) {
        // feedback til bruker
        showFeedback('Maksimal filstørrelse er 5mb', 'userErr', updateFeedback);
        updateDropzone.style.backgroundImage = '';

        // slett filen brukeren lastet opp fra variabelen
        file = null;
    } else {
        // les av filen
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener('loadend', () => {
            // når filen er ferdig å lese, lagre den i variabelen som blir lastet opp når formen blir submittet
            img = reader.result;
            hideMe.classList.add('hidden');

            // sett bakgrunnsbildet til dropsonen så brukeren kan se bildet de lastet opp
            updateDropzone.style.backgroundImage = `url('${img}')`;
        });
    };
});

// send chinpokomon til backend
const uploadChinpokomon = async chinpokomon => {
    const res = await fetch('/chinpokomon-create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chinpokomon
        })
    });
    
    const result = await(res.json());

    showFeedback(result.status, result.code, createFeedback);
};

form.addEventListener('submit', e => {
    e.preventDefault();

    const chinpokomon = {
        name: form.name.value,
        ability1: form.ability1.value,
        ability2: form.ability2.value,
        ability3: form.ability3.value,
        picture: img,
        authorName: username,
        createdAt: Date.now()
    };

    uploadChinpokomon(chinpokomon);
});

getChinpokomons(username, 0);

const readOneChinpokomon = async id => {
    const res = await fetch('/chinpokomon-readone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id
        })
    });
    
    const result = await(res.json());
    
    console.log(result);

    if (result.code === 'serverErr') {
        alert('Det skjedde en feil. Prøv igjen senere.');
    } else {
        // sett form input-verdier
        actionsPopup.nameUD.value = result.chinpokomon.name;
        actionsPopup.ability1UD.value = result.chinpokomon.ability1;
        actionsPopup.ability2UD.value = result.chinpokomon.ability2;
        actionsPopup.ability3UD.value = result.chinpokomon.ability3;
        img = result.chinpokomon.picture;
        id = result.chinpokomon._id;
        
        const imageField = actionsPopup.querySelector('#imageUD');

        imageField.style.backgroundImage = `url('${img}')`;

        actionsPopup.classList.remove('hiddenI');
        body.style.overflowY = 'hidden';
    };
};

chinpokomonDisplay.addEventListener('click', e => {
    if (e.target.classList[0] === 'openPopup') {
        id = e.target.id;
        console.log(id);
        
        readOneChinpokomon(id);
    };
});

// lukk popup når du trykker utenfor
actionsPopup.addEventListener('click', e => {
    if (e.target.classList[0] === 'updateDelGrid') {
        actionsPopup.classList.add('hiddenI');
        body.style.overflowY = 'scroll';
    };
});

// oppdater chinpokomon
const updateChinpokomon = async (id, chinpokomon) => {
    const res = await fetch('/chinpokomon-updateone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            chinpokomon
        })
    });
    
    const result = await(res.json());
    
    console.log(result);

    showFeedback(result.status, result.code, updateFeedback);
};

// slett chinpokomon
const deleteChinpokomon = async id => {
    const res = await fetch('/chinpokomon-deleteone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id
        })
    });
    
    const result = await(res.json());
    
    console.log(result);
    showFeedback(result.status, result.code, updateFeedback);
};

// oppdater & delete knapper
actionsPopup.addEventListener('submit', e => {
    e.preventDefault();
});

updateButton.addEventListener('click', e => {
    e.preventDefault();

    const chinpokomon = {
        name: actionsPopup.nameUD.value,
        ability1: actionsPopup.ability1UD.value,
        ability2: actionsPopup.ability2UD.value,
        ability3: actionsPopup.ability3UD.value,
        picture: img,
        authorName: username
    };

    updateChinpokomon(id, chinpokomon);
});

deleteButton.addEventListener('click', e => {
    e.preventDefault();

    deleteChinpokomon(id);
});
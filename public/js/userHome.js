const form = document.querySelector('.createGrid');
const createFeedback = document.querySelector('.createFeedback');
const updateFeedback = document.querySelector('.updateFeedback');
// const createDropZone = document.querySelector('#image');
// const updateDropzone = document.querySelector('#imageUD');
// const dropZones = [createDropZone, updateDropzone];
const hideMe = document.querySelector('.hideMe');
const wishlistDisplay = document.querySelector('.wishlistDisplay');
// const actionsPopup = document.querySelector('.updateDelGrid');
const body = document.querySelector('body');
// const updateButton = actionsPopup.querySelector('#updateButton');
// const deleteButton = actionsPopup.querySelector('#deleteButton');

// maks filstørrelse (1048576 = 1mb)
const fileSizeLimit = 5 * 1048576;

// bilde brukeren kan laste opp, id brukes til oppdatering & sletting av wishlist
let img;
let id;

// finn brukernavn
const urlLocation = window.location.toString();
const username = urlLocation.slice(urlLocation.indexOf('/home/') + 6, urlLocation.length);

// send wishlist til backend
const uploadWishlist = async wishlist => {
    const res = await fetch('/wishlist-create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wishlist
        })
    });
    
    const result = await(res.json());
};

form.addEventListener('submit', e => {
    e.preventDefault();
    // console.log(form.wishItem.value);

    const newitem = form.wishItem.value

    updateWishlist(username, newitem);
    displayDiv.innerHTML = ""
});


getWishlists(username, 0);


// oppdater wishlist
const updateWishlist = async (username, newItem) => {
    const res = await fetch('/wishlist-updateone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            newItem
        })
    });
    
    const result = await(res.json());
    
    // console.log(result);

    getWishlists(username, 0);
};


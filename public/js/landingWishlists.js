const allWishDiv = document.querySelector('.wishList');

const getLandingWishlists = async () => {

    const res = await fetch('/wishlist-readAll', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });


    const result = await(res.json());

    const wishlists = result.wishlists

    // console.log(wishlists);

    wishlists.forEach(e => {

        if (e.items[0] != undefined) {
        let template = `
        <h>${e.items[0]} - <a href="/user/${e.createdBy}">${e.createdBy}</a></h>
        `

        allWishDiv.innerHTML += template
        // console.log(e.items[0]);
        
    }

    })

};
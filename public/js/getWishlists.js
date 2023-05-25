const displayDiv = document.querySelector('.wishList');

const getWishlists = async (username, limit) => {

    console.log(username);


    const res = await fetch('/wishlist-read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            limit
        })
    });


    const result = await(res.json());

    const wishlists = JSON.parse(result.wishlists);

    const userWishlist = wishlists[0]

    console.log(wishlists);
    console.log(userWishlist);

    userWishlist.items.forEach(item => {
        const template = `
        <li>${item}</li>
        `;

        displayDiv.innerHTML += template;
    });
};
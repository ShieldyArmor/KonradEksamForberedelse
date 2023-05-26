const displayDiv = document.querySelector('.wishList');

const getWishlists = async (username, limit) => {

    // console.log(username);


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

    // console.log(wishlists);
    // console.log(userWishlist);

    let i = 0;

    userWishlist.items.forEach(item => {
        const template = `
        <li DBIndex="${i}">

        <p class="DBIndex">${i+1}.<br></p>
        
        <div class="IloveCSS">
        <p>${item}</p>

        <div class="moveDiv">
        <button class="DBUp">▲</button>
        <button class="DBDown">▼</button>
        </div>

        </div>

        </li>
        `;

        displayDiv.innerHTML += template;
        i++
    });

    let DBUps = Array.from(document.querySelectorAll(".DBUp"))
    let DBDowns = Array.from(document.querySelectorAll(".DBDown"))

    // console.log(DBUps);
    // console.log(DBDowns);

    DBUps.forEach(btn => {
        btn.addEventListener('click', e => {
            let liIndex = btn.parentElement.parentElement.parentElement.getAttribute("dbindex")
            // console.log(liIndex)
            // console.log(btn.parentElement.parentElement.children[0].textContent);
            // console.log("up!");
            moveItem("-1", liIndex)

        })
    })

    DBDowns.forEach(btn => {
        btn.addEventListener('click', e => {
            let liIndex = btn.parentElement.parentElement.parentElement.getAttribute("dbindex")
            // console.log(liIndex)
            // console.log("down!");
            moveItem("1", liIndex)
        })
    })

};

const moveItem = async (direction, index) => {
    console.log(`Move item with index ${index} in direction of: ${direction}`);

    const res = await fetch('/wishlist-move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            direction,
            index,
            username
        })
    });


    const result = await(res.json());

    console.log(result);

    if (result.code == "ok") {
        console.log("it works!!");
        displayDiv.innerHTML = ""
        getWishlists(username, 0);
    } else if (result.code == "serverErr") {
        console.log("something wrong happened.");
    }


}

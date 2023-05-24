const displayDiv = document.querySelector('.chinpokomonDisplay');

const getChinpokomons = async (username, limit) => {
    const res = await fetch('/chinpokomon-read', {
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

    const parsed = JSON.parse(result.chinpokomons);

    parsed.forEach(chinpokomon => {
        const template = `
        <div class="chinpokomonCard">
            <div class="nameGrid"><h3 class="openPopup" id="${chinpokomon._id}">${chinpokomon.name}</h3></div>
            <div class="imgGrid"><div style="background-image: url(${chinpokomon.picture});"></div></div>
            <div class="abilityGrid">
                <h2>Abilities:</h2>
                <ul>
                    <li>1 - ${chinpokomon.ability1}</li>
                    <li>2 - ${chinpokomon.ability2}</li>
                    <li>3 - ${chinpokomon.ability3}</li>
                </ul>
            </div>
            <a href="/user/${chinpokomon.authorName}" class="authorName">${chinpokomon.authorName}</a>
        </div>
        `;

        displayDiv.innerHTML += template;
    });
};
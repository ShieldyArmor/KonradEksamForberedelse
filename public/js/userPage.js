// spesifiser url, finn brukernavn
{
    const url = '/user/';
    const location = window.location.toString();
    const username = location.slice(location.indexOf(url) + url.length, location.length);

    // hent alle brukerens wishlists
    getWishlists(username, 0);
}
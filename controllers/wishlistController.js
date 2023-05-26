// imports
const Wishlist = require('../models/wishlist');

// controller
module.exports.wishlist_create = async (req, res) => {
    const wishlist = req.body.wishlist;

    const document = new Wishlist(wishlist);

    // sjekk om alle felter eksisterer
    if (document.name.length < 3) {
        res.status(400).send({
            status: 'Navnet til Wishlisten må være minst 3 tegn',
            code: 'userErr'
        });
    } else if (document.ability1.length < 2 || document.ability2.length < 2 || document.ability3.length < 2) {
        res.status(400).send({
            status: 'Wishlisten må ha 3 egenskaper',
            code: 'userErr'
        });
    } else if (!document.picture.includes('data:image/')) {
        res.status(400).send({
            status: 'Du må laste opp et bilde til Wishlisten!',
            code: 'userErr'
        });
    } else {
        // sjekk om feltene er for lange
        if (document.name.length > 15) {
            res.status(400).send({
                status: 'Navnet kan ikke være lenger enn 15 tegn',
                code: 'userErr'
            });
        } else if (document.ability1.length > 15 || document.ability2.length > 15 || document.ability3.length > 15) {
            res.status(400).send({
                status: 'Egenskapene kan ikke være lenger enn 15 tegn',
                code: 'userErr'
            });
        } else {
            try {
                document.save();
                res.status(200).send({
                    status: 'Wishlisten ble lagret',
                    code: 'ok'
                });
            } catch(err) {
                console.error(err);
                res.status(400).send({
                    status: 'Det skjedde en feil når Wishlisten skulle lagres. Prøv igjen senere',
                    code: 'serverErr'
                });
            };
        };
    };
};

module.exports.wishlist_read = async (req, res) => {
    let info = req.body;

    let wishlists

    if (info.limit === 0) {
        wishlists = await Wishlist.aggregate([
            {
                '$sort': {
                    'createdAt': -1
                }
            }, {
                '$match': {
                    'createdBy': info.username
                }
            }
        ]);
    } else {
        wishlists = await Wishlist.aggregate([
            {
                '$sort': {
                    'createdAt': -1
                }
            }, {
                '$limit': 10
            }
        ]);
    };

    res.status(200).send({
        wishlists: JSON.stringify(wishlists)
    });
};

module.exports.wishlist_readAll = async (req, res) => {
    console.log("trying to read wishlist");

    const wishlists = await Wishlist.aggregate([
        {
            '$sort': {
                'createdAt': -1
            }
        }
    ]);

    // console.log(wishlists);

    if (wishlists) {
        res.status(200).send({
            wishlists,
            code: 'ok'
        });
    } else {
        res.status(400).send({
            status: 'Kunne ikke finne wishlisten',
            code: 'serverErr'
        });
    };
};

module.exports.wishlist_updateOne = async (req, res) => {
    const { username, newItem } = req.body;

    // console.log(req.body);
    // console.log(username);
    // console.log(newItem);

    try {
        const dbWishlist = await Wishlist.findOne({ createdBy: username });
        console.log(dbWishlist);
        console.log(dbWishlist.items);


        const newItemList = dbWishlist.items
        
        newItemList.push(newItem)
        
        console.log(newItemList);

        await dbWishlist.updateOne({ items: newItemList });
        res.status(200).send({
            status: 'Wishlisten er oppdatert!',
            code: 'ok'
        });
    } catch(err) {
        console.error(err);
        res.status(400).send({
            status: 'Wishlisten kunne desverre ikke oppdateres akkruat nå. Prøv igjen senere.',
            code: 'serverErr'
        });
    };
};

module.exports.wishlist_deleteOne = async (req, res) => {
    const id = req.body.id;

    try {
        await Wishlist.findOneAndDelete({ _id: id});
        res.status(200).send({
            status: 'Wishlisten er slettet!',
            code: 'ok'
        });
    } catch(err) {
        console.error(err);
        res.status(400).send({
            status: 'Wishlisten kunne desverre ikke slettes akkruat nå. Prøv igjen senere.',
            code: 'serverErr'
        });
    };
};
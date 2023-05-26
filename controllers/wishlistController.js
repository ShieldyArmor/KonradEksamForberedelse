// imports
const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.json');

// controller
module.exports.wishlist_create = async (req, res) => {
    const wishlist = req.body.wishlist;

    const document = new Wishlist(wishlist);


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
    const token = req.cookies.jwt;
    console.log(token);

    // console.log(req.body);
    // console.log(username);
    // console.log(newItem);

    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                // ugyldig token
                console.error(err);
                res.cookie('jwt', '', { maxAge: 1 });
                res.redirect('/sign-in');
            } else {
                // bruker er logget inn
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
        });
    } else {
        // bruker er ikke logget inn, redirect til logg inn side
        res.redirect('/sign-in');
    };

};

module.exports.wishlist_move = async (req, res) => {
    const { direction, index, username } = req.body;
    const token = req.cookies.jwt;
    console.log(token);

    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                // ugyldig token
                console.error(err);
                res.cookie('jwt', '', { maxAge: 1 });
                res.locals.loggedIn = false;
                res.redirect("/sign-in");
            } else {
                // logget inn
                const user = await User.findOne({ _id: decodedToken.id });

                if (user) {

                    function moveItem(array, from, to) {
                        // remove `from` item and store it
                        var f = array.splice(from, 1)[0];
                        // insert stored item into position `to`
                        array.splice(to, 0, f);
                      }
                
                    console.log(direction);
                    console.log(index);
                    console.log(username);
                
                    let newIndex = Number(index)+Number(direction);
                
                    if (newIndex < 0) {
                        res.status(400).send({
                            status: 'Cannot move first array item further up.',
                            code: 'serverErr'
                        });
                    }
                
                    else {
                
                    console.log(`new Index: ${newIndex}`);
                
                    try { 
                        const dbWishlist = await Wishlist.findOne({ createdBy: username });
                        const dbItems = dbWishlist.items
                
                        if (dbItems.length <= newIndex) {
                            res.status(400).send({
                                status: 'Cannot move last array item further down.',
                                code: 'serverErr'
                            });
                        }
                        else {
                        moveItem(dbItems, index, newIndex)
                
                        console.log(dbItems);
                
                        await dbWishlist.updateOne({ items: dbItems });
                
                        res.status(200).send({
                            status: 'Wishlisten er oppdatert!',
                            code: 'ok'
                        });
                        }
                    } catch(err) {
                        console.error(err);
                        res.status(400).send({
                            status: 'Error.',
                            code: 'serverErr'
                        });
                    };
                
                }                
                } else {
                    // brukeren eksisterer ikke
                    res.cookie('jwt', '', { maxAge: 1 });
                    res.locals.loggedIn = false;
                    res.redirect("/sign-in")
                };
            };
        });
    } else {
        // brukeren er ikke logget inn
        res.locals.loggedIn = false;
        res.redirect("/sign-in")
    };

};
// imports
const Chinpokomon = require('../models/chinpokomon');

// controller
module.exports.chinpokomon_create = async (req, res) => {
    const chinpokomon = req.body.chinpokomon;

    const document = new Chinpokomon(chinpokomon);

    // sjekk om alle felter eksisterer
    if (document.name.length < 3) {
        res.status(400).send({
            status: 'Navnet til Chinpokomonen må være minst 3 tegn',
            code: 'userErr'
        });
    } else if (document.ability1.length < 2 || document.ability2.length < 2 || document.ability3.length < 2) {
        res.status(400).send({
            status: 'Chinpokomonen må ha 3 egenskaper',
            code: 'userErr'
        });
    } else if (!document.picture.includes('data:image/')) {
        res.status(400).send({
            status: 'Du må laste opp et bilde til Chinpokomonen!',
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
                    status: 'Chinpokomonen ble lagret',
                    code: 'ok'
                });
            } catch(err) {
                console.error(err);
                res.status(400).send({
                    status: 'Det skjedde en feil når Chinpokomonen skulle lagres. Prøv igjen senere',
                    code: 'serverErr'
                });
            };
        };
    };
};

module.exports.chinpokomon_read = async (req, res) => {
    let info = req.body;

    let chinpokomons

    if (info.limit === 0) {
        chinpokomons = await Chinpokomon.aggregate([
            {
                '$sort': {
                    'createdAt': -1
                }
            }, {
                '$match': {
                    'authorName': info.username
                }
            }
        ]);
    } else {
        chinpokomons = await Chinpokomon.aggregate([
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
        chinpokomons: JSON.stringify(chinpokomons)
    });
};

module.exports.chinpokomon_readOne = async (req, res) => {
    const id = req.body.id;

    const chinpokomon = await Chinpokomon.findOne({ _id: id });

    if (chinpokomon) {
        res.status(200).send({
            chinpokomon,
            code: 'ok'
        });
    } else {
        res.status(400).send({
            status: 'Kunne ikke finne chinpokomonen',
            code: 'serverErr'
        });
    };
};

module.exports.chinpokomon_updateOne = async (req, res) => {
    const { id, chinpokomon } = req.body;

    console.log(id);

    try {
        const dbChinpokomon = await Chinpokomon.findOne({ _id: id });
        await dbChinpokomon.updateOne(chinpokomon);
        res.status(200).send({
            status: 'Chinpokomonen er oppdatert!',
            code: 'ok'
        });
    } catch(err) {
        console.error(err);
        res.status(400).send({
            status: 'Chinpokomonen kunne desverre ikke oppdateres akkruat nå. Prøv igjen senere.',
            code: 'serverErr'
        });
    };
};

module.exports.chinpokomon_deleteOne = async (req, res) => {
    const id = req.body.id;

    try {
        await Chinpokomon.findOneAndDelete({ _id: id});
        res.status(200).send({
            status: 'Chinpokomonen er slettet!',
            code: 'ok'
        });
    } catch(err) {
        console.error(err);
        res.status(400).send({
            status: 'Chinpokomonen kunne desverre ikke slettes akkruat nå. Prøv igjen senere.',
            code: 'serverErr'
        });
    };
};
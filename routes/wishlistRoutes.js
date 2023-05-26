// imports
const { Router } = require('express');
const wishlistController = require('../controllers/wishlistController');

const router = Router();

// routes
router.post('/wishlist-create', wishlistController.wishlist_create);
router.post('/wishlist-read', wishlistController.wishlist_read);
router.post('/wishlist-move', wishlistController.wishlist_move);
router.get('/wishlist-readAll', wishlistController.wishlist_readAll);
router.post('/wishlist-updateone', wishlistController.wishlist_updateOne);

module.exports = router;
// imports
const { Router } = require('express');
const chinpokomonController = require('../controllers/chinpokomonController');

const router = Router();

// routes
router.post('/chinpokomon-create', chinpokomonController.chinpokomon_create);
router.post('/chinpokomon-read', chinpokomonController.chinpokomon_read);
router.post('/chinpokomon-readone', chinpokomonController.chinpokomon_readOne);
router.post('/chinpokomon-updateone', chinpokomonController.chinpokomon_updateOne);
router.post('/chinpokomon-deleteone', chinpokomonController.chinpokomon_deleteOne);

module.exports = router;
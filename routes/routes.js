const express = require('express');
const index_controller = require('../controllers/index_controller');

const router = express.Router()

router.get("/", index_controller.viewIndex)

router.get("/index", index_controller.viewIndex)

module.exports = router
const express = require('express');
const main_controller = require('../controllers/main_controller');

const router = express.Router()

router.get("/", main_controller.viewIndex)

module.exports = router
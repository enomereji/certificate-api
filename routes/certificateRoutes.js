const express = require("express");
const { createStudent, generateAndSendCertificate } = require("../controllers/certificateController");

const router = express.Router();

// Endpoint to create student
router.post("/students", createStudent);

// Endpoint to generate and send certificate
router.post("/generate-certificate", generateAndSendCertificate);

module.exports = router;

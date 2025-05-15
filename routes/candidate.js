const express = require("express");
const router = express.Router();
const candidateController = require("../controller/candidateController");
const upload = require("../utils/upload");
const { authenticateToken } = require("../middlreware/auth");

/**
 * @swagger
 * /candidates/create:
 *   post:
 *     summary: Create a new candidate
 *     description: Creates a new candidate and uploads resume file.
 *     tags:
 *       - Candidates
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/create", authenticateToken, upload.single("resume"), candidateController.create);

module.exports = router;

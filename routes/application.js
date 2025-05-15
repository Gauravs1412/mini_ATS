const express = require("express");
const router = express.Router();
const applicationController = require("../controller/applicationController");
const upload = require("../utils/upload");
const { authenticateToken } = require("../middlreware/auth");

/**
 * @swagger
 * /applications/create:
 *   post:
 *     summary: Submit a new application
 *     description: Creates a new job application.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidateId:
 *                 type: integer
 *               jobId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Applied, Shortlisted, Interviewing, Offer, Hired, Rejected]
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/create", authenticateToken, applicationController.submitApplication);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Update application status
 *     description: Updates the status of a specific application.
 *     tags:
 *       - Applications
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the application to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Applied, Shortlisted, Interviewing, Offer, Hired, Rejected]
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", applicationController.updateApplicationStatus);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: List all applications
 *     description: Retrieves a list of job applications, optionally paginated or filtered.
 *     tags:
 *       - Applications
 *     responses:
 *       200:
 *         description: List of applications
 *       500:
 *         description: Server error
 */
router.get("/", applicationController.listApplications);

module.exports = router;

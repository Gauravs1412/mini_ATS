const prisma = require("../src/prismaClient");

const submitApplication = async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;

    // Optional: Check for existing application to avoid duplicates
    const existing = await prisma.application.findFirst({
      where: {
        candidateId: parseInt(candidateId),
        jobId: parseInt(jobId),
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Candidate already applied for this job." });
    }

    const application = await prisma.application.create({
      data: {
        candidateId: parseInt(candidateId),
        jobId: parseInt(jobId),
        status: "Applied",
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Failed to submit application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
};

const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    console.log("id", id)
    const { status } = req.body;
  
    const allowedStatuses = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];
  
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
  
    try {
      const updated = await prisma.application.update({
        where: { id: Number(id) },
        data: { status },
      });
  
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update application status" });
    }
};

const listApplications = async (req, res) => {
    const { job_id, status, startDate, endDate } = req.query;
  
    const filters = {};
  
    if (job_id) filters.jobId = Number(job_id); // Fix: jobId not job_id
    if (status) filters.status = status;
  
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res.status(400).json({
        error: "Both startDate and endDate must be provided together",
      });
    }
  
    if (startDate && endDate) {
      filters.appliedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
  
    try {
      const applications = await prisma.application.findMany({
        where: filters,
        orderBy: {
          appliedAt: "desc", // Fix: camelCase appliedAt not applied_at
        },
      });
  
      res.status(200).json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  };
  

module.exports = {
    submitApplication,
    updateApplicationStatus,
    listApplications
}



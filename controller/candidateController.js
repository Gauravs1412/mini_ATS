const prisma = require("../src/prismaClient"); // adjust the path if needed

const create = async (req, res) => {
  let { name, email, phone, resumeUrl } = req.body;
  if (req.file) {
    resumeUrl = `/uploads/${req.file.filename}`;
  }
  try {
    const newCandidate = await prisma.candidate.create({
      data: {
        fullName : name,
        email,
        phone,
        resumeUrl
      },
    });

    res.status(201).json(newCandidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create candidate" });
  }
};

module.exports = {
    create
}

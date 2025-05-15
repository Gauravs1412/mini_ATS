const prisma = require("../src/prismaClient");
const redisClient = require('../utils/redis');

// Create a job
const createJob = async (req, res) => {
  const { title, description, location, salaryRange } = req.body;
  try {
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salaryRange
      }
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};


// Get job details
const getJobDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve job details' });
  }
};

const listJobs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  // Generate unique cache key based on search, page, limit
  const cacheKey = `jobs:list:search=${search}:page=${page}:limit=${limit}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving jobs from cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    const filter = {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          location: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    };

    const totalCount = await prisma.job.count({ where: filter });

    const jobs = await prisma.job.findMany({
      where: filter,
      skip: (page - 1) * limit,
      take: limit
    });

    const response = { totalCount, page, limit, jobs };

    // Cache response for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
};



module.exports = {
  createJob,
  getJobDetails,
  listJobs
};

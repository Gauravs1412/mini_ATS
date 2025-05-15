const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express();

const setupSwaggerDocs = require('./swagger');
setupSwaggerDocs(app);
const prisma = require('./src/prismaClient');

//import routes
const jobRoute = require("./routes/jobs");
const candidateRoute = require("./routes/candidate");
const applicationRoute = require("./routes/application")
const loginRoute = require("./routes/login")
app.use(express.json());

app.use("/jobs", jobRoute)
app.use("/candidate", candidateRoute);
app.use("/applications", applicationRoute)
app.use("/login", loginRoute)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongo = require('../server/services/mongo');
const config = require('../config');
const TaskRunner = require('./helpers/TaskRunner');
const jobs = require('./jobs');

// connect to mongo db
mongo.connect();

const tasks = [];
if (config.cron.imagesCleanerEnabled) {
  tasks.push(new TaskRunner('task.images', config.cron.schedules.images, jobs.images.exec));
}
if (config.cron.offersCleanerEnabled) {
  tasks.push(new TaskRunner('task.offers', config.cron.schedules.offers, jobs.offers.exec));
}
tasks.forEach(job => job.start());

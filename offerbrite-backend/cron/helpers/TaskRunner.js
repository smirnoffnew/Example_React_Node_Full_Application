/* eslint-disable no-unused-expressions */
const { CronJob } = require('cron');
const { getLogger } = require('../../server/helpers/winston');
const _ = require('lodash');


module.exports = class TaskRunner {
  constructor(name, schedule, task) {
    if (!_.isFunction(task)) {
      throw new Error('argument task must be a function');
    }
    this.name = name;
    this.schedule = schedule;
    this.task = task;
    this._job = null;
  }

  get job() {
    return this._job;
  }

  stop() {
    this._job.stop();
    this._job = null;
  }

  start(enableLog = true) {
    if (this._job) {
      this.stop();
    }
    const log = enableLog ? getLogger({ name: this.name }) : null;
    this._job = new CronJob(this.schedule, () => {
      enableLog && log.info('Job was fired');
      this.task();
      enableLog && log.info('next execution time %s', this.nextTimeRun);
    }, () => {
      enableLog && log.info('Job stopped');
    }, true, null, null, true);
    enableLog && log.info('start with schedule %s, next run time: %s', this.schedule, this.nextTimeRun);
  }

  get nextTimeRun() {
    if (this.job) {
      return this.job.nextDates();
    }
    return null;
  }
};

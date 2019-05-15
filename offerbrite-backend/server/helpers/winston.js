const { createLogger, format, transports } = require('winston');
const moment = require('moment');
const config = require('../../config');

function customPrintf() {
  if (config.log.timestamps) {
    return format.printf(
      info => `[${moment()
        .format('HH:MM:SS D/M/YY')}] [${info.label}] ${info.level}: ${info.message}`
    );
  }
  return format.printf(
    info => `${info.label ? `[${info.label}] ` : ''}${info.level}: ${info.message}`
  );
}

const options = {
  file: {
    level: config.log.level,
    filename: config.log.output,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    silent: !config.log.enableLog
  },
  console: {
    level: config.log.level,
    json: false,
    colorize: true,
    silent: !config.log.enableLog
  }
};

function getLogger({ module, name }) {
  let label = null;
  if (module) {
    label = module.filename
      .split('/')
      .slice(-2)
      .join('/');
  } else {
    label = name || '';
  }
  return createLogger({
    transports: [
      new transports.File({
        format: format.combine(format.label({ label }), format.splat(), customPrintf()),
        ...options.file
      }),
      new transports.Console({
        ...options.console,
        format: format.combine(
          format.label({ label }),
          format.colorize(),
          format.splat(),
          format.json({ space: 2 }),
          customPrintf()
        )
      })
    ]
  });
}

const expressWinstonInstance = createLogger({
  transports: [
    new transports.File({
      ...options.file
    }),
    new transports.Console({
      format: format.combine(format.splat(), format.colorize(), format.json({ space: 2 })),
      ...options.console,
      silent: config.env !== 'development'
    })
  ]
});

module.exports = {
  getLogger,
  expressWinstonInstance
};

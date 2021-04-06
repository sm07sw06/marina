const appRoot = require('app-root-path');    // app root 경로를 가져오는 lib
const winston = require('winston');            // winston lib
const winstonDaily = require('winston-daily-rotate-file')
const process = require('process');

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Seoul'
    });
}

const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('config');
const logFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp({ format: timezoned }),
	winston.format.align(),
	winston.format.printf(
			info => `${info.timestamp} ${info.level}: ${info.message}`
	)
);

const transport = new DailyRotateFile({
	filename: config.get('logConfig.logFolder') + config.get('logConfig.logFile'),
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '500m',
	maxFiles: '14d',
	prepend: true,
	level: config.get('logConfig.logLevel'),
});

transport.on('rotate', function (oldFilename, newFilename) {
// call function like upload to s3 or on cloud
});
const logger = winston.createLogger({
format: logFormat,
transports: [
     transport,
     new winston.transports.Console({
           level: 'info',}),
]});

module.exports = logger;

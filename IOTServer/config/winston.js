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

const logger = winston.createLogger({
format: logFormat,
level:'debug',
transports: [
     new (winstonDaily)({                               // 로그 파일 설정
           name: 'info-file',
           filename: config.get('logConfig.logFolder') + config.get('logConfig.logFile'),                 // 파일 이름 (아래 설정한 날짜 형식이 %DATE% 위치에 들어간다)
           datePattern: 'YYYY-MM-DD',                   // 날짜 형식 (대문자여야 적용된다.)
           colorize: true,
           maxsize: '500m',                             // 로그 파일 하나의 용량 제한
           maxFiles: '14d',                             // 로그 파일 개수 제한
           level: 'debug', // info이상 파일 출력                      // 로그 레벨 지정
           showLevel: true
       }),
       new (winston.transports.Console)({               // 콘솔 출력
               name: 'debug-console',
               colorize: true,
               level: 'debug', 							// debug이상 콘솔 출력
               showLevel: true
       })              
]});

module.exports = logger;

import winston from "winston";
const logger = winston.createLogger({
    level:'info',
    format:winstom.format.json(),
    transports:[
        new
        winston.transports.Console()
    ]
});
export default logger;
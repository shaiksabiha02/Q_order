// export class AppError extends Error {
//     constructor(message, statusCode) {
//         super(message);
//         this.statusCode=statusCode;
//         this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//         this.isOperational = true;

//         Error.captureStackTrace(this, this.constructor);
//     } 
// }


// export class BadRequestError extends AppError {
//     constructor(message) {
//         super(message, 400);
//     }
// }

// export class NotFoundError extends AppError {
//     constructor(message) {
//         super(message, 404);
//     }
// }

// export class conflictError extends AppError {
//     constructor(message) {
//         super(message, 409);
//     }
// }

// export class InternalServerError extends AppError {
//     constructor(message){
//         super(message, 500);
//     }
// }
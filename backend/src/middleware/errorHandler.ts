import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";

const errorHandler: ErrorRequestHandler = (err, req , res , next ) => {
    // console.error(err.stack);
    // console.log(`PATH: ${req.path}`, err.message);
    console.log(`PATH: ${req.path}`, err);
    res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
}

export { errorHandler };


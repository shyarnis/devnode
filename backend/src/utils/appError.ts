class AppError extends Error{
    constructor(
        public statusCode: number,
        public message: string,
        public errorCode?: string,
    ){
        super(message);
    }
}

export default AppError;
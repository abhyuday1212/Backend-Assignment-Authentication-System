declare class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];
    constructor(statusCode?: number, message?: string, errors?: any[], stack?: string);
}
export { ApiError };

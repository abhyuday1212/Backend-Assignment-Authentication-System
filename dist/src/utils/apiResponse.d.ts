declare class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;
    constructor(statusCode: number, data: any, message?: string);
}
export { ApiResponse };

export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare function sanitizeString(str: string): string;
export declare function paginate(page?: number, limit?: number): {
    offset: number;
    limit: number;
};
//# sourceMappingURL=helpers.d.ts.map
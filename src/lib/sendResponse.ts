import { Response } from "express";

interface SendResponseOptions<T> {
    res: Response;
    status?: number;
    success: boolean;
    message: string;
    data?: T;
}

export function sendResponse<T>({
    res,
    status = 200,
    success,
    message,
    data,
}: SendResponseOptions<T>) {
    return res.status(status).json({
        success,
        message,
        ...(data !== undefined && { data }),
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = sendResponse;
function sendResponse({ res, status = 200, success, message, data, }) {
    return res.status(status).json({
        success,
        message,
        ...(data !== undefined && { data }),
    });
}

import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
    private _status: number;
    private _details: unknown;

    constructor(
        message: string,
        details: unknown,
        status: number = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message);
        this.name = this.constructor.name;
        this._status = status;
        this._details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    public get status() {
        return this._status;
    }

    public get details() {
        return this._details;
    }
}

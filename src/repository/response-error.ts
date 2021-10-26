import { AxiosError } from "axios";

// Server-side validation error.
interface InvalidReason {
  field: string; // Which field goes wrong.
  code: 'missing' | 'missing_field' | 'invalid' | 'already_exists';
}

export function isCodeMissing(invalid: InvalidReason, field: string): boolean {
  return invalid.field === field && invalid.code === 'missing';
}

export function isCodeMissingField(invalid: InvalidReason, field: string): boolean {
  return invalid.field === field && invalid.code === 'missing_field';
}

export function isCodeInvalid(invalid: InvalidReason, field: string): boolean {
  return invalid.field === field && invalid.code === 'invalid';
}

export function isCodeAlready(invalid: InvalidReason, field: string): boolean {
  return invalid.field === field && invalid.code === 'already_exists';
}
export interface ApiErrorPayload {
  message: string;
  // Only exists for 422 Unprocessable.
  error?: InvalidReason;
}

export class ResponseError extends Error{
  readonly statusCode: number;
  readonly message: string;
  readonly invalid?: InvalidReason;

  constructor(code: number, payload: ApiErrorPayload) {
    super();
    this.statusCode = code;
    this.message = payload.message;
    this.invalid = payload.error;
  }

  get badRequest(): boolean {
    return this.statusCode === 400;
  }

  get unauthorized(): boolean {
    return this.statusCode === 401;
  }

  // 404 Not Found
  get notFound(): boolean {
    return this.statusCode === 404;
  }

  // 403 Fobidden.
  get fobidden(): boolean {
    return this.statusCode === 403;
  }

  get tooManyRequests(): boolean {
    return this.statusCode === 429;
  }

  get serverError(): boolean {
    return this.statusCode >= 500;
  }

  // Turn 422 error to key-value maps.
  // The key is usually the same as a form
  // field name.
  get toFormFields(): {[k: string]: string} {
    if (!this.invalid) {
      return {};
    }
    const name = this.invalid.field;
    const value = this.message;
    const o: {[k: string]: string} = {};
    o[name] = value;
    return o;
  }

  toString(): string {
    return `Server error: ${this.statusCode} ${this.message}`;
  }

  static fromText(msg: string): ResponseError {
    return new ResponseError(
      -1,
      {
        message: msg
      },
    )
  }

  static newInstance(error: AxiosError<ApiErrorPayload>): ResponseError {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response) {
      return new ResponseError(
        error.response.status,
        error.response.data,
      );
    }

    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    if (error.request) {
      return new ResponseError(400, {
        message: 'No response received',
      });
    }

    return new ResponseError(-1, {
      message: error.message,
    });
  }
}

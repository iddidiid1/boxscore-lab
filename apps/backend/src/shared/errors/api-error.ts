export type ErrorDetail = {
  field: string;
  message: string;
};

export class ApiError extends Error {
  statusCode: number;
  error: string;
  details: ErrorDetail[];

  constructor(statusCode: number, error: string, message: string, details: ErrorDetail[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
  }
}

export function sendError(res: { status: (code: number) => { json: (body: unknown) => void } }, error: unknown) {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      error: error.error,
      message: error.message,
      details: error.details
    });
    return;
  }

  res.status(500).json({
    statusCode: 500,
    error: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    details: []
  });
}


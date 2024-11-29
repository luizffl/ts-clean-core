export class ApplicationError extends Error {
  message = "Unexpected error.";

  static buildFromError(error: Error): ApplicationError {
    if (error instanceof ApplicationError) {
      return error;
    }

    const applicationError = new ApplicationError();

    if (error instanceof Error) {
      applicationError.stack = error.stack;
    }

    return applicationError;
  }
}

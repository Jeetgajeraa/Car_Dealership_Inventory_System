export class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: string[];

  constructor(
      message: string = "Something went wrong",
      statusCode: number,
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      (Error as ErrorConstructor & {
        captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void;
      }).captureStackTrace?.(this, this.constructor);
    }
  }
}
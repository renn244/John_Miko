export class InvalidSessionError extends Error {
  constructor() {
    super("Your session has expired.");
    this.name = "InvalidSessionError";
  }
}

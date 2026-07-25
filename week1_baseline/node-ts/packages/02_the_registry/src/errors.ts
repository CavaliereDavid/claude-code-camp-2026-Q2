export class UnknownToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnknownToolError";
  }
}

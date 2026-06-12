export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message); // passe le message à la Error de base
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

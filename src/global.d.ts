declare global {
  namespace Express {
    export interface User {
      userId?: string;
      email?: string;
    }
  }
}

export {};

import type { Request, Response, NextFunction } from "express";

export class UserNotFoundError extends Error {
    constructor(email: string) {
        super(`User with email ${email} not found`);
        this.name = "UserNotFoundError";
    }
}

export class InvalidPasswordError extends Error {
    constructor() {
        super("Incorrect password");
        this.name = "InvalidPasswordError";
    }
}

export class TokenAuthorizationError extends Error {
	constructor() {
        super("Acces denied");
        this.name = "TokenAuthorizationError"
    }
}

export class MissingTokenError extends Error {
    constructor() {
        super("Token not found");
        this.name = "MissingTokenError"
    }
}

export class TokenValidationError extends Error {
    constructor() {
        super("Invalid Token");
        this.name = "TokenValidationError";
    }
}


export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(`[Erreur] ${err.name}: ${err.message}`);
  
    if (err instanceof MissingTokenError) {
      return res.status(401).json({ message: err.message });
    }
  
    if (err instanceof TokenValidationError) {
      return res.status(403).json({ message: err.message });
    }
  
    if (err instanceof TokenAuthorizationError) {
      return res.status(403).json({ message: err.message });
    }
  
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ message: err.message });
    }
  
    if (err instanceof InvalidPasswordError) {
      return res.status(401).json({ message: err.message });
    }
  
    console.error("Erreur non gérée :", err);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
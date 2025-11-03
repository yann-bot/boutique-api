import type { Request, Response, NextFunction } from "express";

export class UserNotFoundError extends Error {
    constructor(email: string) {
        super(`User with email ${email} not found`);
        this.name = "UserNotFoundError";
    }
}

export class DuplicateUserError extends Error {
    constructor(email: string) {
        super(`User with email ${email} already exists`);
        this.name = "DuplicateUserError";
    }
}

export class DuplicateFavoriteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DuplicateFavoriteError";
    }
}

export class MissingShopIdError extends Error {
    constructor() {
        super("Missing shop id");
        this.name = "MissingShopIdError";
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
        super("Access denied");
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

export class InvalidFavoriteDataError extends Error {
    constructor(message = "Invalid favorite data") {
        super(message);
        this.name = "InvalidFavoriteDataError";
    }
}

export class MissingIdError extends Error {
    constructor() {
        super("Missing id");
        this.name = "MissingIdError";
    }
}

export class MissingHeaderAuthorization extends Error {
    constructor() {
        super("Missing Authorization header");
        this.name = "MissingHeaderAuthorization";
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
    if (err instanceof DuplicateUserError) {
      return res.status(409).json({ message: err.message });
    }
  
    if (err instanceof InvalidPasswordError) {
      return res.status(401).json({ message: err.message });
    }
    if (err instanceof MissingShopIdError) {
      return res.status(400).json({ message: err.message });
    }
  
    console.error("Erreur non gérée :", err);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
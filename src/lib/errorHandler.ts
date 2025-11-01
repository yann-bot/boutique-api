
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
        this.name = "TokenAutorizationError"
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
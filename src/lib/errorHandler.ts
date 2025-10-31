
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
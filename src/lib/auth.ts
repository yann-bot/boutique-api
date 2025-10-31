import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";


export function generateJwt( id: string, email:string, role:string){
    const payload = {id,email, role};

    const jwt_secret = process.env.JWT_SECRET;
    if(!jwt_secret) {
        throw new Error('Missing JWT_SECRET')
    };

    const secret: Secret = jwt_secret;
    const options: SignOptions = { expiresIn: "1h" };

    
    const token = jwt.sign(payload,secret, options);
    return token;
}


export function verifyToken(token: string, role: string): JwtPayload | null {
      const secret = process.env.JWT_SECRET!;
	  if(token == null) {
		return null;
	  };

	  if(token.startsWith('Bearer ')) {
		token = token.split(" ")[1]!;
	  }

	 const decoded = jwt.verify(token, secret)
     
	 if(decoded == null) {
		return null;
	 }

	 const payload = decoded as JwtPayload;
	 if(role && payload.role !== role) {
		return null;
	 }

	 return payload;
}

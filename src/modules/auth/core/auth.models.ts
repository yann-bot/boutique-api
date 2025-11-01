import z from 'zod';


export type LoginOutput = {
	token: string;
}

export type  LoginInput = {

    email:string,
    password:string,
}


export const  userLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})
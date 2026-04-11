import { IsString, Matches, MinLength, IsNotEmpty, IsEmail, IsInt, Min } from 'class-validator';
 
export class UserDTO {
   
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9 ]*$/, { message: 'Name must not contain special characters' })
    name: string;
 
    @IsEmail()
    @IsNotEmpty()
    email: string;
 
    @MinLength(6)
    @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    password: string;
 
    @IsInt()
    @Min(0)
    age: number;
     
    @Matches(/^01/, { message: 'Phone number must start with 01' })
    phone: string;
 
    @IsString()
    address: string;
}
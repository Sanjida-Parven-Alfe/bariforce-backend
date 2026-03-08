import { IsString, Matches, MinLength, IsNotEmpty } from 'class-validator';
 
export class UserDTO {
   
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9 ]*$/, { message: 'Name must not contain special characters' })
    name: string;

    @MinLength(6)
    @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    password: string;
     
    @Matches(/^01/, { message: 'Phone number must start with 01' })
    phone: string;
 
    @IsString()
    address: string;
}
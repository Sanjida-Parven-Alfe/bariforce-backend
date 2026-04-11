import { match } from 'assert';
import { IsString, Matches, Length, IsIn, IsNumberString, IsNotEmpty, IsOptional } from 'class-validator';

export class WorkerDTO {

    @IsOptional()
    @IsString()
    fullname: string;

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    workertype: string;

    @IsOptional()
    @Matches(/^[a-zA-Z0-9._%+-]+@aiub\.edu$/, {
        message: 'Email must be in @aiub.edu formate'
    })
    email: string;
    @IsOptional()
    @Length(6)
    @Matches(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
    })
    password: string;

    @IsOptional()
    @IsIn(['male', 'female'])
    gender: string;

    @IsOptional()
    @Matches(/^\d+$/, { message: 'Phone must contain only digits (no sign or decimal)' })
    @Length(11, 11, { message: 'Phone must be exactly 11 digits' })
    phone: string;
}
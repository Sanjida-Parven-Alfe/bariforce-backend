import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  IsNumberString,
  Length,
} from 'class-validator';

export class AdminDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]*$/, { message: 'Name must contain only alphabets' })
  name: string;

  @IsEmail()
  @Matches(/@.*\.xyz$/, { message: 'Email must be from .xyz domain' })
  email: string;

  @IsNumberString({}, { message: 'NID must contain only numbers' })
  @Length(10, 17, { message: 'NID must be between 10 to 17 digits' })
  nid: string;
}

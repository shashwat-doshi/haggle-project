import { IsEmail, IsNotEmpty, IsString } from "class-validator";

// normally this is exported as an interface but we use classes here to work with validator decorator
export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

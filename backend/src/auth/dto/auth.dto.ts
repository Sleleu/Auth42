import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
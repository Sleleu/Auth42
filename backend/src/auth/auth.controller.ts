import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor (private authService : AuthService) {}

	@Get('callback')
	getCode() : string {
		return this.authService.getCode();
	}
}

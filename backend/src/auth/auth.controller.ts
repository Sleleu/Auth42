import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor (private authService : AuthService) {}

	@Get('callback')
	async getCode(@Query('code') code: string, @Query('state') state: string) {
		if (state !== 'test') {
			throw new Error('Invalid state');
		  }
		// console.log(code);
		const AccessToken = await this.authService.getToken(code);
		return `AccessToken : ${AccessToken}`
	}
}

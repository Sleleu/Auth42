import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

interface ApiToken {
	access_token : string;
	token_type: string,
	expires_in: number,
	scope: string,
	created_at: number
}

@Controller('auth')
export class AuthController {
	constructor (private authService : AuthService) {}

	@Get('callback')
	async getCode(@Query('code') code: string, @Query('state') state: string) {
		if (state !== 'test') {
			throw new Error('Invalid state');
		  }
		// console.log(code);
		const AccessToken : ApiToken = await this.authService.getToken(code);
		return `AccessToken : ${AccessToken.access_token}`
	
	}
}

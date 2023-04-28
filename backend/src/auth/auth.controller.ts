import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiToken } from './auth.interface';

interface ApiProfile {
	login : string;
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
		
		const Profile : ApiProfile = await this.authService.getProfile(AccessToken);
		
		return `Profile: ${Profile.login}`
		
	}
}

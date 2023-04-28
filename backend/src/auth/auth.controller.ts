import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiToken } from './auth.interface';
import { UserDto } from './userDto';

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
		
		const Profile = await this.authService.getProfile(AccessToken);
		
		if (!Profile)
		  return 'Cannot get Profile from getProfile()';
		
		return `Profile: ${Profile.login} <br/> <img src=${Profile.avatar} height="264px" width="356px">`
		
	}
}

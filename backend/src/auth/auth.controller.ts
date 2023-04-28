import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiToken } from './auth.interface';
import { UserDto } from './userDto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
	constructor (private authService : AuthService,
				 private configService : ConfigService) {}

	@Get('callback')
	async getCode(@Query('code') code: string,
				  @Query('state') state: string,
				  @Res() res: Response) {
		if (state !== 'test') {
			throw new Error('Invalid state');
		  }
		// console.log(code);
		const AccessToken : ApiToken = await this.authService.getToken(code);
		
		const Profile = await this.authService.getProfile(AccessToken);
		
		if (!Profile)
		  return 'Cannot get Profile from getProfile()';
		
		res.redirect(this.configService.get('RESPONSE_URI'));
		
	}
}

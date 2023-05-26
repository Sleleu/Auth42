import { Controller, Get, Query, Res, HttpException, HttpStatus, Req, Post } from '@nestjs/common';
import { IntraService } from './intra.service';
import { Response, Request } from 'express';
import { ApiToken } from './intra.interface';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { User42 } from './intra.interface';

@Controller('intra')
export class IntraController {
	constructor (private intraService: IntraService,
				 private configService: ConfigService,
				 private prismaService: PrismaService) {}

	@Get('callback')
	async getCode(@Query('code') code : string,
				  @Query('state') state : string,
				  @Res() res : Response) {
			if (state !== this.configService.get('STATE') || !code) {
				throw new HttpException('Invalid code or state', HttpStatus.FORBIDDEN);
			}
			const AccessToken : ApiToken = await this.intraService.getToken(code);
			if (!AccessToken || !AccessToken.access_token) {
				throw new HttpException('Cannot get access token from 42 api', HttpStatus.FORBIDDEN);
			}
			const IntraProfile = await this.intraService.getProfile(AccessToken);
			if (!IntraProfile) {
				throw new HttpException('Cannot get Profile from getProfile()', HttpStatus.FORBIDDEN);
			}
			const NewUser : boolean = await this.intraService.newProfile(IntraProfile);
			if  (NewUser == true) {
				if (await this.intraService.createUser(IntraProfile) == false)
					throw new HttpException('Cannot create new user from createUser()', HttpStatus.FORBIDDEN);
			}
			const User = await this.prismaService.user.findUnique({
				where : {
					username : IntraProfile.login,
				}
			})
			if (!User)
				throw new HttpException('Cannot create new user from createUser()', HttpStatus.FORBIDDEN);

			//check le 2FA
			const isTwoFAEnabled = await this.intraService.isTwoFAEnabled(User.id);
				if (isTwoFAEnabled)
				  res.redirect('http://localhost:3000/verify-2fa');
			
			const JwtToken = await this.intraService.getJwtToken(User?.id, User?.username)
			await this.prismaService.user.update({
				where : {
					username : User.username,
				},
				data : {
					access_token : JwtToken,
				}
			})
			res.cookie('Authorization', JwtToken, {
				httpOnly: true
			});
			res.redirect('http://localhost:3000/home');
	}
	@Get('verify-session')
	async verifySession(@Req() req : Request) {
	  const sessionId = req.cookies.Authorization
		console.log("verify session cookie :", req.cookies.Authorization)
	  const session = await this.prismaService.user.findFirst({
		where: {
			access_token: sessionId
		},
	  });
	  if (session) {
		return true;
	  } else {
		throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
	  }
	}

	@Get('generate-2fa-secret')
	async generateTwoFASecret(@Req() req : Request) {
  	const sessionId = req.cookies.Authorization;
  	const user = await this.prismaService.user.findFirst({
    	where: {
      	access_token: sessionId
    	},
  	});
	console.log('Passage dans generate et user = ', user);
  	if (!user) {
    	throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
  	}
  	const { secret, otpauthUrl } = await this.intraService.generateTwoFactorAuthenticationSecret(user.username, user.id);
  	return { secret, otpauthUrl };
	}

	@Get('verify-2fa-code')
	async verifyTwoFACode(@Req() req : Request, @Query('code') code : string) {
	const sessionId = req.cookies.Authorization;
	const user = await this.prismaService.user.findFirst({
		where: {
		access_token: sessionId
		},
	});

	if (!user) {
		throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
	}

	const isTwoFAValid = await this.intraService.verifyTwoFactorAuthenticationToken(user.id, code);
	if (isTwoFAValid) {
		return { message: "2FA code valid" };
	} else {
		throw new HttpException('Invalid 2FA code', HttpStatus.FORBIDDEN);
	}
	}

	@Post('enable-2fa')
	async enableTwoFA(@Req() req : Request) {
		const sessionId = req.cookies.Authorization;
		const user = await this.prismaService.user.findFirst({
			where: {
				access_token: sessionId
			},
		});
		if (!user) {
			throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
		}
		await this.intraService.enableTwoFA(user.id);
		return { message: "2FA enabled successfully" };
	}
}
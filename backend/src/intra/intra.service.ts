import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiToken, User42 } from './intra.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

@Injectable()
export class IntraService {
  constructor(
    private prismaService: PrismaService,
	private jwtService : JwtService,
    private configService: ConfigService,
  ) {}
	async getToken(code : string) {
		const data = {
			grant_type : 'authorization_code',
			client_id : this.configService.get('CLIENT_ID'),
			client_secret : this.configService.get('CLIENT_SECRET'),
			code : code,
			redirect_uri : this.configService.get('REDIRECT_URL'),	
		};
		const config = {
			headers: {
			  'Content-Type': 'application/x-www-form-urlencoded',
			},
		  };
		  return axios.post('https://api.intra.42.fr/oauth/token', data, config)
		  .then((response)=> {
			return (response.data);
		  })
		  .catch(error => {
			console.error(error);
		  });	  
	}

	async getProfile(accessToken : ApiToken) {
		const config = {
			headers : {
				'Authorization' : `Bearer ${accessToken.access_token}`
			}
		}
		// console.log("TOKEN TEST", accessToken.access_token);
		return axios.get('https://api.intra.42.fr/v2/me', config)
		.then((response)=> {
			const User : User42 = {
				email: response.data.email,
				login: response.data.login,
				avatar: response.data.image.link,
				id: response.data.id,
				twoFactorAuthenticationSecret: '',
			}
			//console.log('response.data : ', response.data);
			// console.log('User : ', User);
			if (!User){
				throw new HttpException('Error', HttpStatus.FORBIDDEN);
			}
			return User;
		})
		.catch(error => {
			console.log('An error occured : ', error);
		});
	}

	async newProfile(profile : User42)
	{
		const userExists = await this.prismaService.user.findUnique({
			where : {
				username: profile.login
			}
		})
		if (!userExists)
		{
			console.log("User do not exist")
			return (true);
		}
		console.log("User already exist");
		return (false);
	}

	async createUser(profile : User42)
	{
		const newUser = await this.prismaService.user.create({
			data: {
				username : profile.login,
				avatar : profile.avatar,		
			}
		})
		if (!newUser) {
			console.log('Error on createUser()');
			return (false);
		}
		console.log('User created !');
		return (true);
	}

	async getJwtToken(
		userId: number,
		username: string,
	  ):  Promise<string>  {
		const payload = {
		  sub: userId,
		  username: username,
		};
		const secret = this.configService.get('JWT_SECRET');
		const token = await this.jwtService.signAsync(payload, {
		  expiresIn: '1days',
		  secret: secret,
		});
		//console.log("passage dans getJwtToken()")
		return token;
	  }

	async isTwoFAEnabled(userId: number) {
		const user = await this.prismaService.user.findUnique({
		  where: { id: userId },
		});
		if (user.TwoFAenabled === true)
			return true;
		else
			return false;
	  }
	  

	async setTwoFASecret(secret: string, userId: number) {
    	await this.prismaService.user.update({
      	where: { id: userId },
      	data: { TwoFASecret : secret },
		});
	}

	async generateTwoFactorAuthenticationSecret(login : string, userId : number) {
		const secret = authenticator.generateSecret()
	
		const otpauthUrl = authenticator.keyuri(login, 'ft_transcendence', secret);
	
		await this.setTwoFASecret(secret, userId);

		return {
		  secret,
		  otpauthUrl
		}
	  }

	async verifyTwoFactorAuthenticationToken(userId: number, token: string) {
		const user = await this.prismaService.user.findUnique({
		  where: { id: userId },
		});
	
		const secret = user?.TwoFASecret;

		if (!secret){
			console.log("Error while finding 2FA secret");
			return null;
		}
		return authenticator.verify({
		token,
		secret,
		});
	  }

	async enableTwoFA(userId : number) {
		await this.prismaService.user.update({
      	where: { id: userId },
		data : { TwoFAenabled : true }
		});
	  }

	async disableTwoFA(userId : number) {
		await this.prismaService.user.update({
      	where: { id: userId },
		data : { TwoFAenabled : false }
		});
	  }
}

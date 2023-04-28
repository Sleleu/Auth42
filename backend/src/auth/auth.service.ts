import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiToken } from './auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor (private configService : ConfigService) {}
	async getToken(code : string) {
		// console.log(code);

		const data = {
			grant_type : 'authorization_code',
			client_id : this.configService.get('CLIENT_ID'),
			client_secret : this.configService.get('CLIENT_SECRET'),
			code : code,
			redirect_uri : this.configService.get('REDIRECT_URI'),
		};
		const config = {
		  headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		  },
		};
		return axios.post('https://api.intra.42.fr/oauth/token', data, config)
		.then((response)=> {
		  // console.log(response.data)
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
			const User = {
				email: response.data.email,
				login: response.data.login,
				avatar: response.data.image.link,
				id: response.data.id}
			//console.log('response.data : ', response.data);
			// console.log('User : ', User);
			return User;
		})
		.catch(error => {
			console.log('An error occured : ', error);
		});
	}
}

import { Injectable } from '@nestjs/common';
import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { ApiToken } from './auth.interface';
import { response } from 'express';
import { error } from 'console';
import { UserDto } from './userDto';

interface ApiProfile {
	login : string;
}

@Injectable()
export class AuthService {
	async getToken(code : string) {
		// console.log(code);

		const data = {
			grant_type : 'authorization_code',
			client_id : 'u-s4t2ud-82fbd07c7916da97c5b40169121da2c78878118cc3d95bc5d34766cadd71cd87',
			client_secret : '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',
			code : code,
			redirect_uri : 'http://localhost:5000/auth/callback',
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

	async getProfile(accessToken : ApiToken) : Promise<UserDto> {
		var User : UserDto;
		const config = {
			headers : {
				'Authorization' : `Bearer ${accessToken.access_token}`
			}
		}
		// console.log("TOKEN TEST", accessToken.access_token);
		 axios.get('https://api.intra.42.fr/v2/me', config)
		.then((response)=> {
			User = {
				email: response.data.email,
				login: response.data.login,
				avatar: response.data.image.link,
				id: response.data.id}
			//console.log('response.data : ', response.data);
			// console.log('User : ', User);
		})
		.catch(error => {
			console.log('An error occured : ', error);
		});
		return (User);
	}
}

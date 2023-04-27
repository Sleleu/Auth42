import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
	async getToken(code : string) {
		console.log(code);

		const params = new URLSearchParams({
			grant_type : 'client_credentials',
			client_id : process.env.CLIENT_ID,
			client_secret : process.env.CLIENT_SECRET,
			code : code,
			response_type : 'code'});
		const config = {
		  headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		  },
		};
		return axios.post('https://api.intra.42.fr/oauth/token', params, config)
		.then((response)=> {
		  console.log(response.data)
		  return (response.data);
		})
		.catch(error => {
		  console.error(error);
		});

		return "Test callback is okay !";
	}
}

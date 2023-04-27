import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	getCode() : string {
		return "Test callback is okay !";
	}
}

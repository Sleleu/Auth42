import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		
		const request = context.switchToHttp().getRequest();
		//console.log("test request.cookie in JwtGuard() : ", request.cookies)
		if (!request.cookies) {
		  throw new ForbiddenException('Missing cookie-parser middleware');
		}
		const token = request.cookies.Authorization;
		if (!token) {
		  throw new ForbiddenException('Missing Authorization cookie');
		}
		request.headers.authorization = `Bearer ${token}`;
		return request;
	  }
	}
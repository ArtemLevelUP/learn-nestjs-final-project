import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { Response, Request } from 'express';
import {JwtAuthGuard} from "./jwt-auth-guard.service";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @ApiOkResponse({ description: 'JSON with accessToken and expiresIn', type: 'text/json', schema: {type: 'object', properties: { accessToken: { type: 'string' }, expiresIn: { type: 'date'}}}})
    @ApiBadRequestResponse({ description: 'incorrect payload', type: 'text/json', schema: {type: 'object', properties: { message: { type: 'string' }}}})
    @ApiInternalServerErrorResponse({ description: 'some server error'})
    @HttpCode(HttpStatus.OK)
    login(@Body() body, @Res() res: Response) {
        return this.authService.login(body, res);
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Res() res: Response) {
        return this.authService.logout(res);
    }
}

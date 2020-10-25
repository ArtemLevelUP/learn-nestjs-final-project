import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { Response, Request } from 'express';
import {JwtAuthGuard} from "./jwt-auth-guard.service";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse, ApiParam, ApiProperty,
    ApiTags
} from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    // @ApiOkResponse({ description: 'JSON with accessToken and expiresIn', type: 'text/json', schema: {type: 'object', properties: { accessToken: { type: 'string' }, expiresIn: { type: 'date'}}}})
    // @ApiBadRequestResponse({ description: 'incorrect payload', type: 'text/json', schema: {type: 'object', properties: { message: { type: 'string' }}}})
    // @ApiInternalServerErrorResponse({ description: 'some server error'})
    @ApiParam({name:'auth', type: 'string', description: 'base64 string concatenated email + : + password', example: 'Base amRvZUBlbWFpbC5jb206MTIzNDU2' })
    @HttpCode(HttpStatus.NO_CONTENT)
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

import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';

@Controller('')
export class AuthController {
    @Post('/login')
    @HttpCode(HttpStatus.NO_CONTENT)
    login(@Body() body) {
        return 'try to login';
    }

    @Post('/logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Body() body) {

    }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "../users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async login(body, res) {
        const credentials = Buffer.from(body.authorization, 'base64').toString('ascii').split(':');
        const user = await this.userRepository.findOne({
            'email': credentials[0],
            'password': credentials[1],
        });

        if (!user) {
            throw new BadRequestException(`Invalid credentials`);
        }

        const payload = { hash: user.hash, password: user.password };
        const accessToken = this.jwtService.sign(payload);
        const expiresIn = new Date(Date.now() + Number(process.env.EXPIRESIN));

        res.cookie('accessToken', accessToken, {expires: expiresIn});
        res.send({
            expiresIn: expiresIn,
            accessToken,
        });
    }

    async logout(res) {
        res.clearCookie('accessToken');
        res.send();
    }
}
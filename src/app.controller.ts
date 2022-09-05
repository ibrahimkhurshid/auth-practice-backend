import { Body, Controller, Get, HttpException, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from 'express'
import { AppGuard } from "./app.guard";


@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private jwtService: JwtService) { }

    @Post('signup')
    async signup(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        const hashedPassword = await bcrypt.hash(password, 12)
        return await this.appService.create({ id: null, name: name, email: email, password: hashedPassword })
    }

    @Post('signin')
    async signin(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response
    ) {
        const user = await this.appService.findOne({ email: email })
        if (!user) {
            return new UnauthorizedException({ message: "User not found" })
        } else {
            const correct = await bcrypt.compare(password, user.password)
            if (!correct) {
                return new UnauthorizedException({ message: "incorrect password" })
            } else {
                const jwt = await this.jwtService.signAsync({ id: user.id })
                response.cookie('jwt', jwt, { httpOnly: true })
                return "signed in"
            }
        }
    }

    @Post('signout')
    signout(
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request) {

        try {
            const jwt = request.cookies['jwt']
            if (jwt) {
                response.clearCookie('jwt')
                return "signed out"
            } else if (jwt === '') {
                return "Not Logged in"
            }
        } catch (e) {
            return "cookie not found"
        }

    }
    @Get('profile')
    async profile(@Req() request: Request) {
        const jwt = request.cookies['jwt']
        const found = await this.jwtService.verifyAsync(jwt)
        if (!found) {
            return new UnauthorizedException({ message: "cookie and user not found" })
        } else {
            return await this.appService.findOne({ id: found['id'] })
        }
    }
    @UseGuards(AppGuard)
    @Get()
    async index() {
        return await this.appService.index()
    }
}

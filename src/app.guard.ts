import { CanActivate, ExecutionContext, Get, Injectable, Post, Redirect } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class AppGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const jwt = request.cookies['jwt']
        if (!jwt) {
            return false
        } else {
            return true
        }
    }
}
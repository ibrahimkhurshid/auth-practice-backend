import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./user.entity";

@Module({
    imports: [TypeOrmModule.forRoot({
        type: "sqlite",
        database: "users.db",
        synchronize: true,
        entities: [User]
    }), TypeOrmModule.forFeature([User]),
    JwtModule.register({
        secret: "sjkdhfkjsdhf", signOptions: {
            expiresIn: "1d"
        }
    })],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }

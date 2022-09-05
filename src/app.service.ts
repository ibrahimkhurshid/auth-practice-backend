import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";


@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) { }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user)
    }

    async findOne(condition: any): Promise<User> {
        return this.userRepository.findOne({ where: condition })
    }

    async index(): Promise<User[]> {
        return this.userRepository.find()
    }
}
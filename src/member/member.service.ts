import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import {Repository} from "typeorm";
import {Member} from "./entities/member.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class MemberService {

  constructor(
      @InjectRepository(Member)
      private memberRepository: Repository<Member>
  ) {}


  async getAllMembers() {
    const users = await this.memberRepository.find()
    return users
  }


  async registerUser(createMemberDto: CreateMemberDto) {
    const user = await this.memberRepository.create(createMemberDto)
    await this.memberRepository.save(user)
    return user
  }

  async loginMember(id: string) {
    const user = await this.memberRepository.findOneBy({ id })
    if (user) return user
    throw new HttpException('No User', HttpStatus.NOT_FOUND)
  }

  async getUserByEmail(email: string) {
    const user = await this.memberRepository.findOneBy({ email })
    if (user) return user
    throw new HttpException('No User', HttpStatus.NOT_FOUND)
  }

  async getUserById(id: string) {
    const user = await this.memberRepository.findOneBy({ id })
    if (user) return user
    throw new HttpException('No User', HttpStatus.NOT_FOUND)
  }

}

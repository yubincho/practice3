import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import {Member} from "./entities/member.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}

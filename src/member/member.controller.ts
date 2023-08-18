import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import {RoleEnum} from "./entities/role.enum";
import {RoleGuard} from "../auth/guards/role.guard";

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {
  }


  @Get('all')
  @UseGuards(RoleGuard(RoleEnum.ADMIN))
  async memberGetAll() {
    const members = await this.memberService.getAllMembers();
    return {count: members.length, members};
  }


}
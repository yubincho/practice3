import {BeforeInsert, BeforeUpdate, Column, Entity} from "typeorm";
import {CommonEntity} from "./common.entity";
import * as bcrypt from 'bcryptjs'
import * as gravatar from 'gravatar'
import {InternalServerErrorException} from "@nestjs/common";
import {ProviderEnum} from "./provider.enum";
import {RoleEnum} from "./role.enum";

@Entity()
export class Member extends CommonEntity {
    @Column()
    public name: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password?: string;

    @Column({nullable: true})
    public profileImg?: string

    @Column({
        type: "enum",
        enum: ProviderEnum,
        default: ProviderEnum.LOCAL
    })
    public provider?: ProviderEnum;

    @Column({
        type: "enum",
        enum: RoleEnum,
        array: true,
        default: [RoleEnum.USER]
    })
    public roles: RoleEnum[];

    @BeforeInsert()
    @BeforeUpdate()
    async beforeFunction(): Promise<void> {
        try {
            this.profileImg = gravatar.url(this.email, {
                s: '200',
                r: 'pg',
                d: 'mm',
                protocol: 'https',
            })
            const saltValue = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.password, saltValue)
            this.password = hashedPassword
        } catch (err) {
            throw new InternalServerErrorException()
        }
    }

    async checkPassword(userPassword: string): Promise<boolean> {
        try {
            const isMatchedPassword = await bcrypt.compare(userPassword, this.password)
            return isMatchedPassword
        } catch (err) {
            throw new InternalServerErrorException()
        }
    }



}

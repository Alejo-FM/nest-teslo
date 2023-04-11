import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from "passport-jwt";

import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy){

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,

        configService: ConfigService,

    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Indico de donde extraigo el Token
        });
    }
        
    async validate( payload: JwtPayload): Promise<User>{
        
        const { id } = payload;
        
        const user = await this.userRepository.findOneBy({ id });

        if( !user ) 
            throw new UnauthorizedException('Token not valid')

        if ( !user.isActive) 
            throw new UnauthorizedException('User is inactive, talk with an admin')  
            
        // console.log( { user } )
            
        return user; //Se añade al Request
    }
}
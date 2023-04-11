import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([ User ]),

    PassportModule.register({ defaultStrategy: 'jwt'}),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],

      //Es la funcion que voy a llamar cuando se intente registrar el modulo
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'), //Es la llave para firmar y revisar nuestros tokens
          signOptions: { //El tiempo de duracion del token
            expiresIn: '2h'
          }
        }
      }
    }),

    // JwtModule.register({
    //   secret: process.env.JWT_SECRET, 
    //   signOptions: {
    //     expiresIn: '2h'
    //   }
    // })
  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}

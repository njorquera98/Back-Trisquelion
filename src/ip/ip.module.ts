import { Module } from '@nestjs/common';
import { IpService } from './ip.service';
import { IpController } from './ip.controller';
import { Ip } from './entities/ip.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ip])],
  controllers: [IpController],
  providers: [IpService],
})
export class IpModule { }

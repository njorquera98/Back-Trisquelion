import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ip } from './entities/ip.entity';

@Injectable()
export class IpService {
  constructor(
    @InjectRepository(Ip)
    private readonly ipRepository: Repository<Ip>
  ) { }

  async saveIp(ip: string, fecha: string): Promise<void> {
    const ipData = new Ip();
    ipData.ip = ip;
    ipData.fecha = fecha;

    await this.ipRepository.save(ipData);
  }
}


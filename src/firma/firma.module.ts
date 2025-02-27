import { Module, forwardRef } from '@nestjs/common';
import { FirmaService } from './firma.service';
import { FirmaController } from './firma.controller';
import { Firma } from './entities/firma.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoModule } from 'src/documento/documento.module';

@Module({
  imports: [TypeOrmModule.forFeature([Firma]), forwardRef(() => DocumentoModule)], // forwardRef aquí
  controllers: [FirmaController],
  providers: [FirmaService],
  exports: [FirmaService], // Exportamos FirmaService
})
export class FirmaModule { }


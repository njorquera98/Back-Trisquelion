import { Module, forwardRef } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { DocumentoController } from './documento.controller';
import { Documento } from './entities/documento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmaModule } from 'src/firma/firma.module';

@Module({
  imports: [TypeOrmModule.forFeature([Documento]), forwardRef(() => FirmaModule)], // forwardRef aquí
  controllers: [DocumentoController],
  providers: [DocumentoService],
  exports: [DocumentoService],
})
export class DocumentoModule { }


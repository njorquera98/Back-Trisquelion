import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { DocumentoModule } from 'src/documento/documento.module';

@Module({
  imports: [DocumentoModule],
  controllers: [EmailController],
  providers: [EmailService]
})
export class EmailModule { }

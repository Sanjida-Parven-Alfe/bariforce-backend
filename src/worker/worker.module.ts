import { Module } from '@nestjs/common';
import { workerController } from './worker.controller';
import { workerService } from './worker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Worker])],
  controllers: [workerController],
  providers: [workerService],
})
export class workerModule {}
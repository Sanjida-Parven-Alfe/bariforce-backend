import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Worker } from './worker.entity';
import { WorkerDTO } from './worker.dto';

@Injectable()
export class workerService {
    constructor(
        @InjectRepository(Worker)
        private workerRepo: Repository<Worker>,
    ) {}
    createProfile(data: WorkerDTO): object {
        return { message: "profile created", data };
    }
  /*
   if (!/^\d+$/.test(phone)) {
        return { message: "Phone must contain only digits" };
        */
    editProfile(id: number, data: WorkerDTO): object {
        return { message: "profile updated", id, data };
    }

    changePassword(id: number, password: string): object {
        return { message: "password changed", id, password };
    }

    deleteAccount(id: number): object {
        return { message: "account deleted", id };
    }

    acceptBooking(bookingId: number): object {
        return { message: "booking accepted", bookingId };
    }

    rejectBooking(bookingId: number): object {
        return { message: "booking rejected", bookingId };
    }

    startJob(bookingId: number): object {
        return { message: "working started", bookingId };
    }

    endJob(bookingId: number): object {
        return { message: "working end", bookingId };
    }

    viewEarnings(id: number): object {
        return { message: "earnings data", id };
    }

    updateAvailability(id: number, status: string): object {
        return { message: "availability updated", id, status };
    }

    async createWorker(workerDto: WorkerDTO): Promise<Worker> {
      const worker = this.workerRepo.create(workerDto);
     return this.workerRepo.save(worker);
   }

    async updatePhone(id: number, phone: string): Promise<any> {
         await this.workerRepo.update(id, { phone });
         return this.workerRepo.findOneBy({ id: id });
    }
    
    async findWorkersWithNullName(): Promise<Worker[]> {
        return this.workerRepo.find({where: { fullname: IsNull() }
      });
    }

    async deleteWorker(id: number): Promise<any> {
        const result =await this.workerRepo.delete(id);
        if (result.affected === 1) {
        return { message: "Account is deleted" };
         } else {
        return { message: "invalid worker" };
         }
   }
}
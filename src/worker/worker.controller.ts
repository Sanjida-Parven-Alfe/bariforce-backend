import { Controller, Put, Get, Param, Post, Body, Delete, ParseIntPipe } from '@nestjs/common';
import { workerService } from './worker.service';
import { WorkerDTO } from './worker.dto';

@Controller('worker')
export class workerController {
    constructor(private readonly workerService: workerService) { }

    @Post('create-profile')
    createProfile(@Body() data: WorkerDTO): object {
        return this.workerService.createProfile(data);
    }

    @Put('edit-profile/:id')
    editProfile(@Param('id', ParseIntPipe) id: number, @Body() data: WorkerDTO): object {
        return this.workerService.editProfile(id, data);
    }

    @Put('change-password/:id')
    changePassword(@Param('id', ParseIntPipe) id: number, @Body('password') password: string): object {
        return this.workerService.changePassword(id, password);
    }

    @Delete('delete-account/:id')
    deleteAccount(@Param('id', ParseIntPipe) id: number): object {
        return this.workerService.deleteAccount(id);
    }

    @Put('accept-booking/:bookingId')
    acceptBooking(@Param('bookingId', ParseIntPipe) bookingId: number): object {
        return this.workerService.acceptBooking(bookingId);
    }

    @Put('reject-booking/:bookingId')
    rejectBooking(@Param('bookingId', ParseIntPipe) bookingId: number): object {
        return this.workerService.rejectBooking(bookingId);
    }

    @Put('start-job/:bookingId')
    startJob(@Param('bookingId', ParseIntPipe) bookingId: number): object {
        return this.workerService.startJob(bookingId);
    }

    @Put('end-job/:bookingId')
    endJob(@Param('bookingId', ParseIntPipe) bookingId: number): object {
        return this.workerService.endJob(bookingId);
    }

    @Get('earnings/:id')
    viewEarnings(@Param('id', ParseIntPipe) id: number): object {
        return this.workerService.viewEarnings(id);
    }

    @Put('availability/:id')
    updateAvailability(@Param('id', ParseIntPipe) id: number, @Body('status') status: string): object {
        return this.workerService.updateAvailability(id, status);
    }

    @Post('/create')
    createWorker(@Body() workerDto: WorkerDTO){
       return this.workerService.createWorker(workerDto);
    }
    @Put('update-phone/:id')
    updatePhone(@Param('id', ParseIntPipe) id: number,@Body() workerDto: WorkerDTO) {
       return this.workerService.updatePhone(id, workerDto.phone);
    }
    @Get('null-name')
    findNullNameWorkers() {
        return this.workerService.findWorkersWithNullName();
    }

    @Delete('delete/:id')
    deleteWorker(@Param('id', ParseIntPipe) id: number) {
        return this.workerService.deleteWorker(id);
    }
}
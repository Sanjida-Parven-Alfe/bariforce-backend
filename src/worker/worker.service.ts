import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';
import { Worker } from './entities/worker.entity';
import { Availability } from './entities/availability.entity';
import { Booking } from './entities/booking.entity';
import { Earning } from './entities/earning.entity';
import { PayoutMethod } from './entities/payout-method.entity';
//import { Review } from './entities/review.entity';
import { WorkerDTO, VerificationUploadDto, AvailabilitySlotDto, HolidayDto, PayoutRequestDto, PayoutMethodDto } from './worker.dto';
import * as bcrypt from 'bcryptjs';
import { platform } from 'os';

@Injectable()
export class workerService {
  constructor(
    @InjectRepository(Worker) private workerRepo: Repository<Worker>,
    @InjectRepository(Availability) private availabilityRepo: Repository<Availability>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Earning) private earningRepo: Repository<Earning>,
    @InjectRepository(PayoutMethod) private payoutMethodRepo: Repository<PayoutMethod>,
    //@InjectRepository(Review) private reviewRepo: Repository<Review>,
  ) {}

  async createProfile(data: WorkerDTO): Promise<Worker> {
    const existing = await this.workerRepo.findOne({
      where: [{ email: data.email }, { username: data.username }]
    });
    if (existing) throw new HttpException('Worker with this email/username already exists', HttpStatus.CONFLICT);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const worker = this.workerRepo.create({
      ...data,
      password: hashedPassword,
      isActive: true,
      verificationStatus: 'pending'
    });
    return this.workerRepo.save(worker);
  }

  async editProfile(id: number, data: WorkerDTO): Promise<Worker> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(worker, data);
    return this.workerRepo.save(worker);
  }

  async changePassword(id: number, newPassword: string): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    worker.password = await bcrypt.hash(newPassword, 10);
    await this.workerRepo.save(worker);
    return { message: 'Password changed successfully' };
  }

  async deleteAccount(id: number): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    worker.isActive = false;
    worker.deletedAt = new Date();
    await this.workerRepo.save(worker);
    return { message: 'Account deleted temporary (automaticaly delete after 30 days)' };
  }

  async acceptBooking(bookingId: number): Promise<object> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');
    
    booking.status = 'accepted';
    await this.bookingRepo.save(booking);
    return { message: 'Booking accepted', bookingId };
  }

  async rejectBooking(bookingId: number): Promise<object> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');
    
    booking.status = 'rejected';
    await this.bookingRepo.save(booking);
    return { message: 'Booking rejected', bookingId };
  }

  async startJob(bookingId: number): Promise<object> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'accepted') throw new BadRequestException('Booking must be accepted first');
    
    booking.status = 'started';
    booking.startedAt = new Date();
    await this.bookingRepo.save(booking);
    return { message: 'Job started', bookingId };
  }

  async endJob(bookingId: number): Promise<object> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'started') throw new BadRequestException('Job not started yet');
    
    booking.status = 'completed';
    booking.completedAt = new Date();
    await this.bookingRepo.save(booking);
    
    // platform fee
    const platformFee = booking.price * 0.1; // 10% platform fee
    const netAmount = booking.price - platformFee;
    const earning = this.earningRepo.create({
      bookingId: booking.id,
      workerId: booking.workerId,
      amount: booking.price,
      platformFee,
      netAmount,
      status: 'pending'
    });
    await this.earningRepo.save(earning);
    
    // Update worker total earnings
    const worker = await this.workerRepo.findOne({ where: { id: booking.workerId } });
    if (worker) {
      worker.totalEarnings += netAmount;
      await this.workerRepo.save(worker);
    }
    
    return { message: 'Job completed', bookingId, earningId: earning.id };
  }

  async viewEarnings(id: number): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    const earnings = await this.earningRepo.find({ where: { workerId: id } });
    const total = earnings.reduce((sum, e) => sum + e.netAmount, 0);
    return { workerId: id, totalEarnings: total, earnings };
  }

  async updateAvailability(id: number, status: string): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    worker.isActive = status === 'available';
    await this.workerRepo.save(worker);
    return { message: `Availability updated to ${status}`, workerId: id };
  }

  async createWorker(workerDto: WorkerDTO): Promise<Worker> {
    const hashedPassword = await bcrypt.hash(workerDto.password, 10);
    const worker = this.workerRepo.create({ ...workerDto, password: hashedPassword });
    return this.workerRepo.save(worker);
  }
   async updatePhone(id: number, phone: string): Promise<object> {
  const worker = await this.workerRepo.findOne({ where: { id } });
  if (!worker) throw new NotFoundException('Worker not found');
  worker.phone = phone;
  const updatedWorker = await this.workerRepo.save(worker);
  
  return {
    message: 'Phone updated successfully',
    worker: updatedWorker
  };
}
 /*
  async updatePhone(id: number, phone: string): Promise<Worker> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    worker.phone = phone;
    return this.workerRepo.save(worker);
  }*/

  /*async findWorkersWithNullName(): Promise<Worker[]> {
    return this.workerRepo.find({ where: { fullname: IsNull() } });
  }

  async deleteWorker(id: number): Promise<object> {
    const result = await this.workerRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Worker not found');
    return { message: 'Worker permanently deleted' };
  }


  async deactivateAccount(id: number, reason?: string): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    worker.isDeactivated = true;
    worker.deletedAt = new Date();
    await this.workerRepo.save(worker);
    
    // Auto-reject pending bookings
    await this.bookingRepo.update(
      { workerId: id, status: 'pending' },
      { status: 'rejected' }
    );
    
    return { message: 'Account deactivated (30-day grace period started)', reason };
  }

  async uploadVerification(id: number, dto: VerificationUploadDto): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    worker.verificationStatus = 'pending';
    await this.workerRepo.save(worker);
    // In real app: save document URL to a separate table
    return { message: 'Verification documents uploaded, pending admin approval', documentUrl: dto.documentUrl };
  }
*/
  async rescheduleBooking(bookingId: number, newDateTimeStr: string): Promise<object> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'accepted') {
      throw new BadRequestException('Can only reschedule accepted bookings');
    }
    
    booking.scheduledAt = new Date(newDateTimeStr);
    await this.bookingRepo.save(booking);
    return { message: 'Booking rescheduled', newDateTime: booking.scheduledAt };
  }

  async cancelBooking(bookingId: number, reason: string): Promise<object> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    
    const hoursUntilStart = (booking.scheduledAt.getTime() - Date.now()) / (1000 * 3600);
    let penalty = 0;
    if (hoursUntilStart < 24) {
      penalty = booking.price * 0.2;
    }
    
    booking.status = 'cancelled';
    await this.bookingRepo.save(booking);
    
    return { message: 'Booking cancelled', penalty };
  }

  async bulkAction(bookingIds: number[], action: string): Promise<object> {
    const results = [];
    for (const id of bookingIds) {
      try {
        if (action === 'accept') {
          results.push(await this.acceptBooking(id));
        } else if (action === 'reject') {
          results.push(await this.rejectBooking(id));
        }
      } catch (error) {
        results.push({ bookingId: id, error:'error'});
      }
    }
    return { message: `Bulk ${action} completed`, results };
  }

async getAvailability(workerId: number): Promise<object> {
  const slots = await this.availabilityRepo.find({
    where: { worker: { id: workerId } },
    order: { dayOfWeek: 'ASC', startTime: 'ASC' }
  });

  // Remove unwanted fields from each slot
  const filteredSlots = slots.map(slot => ({
    id: slot.id,
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    //isRecurring: slot.isRecurring,
    // specificDate and isBlocked are excluded
  }));

  return { workerId, slots: filteredSlots };
}

  async addAvailabilitySlot(workerId: number, dto: AvailabilitySlotDto): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');
    
    const slot = this.availabilityRepo.create({
      ...dto,
      worker,
      specificDate: dto.specificDate ? new Date(dto.specificDate) : null
    });
    await this.availabilityRepo.save(slot);
    return { message: 'Availability added', slot: {
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime
    } };
  }

  async updateAvailabilitySlot(slotId: number, dto: AvailabilitySlotDto): Promise<object> {
    const slot = await this.availabilityRepo.findOne({ where: { id: slotId } });
    if (!slot) throw new NotFoundException('Slot not found');
    
    Object.assign(slot, dto);
    if (dto.specificDate) slot.specificDate = new Date(dto.specificDate);
    await this.availabilityRepo.save(slot);
    return { message: 'Slot updated', slot };
  }

  async deleteAvailabilitySlot(slotId: number): Promise<object> {
    const result = await this.availabilityRepo.delete(slotId);
    if (result.affected === 0) throw new NotFoundException('Slot not found');
    return { message: 'Slot deleted' };
  }

  async addHoliday(workerId: number, dto: HolidayDto): Promise<object> {
    const holidayDate = new Date(dto.date);
    const slot = this.availabilityRepo.create({
      worker: { id: workerId },
      specificDate: holidayDate,
      isBlocked: true,
      isRecurring: false,
      startTime: '00:00',
      endTime: '23:59'
    });
    await this.availabilityRepo.save(slot);
    return { message: 'Holiday marked', date: dto.date, reason: dto.reason };
  }

  async getDetailedEarnings(workerId: number, startDate?: string, endDate?: string): Promise<object> {
    const whereCondition: any = { workerId };
    if (startDate && endDate) {
      whereCondition.paidAt = Between(new Date(startDate), new Date(endDate));
    }
    const earnings = await this.earningRepo.find({ where: whereCondition });
    const total = earnings.reduce((sum, e) => sum + e.netAmount, 0);
    return { workerId, total, earnings };
  }

  async requestPayout(workerId: number, dto: PayoutRequestDto): Promise<object> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');
    if (worker.totalEarnings < dto.amount) {
      throw new BadRequestException('Insufficient earnings');
    }
    if (dto.amount < 50) {
      throw new BadRequestException('Minimum payout is $50');
    }
    
    worker.totalEarnings -= dto.amount;
    await this.workerRepo.save(worker);
    
    // In real app: create a payout request record and notify admin
    return { message: 'Payout requested', amount: dto.amount, status: 'pending_approval' };
  }

  async updatePayoutMethod(workerId: number, dto: PayoutMethodDto): Promise<object> {
    let method = await this.payoutMethodRepo.findOne({ where: { worker: { id: workerId }, isDefault: true } });
    if (!method) {
      method = this.payoutMethodRepo.create({ worker: { id: workerId } });
    }
    method.type = dto.type;
    method.details = dto.details;
    method.isDefault = dto.isDefault;
    await this.payoutMethodRepo.save(method);
    return { message: 'Payout method updated', method };
  }

  /*async getReviews(workerId: number, rating?: number): Promise<object> {
    const where: any = { workerId };
    if (rating) where.rating = rating;
    const reviews = await this.reviewRepo.find({ where, order: { createdAt: 'DESC' } });
    // Calculate average rating
    const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    return { workerId, averageRating: avgRating, reviews };
  }

  async replyToReview(reviewId: number, replyText: string): Promise<object> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    review.reply = replyText;
    await this.reviewRepo.save(review);
    return { message: 'Reply added', reviewId, reply: replyText };
  }

  async requestReview(bookingId: number): Promise<object> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId }, relations: ['worker'] });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'completed') {
      throw new BadRequestException('Can only request review for completed bookings');
    }
    
    return { message: 'Review request sent to customer', bookingId };
  }*/
    async getBookingWithEarning(bookingId: number): Promise<any> {
  const booking = await this.bookingRepo.findOne({
    where: { id: bookingId },
    relations: ['earning']
  });
  if (!booking) throw new NotFoundException('Booking not found');

  // Return for my  output in postman
  return {
    id: booking.id,
    workerId: booking.workerId,
    serviceId: booking.serviceId,
    price: booking.price,
    status: booking.status /*,
    earning: booking.earning ? {
      amount: booking.earning.amount,
      platform:booking.earning.platformFee,
      netAmount: booking.earning.netAmount
    } : null*/
  };
}
}
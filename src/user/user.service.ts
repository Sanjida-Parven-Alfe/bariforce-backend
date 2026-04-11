import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserProfileEntity } from './userprofile.entity';
import { BookingEntity } from './booking.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
 
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepo: Repository<UserProfileEntity>,
    @InjectRepository(BookingEntity)
    private bookingRepo: Repository<BookingEntity>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}
 
  async searchService(name: string): Promise<object> {
    const results = await this.bookingRepo.find({
      where: { serviceName: Like(`%${name}%`) },
      relations: ['user'],
    });
    return { message: 'Searching for service: ' + name, results };
  }
 
  async createAccount(data: UserDTO): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
   
    const userToSave = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
 
    const profile = this.userProfileRepo.create({
      phone: data.phone,
      address: data.address,
    });
 
    userToSave.profile = profile;
 
    const savedUser = await this.userRepo.save(userToSave);
 
    try {
      await this.mailerService.sendMail({
        to: savedUser.email,
        subject: 'Welcome to Bariforce Customer Portal',
        text: 'Hello ' + savedUser.name + ', your account has been successfully created!',
      });
    } catch (e) {
      console.log('Error sending user email:', e);
    }
 
    return savedUser;
  }
 
  async signin(email: string, pass: string): Promise<any> {
    if (email && pass) {
      const user = await this.userRepo.findOneBy({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const payload = { sub: user.id, email: user.email };
        return { access_token: await this.jwtService.signAsync(payload) };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }
 
  async updateProfile(id: number, info: Partial<UserDTO>): Promise<object> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['profile'] });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
 
    if (info.name) user.name = info.name;
    if (info.email) user.email = info.email;
   
    if (info.address || info.phone) {
      if (!user.profile) {
         user.profile = this.userProfileRepo.create();
      }
      if (info.address) user.profile.address = info.address;
      if (info.phone) user.profile.phone = info.phone;
    }
 
    const updated = await this.userRepo.save(user);
    return { message: 'Profile updated successfully', user: updated };
  }
 
  async addToCart(userId: number, cartData: any): Promise<BookingEntity> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
 
    const booking = this.bookingRepo.create({
      serviceName: cartData.serviceName || 'Unknown Service',
      status: 'pending',
      user: user,
    });
 
    return await this.bookingRepo.save(booking);
  }
 
  uploadDocument(filename: string): object {
    return { message: 'PDF Document uploaded successfully', file: filename };
  }
 
  async cancelService(bookingId: number, userId: number): Promise<object> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user']
    });
 
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
   
    if (booking.user.id !== userId) {
      throw new UnauthorizedException('You do not own this booking');
    }
 
    await this.bookingRepo.delete(bookingId);
 
    return {
      bookingId: bookingId,
      message: 'Your service booking has been cancelled.',
    };
  }
 
  async updateBookingStatus(bookingId: number, status: string): Promise<object> {
    const booking = await this.bookingRepo.findOneBy({ id: bookingId });
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    booking.status = status;
    const updated = await this.bookingRepo.save(booking);
    return { message: 'Booking status updated successfully', booking: updated };
  }
 
  async getUserBookings(userId: number): Promise<BookingEntity[]> {
    return await this.bookingRepo.find({
      where: { user: { id: userId } }
    });
  }
}
 
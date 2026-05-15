import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AdminDTO } from './admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { AdminActivityEntity } from './adminactivity.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepo: Repository<AdminEntity>,
    @InjectRepository(AdminActivityEntity)
    private activityRepo: Repository<AdminActivityEntity>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  getHello(): object {
    return { message: 'hello world' };
  }

  async getAll(): Promise<AdminEntity[]> {
    return await this.adminRepo.find();
  }

  async getAdminByID(id: number): Promise<AdminEntity> {
    const data = await this.adminRepo.findOneBy({ id });
    if (data !== null) {
        return data;
    } else {
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }
  }

  async searchAdmin(name: string, id: number): Promise<object> {
    if (id) {
      return await this.adminRepo.findOneBy({ id: id });
    } else if (name) {
      return await this.adminRepo.find({ where: { fullName: name } });
    }
    return await this.adminRepo.find();
  }

  async addAdmin(data: AdminDTO): Promise<AdminEntity> {
    const salt = await bcrypt.genSalt();
    const hassedpassed = await bcrypt.hash(data.password, salt);
    data.password = hassedpassed;
    
    const savedAdmin = await this.adminRepo.save(data);

    try {
      await this.mailerService.sendMail({
        to: savedAdmin.email,
        subject: 'Welcome to Bariforce',
        text: 'Hello ' + savedAdmin.fullName + ', your admin account has been created!',
      });
    } catch (e) {
      console.log('Error sending email:', e);
    }

    return savedAdmin;
  }

  async signin(mydto: Partial<AdminDTO>): Promise<any> {
    if (mydto.email != null && mydto.password != null) {
        const mydata = await this.adminRepo.findOneBy({ email: mydto.email });
        if (!mydata) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(mydto.password, mydata.password);
        if (isMatch) {
            const payload = { sub: mydata.id, email: mydata.email };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    } else {
        throw new UnauthorizedException('Invalid credentials');
    }
  }

  uploadNID(filename: string): object {
    return {
      message: 'NID image uploaded successfully (Under 2MB)',
      file: filename,
    };
  }

  async updateAdmin(id: number, mydata: AdminDTO): Promise<any> {
    return await this.adminRepo.update(id, mydata);
  }

  async deleteAdmin(id: number): Promise<any> {
    return await this.adminRepo.delete(id);
  }

  async changeStatus(id: number, status: string): Promise<any> {
    await this.adminRepo.update(id, { status: status });
    return { message: 'Status updated' };
  }

  async getInactiveAdmins(): Promise<AdminEntity[]> {
    return await this.adminRepo.find({ where: { status: 'inactive' } });
  }

  async getOlderAdmins(): Promise<AdminEntity[]> {
    return await this.adminRepo.find({ where: { age: MoreThan(40) } });
  }

  async addAdminActivity(adminId: number, action: string): Promise<AdminActivityEntity> {
    const admin = await this.adminRepo.findOneBy({ id: adminId });
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }
    const act = this.activityRepo.create({ action: action, admin: admin });
    return await this.activityRepo.save(act);
  }

  async getAdminActivities(adminId: number): Promise<AdminActivityEntity[]> {
    return await this.activityRepo.find({
      where: { admin: { id: adminId } }
    });
  }

  async deleteAdminActivity(activityId: number): Promise<any> {
    return await this.activityRepo.delete(activityId);
  }
}


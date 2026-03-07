import { Injectable } from '@nestjs/common';
import { AdminDTO } from './admin.dto';

@Injectable()
export class AdminService {
  getHello(): object {
    return { message: 'hello world' };
  }
  getAll(): object {
    return { message: 'all admin' };
  }
  getAdminByID(id: number): object {
    return { id: id };
  }

  searchAdmin(name: string, id: number): object {
    return { name: name, id: id };
  }

  addAdmin(mydata: AdminDTO): object {
    return { message: 'Data Received', data: mydata };
  }

  uploadNID(filename: string): object {
    return {
      message: 'NID image uploaded successfully (Under 2MB)',
      file: filename,
    };
  }
  updateAdmin(id: number, mydata: AdminDTO): object {
    return { id: id, updatedData: mydata };
  }

  deleteAdmin(id: number): object {
    return { deleted: id };
  }
}

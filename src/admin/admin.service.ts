import { Injectable } from '@nestjs/common';

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

  addAdmin(mydata: object): object {
    return { message: 'Data Received', data: mydata };
  }

  updateAdmin(id: number, mydata: object): object {
    return { id: id, updatedData: mydata };
  }

  deleteAdmin(id: number): object {
    return { deleted: id };
  }
}

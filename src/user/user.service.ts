import { Injectable } from '@nestjs/common';
import { UserDTO } from './user.dto';
 
@Injectable()
export class UserService {
  searchService(name: string): object {
    return { message: 'Searching for service' + name, results: [] };
  }
 
  createAccount(data: UserDTO ): object {
    return { message: 'your account created', userData: data };
  }
 
  updateProfile(id: number, info: UserDTO ): object {
    return { id: id, message: 'Profile updated', updatedData: info };
  }
 
  addToCart(cartData: object): object {
    return { message: 'Service added to your booking list', cart: cartData };
  }
  
  uploadDocument(filename: string): object {
    return { message: 'PDF Document uploaded successfully', file: filename };
  }
 
  cancelService(bookingId: number): object {
    return {
      bookingId: bookingId,
      message: 'Your service booking has been cancelled.',
    };
  }
}
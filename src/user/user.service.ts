mport { Injectable } from '@nestjs/common';
 
@Injectable()
export class UserService {
  searchService(name: string): object {
    return { message: 'Searching for service' + name, results: [] };
  }
 
  createAccount(data: object): object {
    return { message: 'your account created', userData: data };
  }
 
  updateProfile(id: number, info: object): object {
    return { id: id, message: 'Profile updated', updatedData: info };
  }
 
  addToCart(cartData: object): object {
    return { message: 'Service added to your booking list', cart: cartData };
  }
 
  cancelService(bookingId: number): object {
    return {
      bookingId: bookingId,
      message: 'Your service booking has been cancelled.',
    };
  }
}
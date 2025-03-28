import { Injectable } from '@nestjs/common';
import { CreateItemOrderDto } from './dto/create-item-order.dto';
import { UpdateItemOrderDto } from './dto/update-item-order.dto';

@Injectable()
export class ItemOrderService {
  create(createItemOrderDto: CreateItemOrderDto) {
    return 'This action adds a new itemOrder';
  }

  findAll() {
    return `This action returns all itemOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemOrder`;
  }

  update(id: number, updateItemOrderDto: UpdateItemOrderDto) {
    return `This action updates a #${id} itemOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemOrder`;
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) { }

  @Post()
  handleCreateItem(@Body() item) {
    return this.itemsService.create(item.name, item.owner);
  }

  @Get()
  handleGetItems(@Query() item) {
    return this.itemsService.getItems(item)
  }

  @Get(":id")
  handleGetItem(@Param("id") id: string) {
    return this.itemsService.getItem(id)
  }
}
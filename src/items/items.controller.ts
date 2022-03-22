import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) { }

  @Post()
  async handleCreateItem(@Body() item) {
    try {
      return await this.itemsService.create(item.name, item.owner);
    } catch (error) {
      const errorResponseMap = {
        "USER_NOT_FOUND_ERROR": {
          status: HttpStatus.BAD_REQUEST,
          message: "Owner not found"
        }
      }
      const e = errorResponseMap[error.message]
      throw new HttpException(e.message, e.status)
    }
  }

  @Get()
  handleGetItems(@Query() item) {
    return this.itemsService.find(item)
  }

  @Get(":id")
  handleGetItem(@Param("id") id: string) {
    return this.itemsService.findItemByIdOrProps(id)
  }
}
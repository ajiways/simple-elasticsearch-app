import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/product.create.dto';
import { SearchService } from './search.service';

@Controller()
export class AppController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  testSearch(@Query('search') data: string) {
    return this.searchService.search(data);
  }

  @Post('add')
  @UsePipes(new ValidationPipe())
  addTest(@Body() data: CreateProductDto) {
    return this.searchService.addProduct(data);
  }

  @Post('delete')
  deleteProduct(@Body() data: { id: string }) {
    return this.searchService.removeProduct(data);
  }

  @Get()
  @Render('index')
  root() {
    return;
  }
}

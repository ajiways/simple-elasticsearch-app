import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 16)
  name: string;

  @IsNumber()
  @Min(1)
  price: number;
}

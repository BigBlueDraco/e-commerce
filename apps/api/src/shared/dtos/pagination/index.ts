import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsEnum, IsString, Max } from 'class-validator';
export namespace Base {
  export namespace Inputs {}
  export namespace Args {
    export type FindMany = {
      skip?: number;
      take?: number;
    };
  }
  export type PaginationResponse = {
    data: unknown;
    meta: PaginationMeta;
  };
  export type PaginationMeta = {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}
export class PaginationQuery {
  @ApiPropertyOptional({
    type: Number,
    description: 'Optional page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Optional number of items per page',
    example: 10,
  })
  @Max(20)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  perPage?: number;
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export class FindManyDto extends PaginationQuery {
  @ApiPropertyOptional({
    type: String,
    description: 'Optional field name to order by (e.g., "name", "createdAt")',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Optional sort order (default: asc)',
    example: SortOrder.Asc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.Asc; // Default to ascending order
}

export class PaginationMetaDto implements Base.PaginationMeta {
  @ApiProperty({ type: Number, description: 'Total number of items' })
  total!: number;

  @ApiProperty({ type: Number, description: 'The index of the last page' })
  lastPage!: number;

  @ApiProperty({ type: Number, description: 'The index of the current page' })
  currentPage!: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  perPage!: number;

  @ApiProperty({
    type: Number,
    description: 'The index of the previous page',
    nullable: true,
  })
  prev!: number | null;

  @ApiProperty({
    type: Number,
    description: 'The index of the next page',
    nullable: true,
  })
  next!: number | null;
}
export class PaginationDto<T> implements Base.PaginationResponse {
  data!: T[];
  @ApiProperty({ description: 'Pagination metadata', type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}

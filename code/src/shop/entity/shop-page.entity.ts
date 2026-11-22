import { Expose, Type } from 'class-transformer';
import { IsDefined, IsArray, ValidateNested } from 'class-validator';

import { ShopEntity } from './shop.entity';
import { ShopPageMetaEntity } from './shop-page-meta.entity';

export class ShopPageEntity {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShopEntity)
  items: ShopEntity[];

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ShopPageMetaEntity)
  meta: ShopPageMetaEntity;
}

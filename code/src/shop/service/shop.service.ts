import { Injectable } from '@nestjs/common';

import { validateEntity } from '../../common/validate-entity';
import { ShopEntity } from '../entity/shop.entity';
import { ShopPageEntity } from '../entity/shop-page.entity';
import { ShopPageMetaEntity } from '../entity/shop-page-meta.entity';
import { ShopRepository } from '../repository/shop.repository';
import { CreateShopCommand } from './command/create-shop.command';
import { UpdateShopCommand } from './command/update-shop.command';

@Injectable()
export class ShopService {
  constructor(private readonly repository: ShopRepository) {}

  async getAll(limit: number, nextToken?: string, term?: string): Promise<ShopPageEntity> {
    const result = await this.repository.getAll(limit, nextToken, term);
    return validateEntity(
      Object.assign(new ShopPageEntity(), {
        items: result.items.map(ShopEntity.fromModel),
        meta: Object.assign(new ShopPageMetaEntity(), result.meta),
      }),
    );
  }

  async getByUuid(uuid: string): Promise<ShopEntity> {
    return validateEntity(ShopEntity.fromModel(await this.repository.getByUuid(uuid)));
  }

  async create(command: CreateShopCommand): Promise<ShopEntity> {
    return validateEntity(ShopEntity.fromModel(await this.repository.create(command)));
  }

  async update(command: UpdateShopCommand): Promise<ShopEntity> {
    return validateEntity(ShopEntity.fromModel(await this.repository.update(command)));
  }
}

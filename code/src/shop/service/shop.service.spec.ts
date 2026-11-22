import 'reflect-metadata';

import { ShopEntity } from '../entity/shop.entity';
import { ShopRepository } from '../repository/shop.repository';
import { ShopModel } from '../shop.model';
import { ShopService } from './shop.service';

const model = () =>
  Object.assign(new ShopModel(), {
    uuid: 'a7bded5f-24ee-4d2a-b13f-2436f4f5337f',
    name: 'Магазин',
    version: 1,
    legalForm: null,
    contacts: [],
    addresses: [],
    createdAt: new Date('2026-11-22T12:00:00Z'),
    updatedAt: new Date('2026-11-22T12:00:00Z'),
  });

describe('ShopService read contracts', () => {
  const repository = { getAll: jest.fn(), getByUuid: jest.fn() };
  const service = new ShopService(repository as unknown as ShopRepository);

  beforeEach(() => jest.resetAllMocks());

  it('returns validated items and preserves the cursor through the service boundary', async () => {
    repository.getAll.mockResolvedValue({ items: [model()], meta: { limit: 2, nextToken: 'next-page' } });
    const page = await service.getAll(2, 'previous-page', 'магазин');

    expect(repository.getAll).toHaveBeenCalledWith(2, 'previous-page', 'магазин');
    expect(Object.keys(page).sort()).toEqual(['items', 'meta']);
    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toBeInstanceOf(ShopEntity);
    expect(page.meta).toEqual({ limit: 2, nextToken: 'next-page' });
  });

  it('returns an explicit terminal cursor for an empty list', async () => {
    repository.getAll.mockResolvedValue({ items: [], meta: { limit: 2, nextToken: null } });
    await expect(service.getAll(2)).resolves.toEqual({ items: [], meta: { limit: 2, nextToken: null } });
  });

  it('returns a single shop directly without list metadata', async () => {
    const shop = model();
    repository.getByUuid.mockResolvedValue(shop);
    const result = await service.getByUuid(shop.uuid);
    expect(result).toBeInstanceOf(ShopEntity);
    expect(result.uuid).toBe(shop.uuid);
    expect(result).not.toHaveProperty('meta');
    expect(result).not.toHaveProperty('items');
  });
});

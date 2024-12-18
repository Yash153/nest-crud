import { Test, TestingModule } from '@nestjs/testing';
import { DbPopulateService } from './db-populate.service';

describe('DbPopulateService', () => {
  let service: DbPopulateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbPopulateService],
    }).compile();

    service = module.get<DbPopulateService>(DbPopulateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

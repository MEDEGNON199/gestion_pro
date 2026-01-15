import { Test, TestingModule } from '@nestjs/testing';
import { MembresProjetsService } from './membres-projets.service';

describe('MembresProjetsService', () => {
  let service: MembresProjetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembresProjetsService],
    }).compile();

    service = module.get<MembresProjetsService>(MembresProjetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

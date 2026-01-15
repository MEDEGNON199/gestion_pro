import { Test, TestingModule } from '@nestjs/testing';
import { EtiquettesService } from './etiquettes.service';

describe('EtiquettesService', () => {
  let service: EtiquettesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtiquettesService],
    }).compile();

    service = module.get<EtiquettesService>(EtiquettesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

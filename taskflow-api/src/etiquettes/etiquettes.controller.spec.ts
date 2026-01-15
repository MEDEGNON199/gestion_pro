import { Test, TestingModule } from '@nestjs/testing';
import { EtiquettesController } from './etiquettes.controller';

describe('EtiquettesController', () => {
  let controller: EtiquettesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtiquettesController],
    }).compile();

    controller = module.get<EtiquettesController>(EtiquettesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

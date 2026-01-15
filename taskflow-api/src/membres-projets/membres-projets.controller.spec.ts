import { Test, TestingModule } from '@nestjs/testing';
import { MembresProjetsController } from './membres-projets.controller';

describe('MembresProjetsController', () => {
  let controller: MembresProjetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembresProjetsController],
    }).compile();

    controller = module.get<MembresProjetsController>(MembresProjetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

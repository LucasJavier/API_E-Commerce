import { Test, TestingModule } from '@nestjs/testing';
import { AdminWebSocketGateway } from './admin-web-socket.gateway';

describe('AdminWebSocketGateway', () => {
  let gateway: AdminWebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminWebSocketGateway],
    }).compile();

    gateway = module.get<AdminWebSocketGateway>(AdminWebSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

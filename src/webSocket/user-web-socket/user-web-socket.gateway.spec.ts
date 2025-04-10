import { Test, TestingModule } from '@nestjs/testing';
import { UserWebSocketGateway } from './user-web-socket.gateway';

describe('UserWebSocketGateway', () => {
  let gateway: UserWebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWebSocketGateway],
    }).compile();

    gateway = module.get<UserWebSocketGateway>(UserWebSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

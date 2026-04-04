import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MollieOAuthController } from './mollie-oauth.controller';
import { UsersService } from '../users/users.service';

describe('MollieOAuthController', () => {
  let controller: MollieOAuthController;
  let jwtService: { sign: jest.Mock; verify: jest.Mock };
  let usersService: { connectMollie: jest.Mock };

  beforeEach(async () => {
    jwtService = { sign: jest.fn(), verify: jest.fn() };
    usersService = { connectMollie: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MollieOAuthController],
      providers: [
        { provide: JwtService, useValue: jwtService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<MollieOAuthController>(MollieOAuthController);

    process.env.MOLLIE_CLIENT_ID = 'test_client';
    process.env.MOLLIE_CLIENT_SECRET = 'test_secret';
    process.env.BACKEND_URL = 'http://localhost:3000';
    process.env.FRONTEND_URL = 'http://localhost:3001';
    process.env.MOLLIE_CONNECT_MOCK = 'false';
  });

  afterEach(() => jest.restoreAllMocks());

  describe('callback', () => {
    it('exchanges code, fetches org ID, calls connectMollie, returns success URL', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1' });

      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'tok_123' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'org_abc' }),
        }) as any;

      const result = await controller.callback('code_xyz', 'state_jwt', undefined as any);

      expect(usersService.connectMollie).toHaveBeenCalledWith('user-1', 'org_abc');
      expect(result).toEqual({ url: 'http://localhost:3001/auth/mollie/return?success=true' });
    });

    it('returns error URL when state JWT is invalid', async () => {
      jwtService.verify.mockImplementation(() => { throw new Error('invalid'); });

      const result = await controller.callback('code_xyz', 'bad_state', undefined as any);

      expect(usersService.connectMollie).not.toHaveBeenCalled();
      expect(result).toEqual({
        url: 'http://localhost:3001/auth/mollie/return?error=mollie_connect_failed',
      });
    });

    it('returns error URL when Mollie token exchange fails', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1' });
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: false }) as any;

      const result = await controller.callback('code_xyz', 'state_jwt', undefined as any);

      expect(result).toEqual({
        url: 'http://localhost:3001/auth/mollie/return?error=mollie_connect_failed',
      });
    });

    it('returns error URL when Mollie returns error param', async () => {
      const result = await controller.callback(
        undefined as any,
        undefined as any,
        'access_denied',
      );

      expect(result).toEqual({
        url: 'http://localhost:3001/auth/mollie/return?error=mollie_connect_failed',
      });
    });
  });

  describe('connect with MOLLIE_CONNECT_MOCK=true', () => {
    it('immediately calls connectMollie with mock org ID and returns success URL', async () => {
      process.env.MOLLIE_CONNECT_MOCK = 'true';

      const result = await controller.connect({ id: 'user-1' });

      expect(usersService.connectMollie).toHaveBeenCalledWith('user-1', 'mock_org_user-1');
      expect(result).toEqual({ url: 'http://localhost:3001/auth/mollie/return?success=true' });
    });
  });
});

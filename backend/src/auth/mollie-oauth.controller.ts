import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth/mollie')
export class MollieOAuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Get('connect')
  @Redirect()
  async connect(@CurrentUser() user: { id: string }) {
    if (process.env.MOLLIE_CONNECT_MOCK === 'true') {
      await this.usersService.connectMollie(user.id, `mock_org_${user.id}`);
      return { url: `${process.env.FRONTEND_URL}/auth/mollie/return?success=true` };
    }

    const state = this.jwtService.sign({ sub: user.id }, { expiresIn: '5m' });
    const params = new URLSearchParams({
      client_id: process.env.MOLLIE_CLIENT_ID!,
      redirect_uri: `${process.env.BACKEND_URL}/auth/mollie/callback`,
      scope: 'organizations.read',
      response_type: 'code',
      state,
    });

    return { url: `https://my.mollie.com/oauth2/authorize?${params}` };
  }

  @Public()
  @Get('callback')
  @Redirect()
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
  ) {
    const failUrl = `${process.env.FRONTEND_URL}/auth/mollie/return?error=mollie_connect_failed`;

    if (error || !code || !state) {
      return { url: failUrl };
    }

    try {
      const payload = this.jwtService.verify<{ sub: string }>(state);
      const userId = payload.sub;

      const tokenRes = await fetch('https://api.mollie.com/oauth2/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${process.env.BACKEND_URL}/auth/mollie/callback`,
          client_id: process.env.MOLLIE_CLIENT_ID!,
          client_secret: process.env.MOLLIE_CLIENT_SECRET!,
        }),
      });

      if (!tokenRes.ok) return { url: failUrl };

      const tokenData = (await tokenRes.json()) as { access_token: string };

      const orgRes = await fetch('https://api.mollie.com/v2/organizations/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!orgRes.ok) return { url: failUrl };

      const orgData = (await orgRes.json()) as { id: string };
      await this.usersService.connectMollie(userId, orgData.id);

      return { url: `${process.env.FRONTEND_URL}/auth/mollie/return?success=true` };
    } catch {
      return { url: failUrl };
    }
  }
}

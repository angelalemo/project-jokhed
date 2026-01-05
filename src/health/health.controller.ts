import { Controller, Get, Head, HttpCode } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  @HttpCode(200)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Head()
  @HttpCode(200)
  checkHealth() {
    return;
  }
}
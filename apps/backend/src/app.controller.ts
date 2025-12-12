import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('favicon.ico')
  @ApiExcludeEndpoint()
  getFavicon() {
    return '';
  }

  @Get()
  @Redirect('/api/docs')
  getHello() {
    // Redirects to API documentation
  }
}

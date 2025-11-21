import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    // Allow skipping DB connect in environments where DB is not reachable
    if (process.env.SKIP_DB_CONNECT === 'true') {
      this.logger.warn('Skipping Prisma $connect because SKIP_DB_CONNECT=true');
      return;
    }

    try {
      await this.$connect();
    } catch (error) {
      // Log and continue so the container can start; fix DB connectivity via env vars
      this.logger.error('Prisma $connect failed — the application will continue but DB operations will fail until DB is reachable.', error as any);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      this.logger.warn('Prisma $disconnect failed', error as any);
    }
  }
}

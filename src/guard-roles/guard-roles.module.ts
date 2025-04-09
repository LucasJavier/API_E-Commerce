import { Module } from '@nestjs/common';
import { RolesGuard } from './guard-roles.guard';

@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class GuardRolesModule {}
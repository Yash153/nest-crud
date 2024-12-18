import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget])],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [TypeOrmModule],
})
export class BudgetModule {}

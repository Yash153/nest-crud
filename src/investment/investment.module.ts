import { Module } from '@nestjs/common';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './investment.entity';
import { BudgetModule } from 'src/budget/budget.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment]),
    BudgetModule
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService],
  exports: [TypeOrmModule]
})
export class InvestmentModule {}

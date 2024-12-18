import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetModule } from './budget/budget.module';
import { InvestmentModule } from './investment/investment.module';
import { Budget } from './budget/budget.entity';
import { Investment } from './investment/investment.entity';
import { DbPopulateService } from './db-populate/db-populate.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'merito.db',
        entities: [Budget, Investment],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([Budget]),
    BudgetModule,
    InvestmentModule,
  ],
  providers: [DbPopulateService],
})
export class AppModule {}

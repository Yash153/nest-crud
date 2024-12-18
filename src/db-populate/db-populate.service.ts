import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Budget } from 'src/budget/budget.entity';
import { Investment } from 'src/investment/investment.entity';

@Injectable()
export class DbPopulateService {

    constructor(
        @InjectRepository(Budget)
        private readonly budgetRepository: Repository<Budget>,
        @InjectRepository(Investment)
        private readonly investmentRepository: Repository<Investment>,
      ) {}
    
      async onApplicationBootstrap() {
        await this.seedBudgetData();
        await this.seedInvestmentData();
      }
    
      async seedBudgetData() {
        const budgetFilePath = 'data/budget.csv';
    
        const count = await this.budgetRepository.count();
        if (count > 0) {
          return;
        }
    
        const budgets = [];
    
        return new Promise<void>((resolve, reject) => {
          fs.createReadStream(budgetFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
              budgets.push({
                amount: parseFloat(row['Amount']),
                timePeriod: row['Time Period'] || null,
                sector: row['Sector'] || null,
              });
            })
            .on('end', async () => {
              await this.budgetRepository.save(budgets);
              resolve();
            })
            .on('error', (error) => {
              console.error('Error seeding budget data:', error);
              reject(error);
            });
        });
      }
    
      async seedInvestmentData() {
        const investmentFilePath = 'data/investments.csv';
    
        const count = await this.investmentRepository.count();
        if (count > 0) {
          return;
        }
    
        console.log('Seeding Investment data...');
        const investments = [];
    
        return new Promise<void>((resolve, reject) => {
          fs.createReadStream(investmentFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
              investments.push({
                date: row['Date'], 
                amount: parseFloat(row['Amount']),
                sector: row['Sector'],
              });
            })
            .on('end', async () => {
              // Save all rows to the database
              await this.investmentRepository.save(investments);
              resolve();
            })
            .on('error', (error) => {
              reject(error);
            });
        });
      }
      

}

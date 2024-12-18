import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "src/budget/budget.entity";
import { Repository } from "typeorm";
import { Investment } from "./investment.entity";
import { InvestmentValidator } from "./Validator";

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Budget) private budgetRepo: Repository<Budget>,
    @InjectRepository(Investment) private investmentRepo: Repository<Investment>
  ) {}


  findAllInvestments() {
    return this.investmentRepo.find();
  }

  async findInvestmentsThatPassBudget() {
    let investments: any = await this.investmentRepo.find();
    const violations = await this.findInvestmentsThatViolateBudget();

    const violatedIds = new Set(violations.map((inv) => inv.id));
    const validInvestments = investments.filter((investment) => !violatedIds.has(investment.id));

    return validInvestments
  }

  async findInvestmentsThatViolateBudget() {
    let investments: any = await this.investmentRepo.find();
    let budgets: any = await this.budgetRepo.find();
    
    const validator = new InvestmentValidator(budgets);
    const violatedInvestments = validator.validateInvestments(investments);
    return violatedInvestments;

  }

  async findAllInvestmentsSorted(sortBy?: string): Promise<Investment[]> {
    const validSortColumns = ["id", "date", "amount", "sector"];

    if (sortBy && !validSortColumns.includes(sortBy)) {
      throw new BadRequestException(`Invalid sortBy column: ${sortBy}`);
    }

    const sortColumn = sortBy || "id";

    return this.investmentRepo.find({
      order: {
        [sortColumn]: "ASC",
      },
    });
  }

}

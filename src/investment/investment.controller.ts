import { Controller, Get, Query } from "@nestjs/common";
import { InvestmentService } from "./investment.service";
import { Investment } from "./investment.entity";

@Controller("investments")
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Get()
  async findAllSorted(
    @Query("sortBy") sortBy?: string
  ): Promise<Investment[]> {
    return this.investmentService.findAllInvestmentsSorted(sortBy);
  }

  @Get("valid")
  findValid() {
    return this.investmentService.findInvestmentsThatPassBudget();
  }

  @Get("violations")
  findInvalidValid() {
    return this.investmentService.findInvestmentsThatViolateBudget();
  }
}

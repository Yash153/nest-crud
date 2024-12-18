import { Budget } from "src/budget/budget.entity";
import { Investment } from "./investment.entity";

interface Violation {
  investmentId: number;
  reason: string;
}

export class InvestmentValidator {
  private budgets: Budget[];
  private months: number[] = [];
  private yearlyLimit: number = 1e9;

  constructor(budgets: Budget[]) {
    this.budgets = budgets;
    budgets.forEach((budget: Budget) => {
      if (budget.timePeriod === "Month") {
        for (let i = 0; i <= 12; i++) {
          this.months.push(budget.amount);
        }
      }
      if (budget.timePeriod === "Year") this.yearlyLimit = budget.amount;
    });
  }

  private getTimePeriodKey(date: Date, periodType: string): string {
    switch (periodType) {
      case "Month":
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
      case "Quarter":
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `${date.getFullYear()}-Q${quarter}`;
      case "Year":
        return `${date.getFullYear()}`;
      case null:
        return `${date.getFullYear()}`;
    }
  }

  validateInvestments(investments: Investment[]): Investment[] {
    const violations: Investment[] = [];
    const sectorPeriodTracker = new Map<string, Investment[]>();

    const sortedInvestments = [...investments].sort(
      (a, b) =>
        this.convertDateStringToDesiredFormat(a.date).getTime() -
        this.convertDateStringToDesiredFormat(b.date).getTime()
    );

    for (let investment of sortedInvestments) {
      const budgetRule = this.budgets.find(
        (b) => b.sector === investment.sector
      );

      const periodKey = this.getTimePeriodKey(
        this.convertDateStringToDesiredFormat(investment.date),
        budgetRule ? budgetRule.timePeriod : "Year"
      );

      const sectorPeriodKey = `${investment.sector}_${periodKey}`;

      const periodInvestments = sectorPeriodTracker.get(sectorPeriodKey) || [];

      const cumulativeAmount =
        periodInvestments.reduce((sum, inv) => sum + inv.amount, 0) +
        investment.amount;

      if (budgetRule && investment.amount > budgetRule.amount) {
        violations.push(investment);
        continue;
      }

      if (budgetRule && cumulativeAmount > budgetRule.amount) {
        violations.push(investment);
        continue;
      }

      let monthIndex = parseInt(investment.date.split("/")[1]);
      if (
        this.months[monthIndex] - investment.amount < 0 ||
        this.months[monthIndex] < 0
      ) {
        violations.push(investment);
        continue;
      } else {
        this.months[monthIndex] = this.months[monthIndex] - investment.amount;
      }

      if (this.yearlyLimit - investment.amount < 0) {
        violations.push(investment);
        continue;
      } else {
        this.yearlyLimit -= investment.amount;
      }
      sectorPeriodTracker.set(sectorPeriodKey, [
        ...periodInvestments,
        investment,
      ]);
    }

    return violations;
  }

  convertDateStringToDesiredFormat(dateString: string): Date | null {
    const dateParts = dateString.split("/");
    if (dateParts.length !== 3) {
      console.warn("Invalid date string format:", dateString);
      return null;
    }

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month, day);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateString);
      return null;
    }

    return date;
  }
}

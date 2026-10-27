import { describe, expect, it } from "vitest";
import { calculateWorkingCapital, DEFAULT_WORKING_CAPITAL_DAYS } from "../ktno";
import { IncomeStatementPeriod } from "../types";

describe("Working Capital Module (KTNO)", () => {
  const dummyIncomeStatements: IncomeStatementPeriod[] = [
    {
      year: 0,
      ipc: 0.0145,
      salesGrowth: 0.1,
      taxRate: 0.32,
      revenues: 115894320,
      directLaborCost: 71323826.88,
      directMaterialsCost: 19642280,
      otherDirectCosts: 0,
      totalCostOfSales: 90966106.88,
      operatingExpenses: 10800000,
      totalCostAndExpenses: 101766106.88,
      depreciation: 2868000,
      operatingProfitBeforeTax: 11260213.12,
      incomeTax: 3603268.2,
      netIncome: 7656944.92,
    },
    {
      year: 1,
      ipc: 0.036,
      salesGrowth: 0.1,
      taxRate: 0.31,
      revenues: 132073167.072,
      directLaborCost: 73891484.65,
      directMaterialsCost: 22384342.29,
      otherDirectCosts: 0,
      totalCostOfSales: 96275826.93568,
      operatingExpenses: 11188800,
      totalCostAndExpenses: 107464626.94,
      depreciation: 2868000,
      operatingProfitBeforeTax: 21740540.14,
      incomeTax: 6739567.44,
      netIncome: 15000972.69,
    },
  ];

  it("calculates accounts receivable (CxC), inventory and accounts payable (CxP)", () => {
    const result = calculateWorkingCapital(dummyIncomeStatements, DEFAULT_WORKING_CAPITAL_DAYS);

    expect(result).toHaveLength(2);

    // Year 0
    // CxC = (60 / 360) * 115,894,320 = 19,315,720
    expect(result[0]!.cxc).toBe(19315720);
    // Inventories = (90 / 360) * 90,966,106.88 = 22,741,526.72
    expect(result[0]!.inventories).toBeCloseTo(22741526.72, 2);
    // CxP = (60 / 360) * 90,966,106.88 = 15,161,017.81
    expect(result[0]!.cxp).toBeCloseTo(15161017.81, 2);
    // KTNO = CxC + Inv - CxP = 26,896,228.91
    expect(result[0]!.ktno).toBeCloseTo(26896228.91, 2);
    // Delta KTNO = KTNO_0 - 0 = 26,896,228.91
    expect(result[0]!.deltaKtno).toBeCloseTo(26896228.91, 2);

    // Year 1
    expect(result[1]!.cxc).toBeCloseTo(22012194.51, 2);
    expect(result[1]!.inventories).toBeCloseTo(24068956.73, 2);
    expect(result[1]!.cxp).toBeCloseTo(16045971.16, 2);
    expect(result[1]!.ktno).toBeCloseTo(30035180.09, 2);
    // Delta KTNO = KTNO_1 - KTNO_0 = 3,138,951.18
    expect(result[1]!.deltaKtno).toBeCloseTo(3138951.18, 2);
  });
});

import { describe, expect, it } from "vitest";
import {
  calculateFreeCashFlow,
  calculateNPV,
  calculateExcelNPV,
  calculateIRR,
  evaluateViability,
} from "../cash-flow";
import { IncomeStatementPeriod, WorkingCapitalPeriod } from "../types";

describe("Cash Flow Module (FCL, TIR, VPN, Viability)", () => {
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
      revenues: 132073167.07,
      directLaborCost: 73891484.65,
      directMaterialsCost: 22384342.29,
      otherDirectCosts: 0,
      totalCostOfSales: 96275826.94,
      operatingExpenses: 11188800,
      totalCostAndExpenses: 107464626.94,
      depreciation: 2868000,
      operatingProfitBeforeTax: 21740540.14,
      incomeTax: 6739567.44,
      netIncome: 15000972.69,
    },
  ];

  const dummyWorkingCapital: WorkingCapitalPeriod[] = [
    {
      year: 0,
      cxc: 19315720,
      inventories: 22741526.72,
      cxp: 15161017.81,
      ktno: 26896228.91,
      deltaKtno: 26896228.91,
    },
    {
      year: 1,
      cxc: 22012194.51,
      inventories: 24068956.73,
      cxp: 16045971.16,
      ktno: 30035180.09,
      deltaKtno: 3138951.18,
    },
  ];

  it("calculates Free Cash Flow indirect method (EBITDA, Gross Flow, FCL)", () => {
    const fcl = calculateFreeCashFlow(dummyIncomeStatements, dummyWorkingCapital, 14340000);

    expect(fcl).toHaveLength(2);

    // Year 0
    // EBITDA = Net Income (7,656,944.92) + Dep (2,868,000) + Tax (3,603,268.20) = 14,128,213.12
    expect(fcl[0]!.ebitda).toBeCloseTo(14128213.12, 2);
    // Gross Cash Flow = EBITDA - Tax = 10,524,944.92
    expect(fcl[0]!.grossCashFlow).toBeCloseTo(10524944.92, 2);
    // Delta KTNO = 26,896,228.91
    expect(fcl[0]!.deltaKtno).toBeCloseTo(26896228.91, 2);
    // Capex = 14,340,000
    expect(fcl[0]!.capex).toBe(14340000);
    // FCL = Gross - DeltaKTNO - Capex = 10,524,944.92 - 26,896,228.91 - 14,340,000 = -30,711,283.99
    expect(fcl[0]!.freeCashFlow).toBeCloseTo(-30711283.99, 2);

    // Year 1
    // EBITDA = 15,000,972.69 + 2,868,000 + 6,739,567.44 = 24,608,540.13
    expect(fcl[1]!.ebitda).toBeCloseTo(24608540.13, 2);
    // Gross Flow = 17,868,972.69
    expect(fcl[1]!.grossCashFlow).toBeCloseTo(17868972.69, 2);
    // FCL = 17,868,972.69 - 3,138,951.18 - 0 = 14,730,021.51
    expect(fcl[1]!.freeCashFlow).toBeCloseTo(14730021.51, 2);
  });

  it("calculates Excel-compatible NPV matching Excel function NPV(10%, range)", () => {
    const cashFlows = [
      -30711283.985066663,
      14730021.510754146,
      22877591.264839403,
      32264896.276663683,
      43007558.626034431,
      55375970.998208724,
    ];

    const excelNpv = calculateExcelNPV(0.1, cashFlows);
    expect(excelNpv).toBeCloseTo(81442455.82, 2);

    const standardNpv = calculateNPV(0.1, cashFlows, "standard");
    expect(standardNpv).toBeCloseTo(89586701.4, 2);
  });

  it("calculates IRR accurately for high-yield multi-year cash flow series", () => {
    const cashFlows = [
      -30711283.985066663,
      14730021.510754146,
      22877591.264839403,
      32264896.276663683,
      43007558.626034431,
      55375970.998208724,
    ];

    const irr = calculateIRR(cashFlows);
    expect(irr).toBeCloseTo(0.73116, 4); // 73.12%
  });

  it("evaluates viability correctly", () => {
    const viability = evaluateViability(0.7312, 81442455.82, 0.1);
    expect(viability.isIrrViable).toBe(true);
    expect(viability.isNpvViable).toBe(true);
    expect(viability.isOverallViable).toBe(true);
    expect(viability.irrStatus).toBe("VIABLE");
    expect(viability.npvStatus).toBe("VIABLE");
    expect(viability.overallStatus).toBe("VIABLE");
  });

  it("detects inviable projects", () => {
    const viability = evaluateViability(0.05, -1000000, 0.1);
    expect(viability.isIrrViable).toBe(false);
    expect(viability.isNpvViable).toBe(false);
    expect(viability.isOverallViable).toBe(false);
    expect(viability.irrStatus).toBe("INVIABLE");
    expect(viability.npvStatus).toBe("INVIABLE");
    expect(viability.overallStatus).toBe("INVIABLE");
  });
});

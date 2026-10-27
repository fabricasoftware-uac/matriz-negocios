import { describe, expect, it } from "vitest";
import { runFinancialEngine } from "../index";
import { FinancialEngineInput } from "../types";

/**
 * Full End-to-End Benchmark Test against Jorge Orozco's Excel Model:
 * "Formato para evaluación de proyectos(Jorge_Orozco).xlsm"
 */
describe("Excel Benchmark Integration Test - Jorge Orozco Project Model", () => {
  const jorgeOrozcoInput: FinancialEngineInput = {
    // 1. Revenues (Base Sheet: Rows 11-13)
    revenues: [
      { name: "Afiliación", quantity: 20, unitPrice: 482893 },
      { name: "Asesoria inicial", quantity: 20, unitPrice: 482893 },
      { name: "Canon de mantenimiento de la página", quantity: 20, unitPrice: 4828930 },
    ],

    // 2. Payroll (Base Sheet: Rows 19-35)
    payrollConfig: {
      smlmv: 1160000,
      auxilioTransporte: 140606,
      healthEmployeeRate: 0.04,
      pensionEmployeeRate: 0.04,
      primaDays: 30,
      cesantiasDays: 30,
      interesesCesantiasRate: 0.12,
      vacacionesDays: 30,
    },
    positions: [
      { role: "Administrador", headcount: 1 },
      { role: "Contador", headcount: 1 },
      { role: "Jurídico", headcount: 1 },
      { role: "Comunicaciones", headcount: 1 },
    ],

    // 3. Direct Materials / Supplies (Base Sheet: Rows 38-39)
    directSupplies: [
      { name: "Distribución", quantity: 1, monthlyValue: 1437240, annualMultiplier: 12 },
      { name: "Páginas", quantity: 20, monthlyValue: 119770, annualMultiplier: 1 },
    ],

    // 4. Operating Expenses (OPEX) (Base Sheet: Rows 65-66)
    operatingExpenses: [
      { name: "Arriendo", quantity: 1, monthlyValue: 700000, annualMultiplier: 12 },
      { name: "Servicios Públicos y Celulares", quantity: 1, monthlyValue: 200000, annualMultiplier: 12 },
    ],

    // 5. Initial Investments (CAPEX) (Base Sheet: Rows 80-83)
    capexItems: [
      { name: "Muebles y Enseres", unit: "$", cost: 2000000, usefulLifeYears: 5 },
      { name: "Equipos de Oficina", unit: "$", cost: 5000000, usefulLifeYears: 5 },
      { name: "Otros(Páginas monetizadas)", unit: "$", cost: 7340000, usefulLifeYears: 5 },
    ],

    // 6. Working Capital Rotation Days (Base Sheet: Rows 71-73)
    workingCapitalDays: {
      cxcDays: 60,
      cxpDays: 60,
      inventoryDays: 90,
    },

    // 7. Macroeconomic Parameters (Base Sheet: Rows 11-16 & Proyección P&G: Rows 6-7, 23)
    macro: {
      ipcProjections: [0.0145, 0.036, 0.032, 0.03, 0.03, 0.03],
      salesGrowthProjections: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      taxRates: [0.32, 0.31, 0.3, 0.3, 0.3, 0.3],
    },

    // 8. Financial Discount Rate (FCL Sheet: Row 21 & Resultados: Row 10)
    discountRate: 0.1,
  };

  it("reproduces exact Free Cash Flow (FCL) series for Periods 0 to 5", () => {
    const result = runFinancialEngine(jorgeOrozcoInput);

    // Free Cash Flow series validation
    // FCL Año 0 = -30,711,283.99
    expect(result.cashFlow[0]!.freeCashFlow).toBeCloseTo(-30711283.99, 2);

    // FCL Año 1 = 14,730,021.51
    expect(result.cashFlow[1]!.freeCashFlow).toBeCloseTo(14730021.51, 2);

    // FCL Año 2 = 22,877,591.26
    expect(result.cashFlow[2]!.freeCashFlow).toBeCloseTo(22877591.26, 2);

    // FCL Año 3 = 32,264,896.28
    expect(result.cashFlow[3]!.freeCashFlow).toBeCloseTo(32264896.28, 2);

    // FCL Año 4 = 43,007,558.63
    expect(result.cashFlow[4]!.freeCashFlow).toBeCloseTo(43007558.63, 2);

    // FCL Año 5 = 55,375,970.00 (within 1 COP)
    expect(result.cashFlow[5]!.freeCashFlow).toBeCloseTo(55375971.0, 0);
  });

  it("calculates exact TIR (~73.12%) matching Excel IRR function", () => {
    const result = runFinancialEngine(jorgeOrozcoInput);
    // Excel cell D20: 0.7311630731668155 -> 73.12%
    expect(result.irr * 100).toBeCloseTo(73.12, 1);
    expect(result.irr).toBeCloseTo(0.731163, 4);
  });

  it("calculates exact VPN (~$81,442,455.82) at 10% discount rate matching Excel NPV function", () => {
    const result = runFinancialEngine(jorgeOrozcoInput);
    // Excel cell D21: =NPV(10%, D19:I19) -> 81,442,455.82
    expect(result.excelNpv).toBeCloseTo(81442455.82, 2);
  });

  it("confirms project viability criteria (TIR > Tasa Descuento and VPN > 0)", () => {
    const result = runFinancialEngine(jorgeOrozcoInput);
    expect(result.viability.isIrrViable).toBe(true);
    expect(result.viability.isNpvViable).toBe(true);
    expect(result.viability.isOverallViable).toBe(true);
    expect(result.viability.irrStatus).toBe("VIABLE");
    expect(result.viability.npvStatus).toBe("VIABLE");
    expect(result.viability.overallStatus).toBe("VIABLE");
  });

  it("verifies intermediate P&G and KTNO values match Excel exactly", () => {
    const result = runFinancialEngine(jorgeOrozcoInput);

    // Initial Year 0 P&G values
    expect(result.incomeStatement[0]!.revenues).toBe(115894320);
    expect(result.incomeStatement[0]!.totalCostOfSales).toBeCloseTo(90966106.88, 2);
    expect(result.incomeStatement[0]!.operatingProfitBeforeTax).toBeCloseTo(11260213.12, 2);
    expect(result.incomeStatement[0]!.incomeTax).toBeCloseTo(3603268.2, 2);
    expect(result.incomeStatement[0]!.netIncome).toBeCloseTo(7656944.92, 2);

    // Initial Year 0 KTNO values
    expect(result.workingCapital[0]!.cxc).toBe(19315720);
    expect(result.workingCapital[0]!.inventories).toBeCloseTo(22741526.72, 2);
    expect(result.workingCapital[0]!.cxp).toBeCloseTo(15161017.81, 2);
    expect(result.workingCapital[0]!.ktno).toBeCloseTo(26896228.91, 2);
    expect(result.workingCapital[0]!.deltaKtno).toBeCloseTo(26896228.91, 2);

    // Year 1 KTNO variation
    expect(result.workingCapital[1]!.deltaKtno).toBeCloseTo(3138951.18, 2);

    // Year 0 EBITDA and Gross Flow
    expect(result.cashFlow[0]!.ebitda).toBeCloseTo(14128213.12, 2);
    expect(result.cashFlow[0]!.grossCashFlow).toBeCloseTo(10524944.92, 2);
  });
});

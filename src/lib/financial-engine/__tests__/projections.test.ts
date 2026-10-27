import { describe, expect, it } from "vitest";
import {
  projectIncomeStatement,
  calculateInitialRevenues,
  calculateInitialDirectCosts,
  calculateInitialOpex,
  calculateAnnualDepreciation,
} from "../projections";
import {
  RevenueItem,
  PositionItem,
  DirectCostItem,
  OperatingExpenseItem,
  CapexItem,
} from "../types";

describe("Projections Module - Income Statement (P&G)", () => {
  const sampleRevenues: RevenueItem[] = [
    { name: "Afiliación", quantity: 20, unitPrice: 482893 },
    { name: "Asesoria inicial", quantity: 20, unitPrice: 482893 },
    { name: "Canon de mantenimiento", quantity: 20, unitPrice: 4828930 },
  ];

  const samplePositions: PositionItem[] = [
    { role: "Administrador", headcount: 1 },
    { role: "Contador", headcount: 1 },
    { role: "Jurídico", headcount: 1 },
    { role: "Comunicaciones", headcount: 1 },
  ];

  const sampleSupplies: DirectCostItem[] = [
    { name: "Distribución", quantity: 1, monthlyValue: 1437240, annualMultiplier: 12 },
    { name: "Páginas", quantity: 20, monthlyValue: 119770, annualMultiplier: 1 },
  ];

  const sampleOpex: OperatingExpenseItem[] = [
    { name: "Arriendo", quantity: 1, monthlyValue: 700000, annualMultiplier: 12 },
    { name: "Servicios Públicos", quantity: 1, monthlyValue: 200000, annualMultiplier: 12 },
  ];

  const sampleCapex: CapexItem[] = [
    { name: "Muebles y Enseres", cost: 2000000, usefulLifeYears: 5 },
    { name: "Equipos de Oficina", cost: 5000000, usefulLifeYears: 5 },
    { name: "Otros", cost: 7340000, usefulLifeYears: 5 },
  ];

  it("calculates initial metrics correctly", () => {
    expect(calculateInitialRevenues(sampleRevenues)).toBe(115894320);
    expect(calculateInitialDirectCosts(sampleSupplies)).toBe(19642280);
    expect(calculateInitialOpex(sampleOpex)).toBe(10800000);
    expect(calculateAnnualDepreciation(sampleCapex)).toBe(2868000);
  });

  it("projects 6 periods with proper indexation matching P&G", () => {
    const projection = projectIncomeStatement({
      revenues: sampleRevenues,
      positions: samplePositions,
      directSupplies: sampleSupplies,
      operatingExpenses: sampleOpex,
      capexItems: sampleCapex,
    });

    expect(projection).toHaveLength(6);

    // Year 0
    expect(projection[0]!.year).toBe(0);
    expect(projection[0]!.revenues).toBe(115894320);
    expect(projection[0]!.directLaborCost).toBeCloseTo(71323826.88, 2);
    expect(projection[0]!.directMaterialsCost).toBe(19642280);
    expect(projection[0]!.totalCostOfSales).toBeCloseTo(90966106.88, 2);
    expect(projection[0]!.operatingExpenses).toBe(10800000);
    expect(projection[0]!.depreciation).toBe(2868000);
    expect(projection[0]!.operatingProfitBeforeTax).toBeCloseTo(11260213.12, 2);
    expect(projection[0]!.incomeTax).toBeCloseTo(3603268.2, 2); // 32%
    expect(projection[0]!.netIncome).toBeCloseTo(7656944.92, 2);

    // Year 1
    // Revenue indexed by: 115,894,320 * (1 + 0.10) * (1 + 0.036) = 132,073,167.07
    expect(projection[1]!.revenues).toBeCloseTo(132073167.07, 2);
    expect(projection[1]!.directLaborCost).toBeCloseTo(73891484.65, 2);
    expect(projection[1]!.directMaterialsCost).toBeCloseTo(22384342.29, 2);
    expect(projection[1]!.totalCostOfSales).toBeCloseTo(96275826.94, 2);
    expect(projection[1]!.operatingExpenses).toBe(11188800);
    expect(projection[1]!.depreciation).toBe(2868000);
    expect(projection[1]!.operatingProfitBeforeTax).toBeCloseTo(21740540.14, 2);
    expect(projection[1]!.incomeTax).toBeCloseTo(6739567.44, 2); // 31%
    expect(projection[1]!.netIncome).toBeCloseTo(15000972.69, 2);

    // Year 5
    expect(projection[5]!.revenues).toBeCloseTo(218060349.71, 2);
    expect(projection[5]!.totalCostOfSales).toBeCloseTo(120284832.27, 2);
    expect(projection[5]!.netIncome).toBeCloseTo(57338011.85, 2);
  });
});

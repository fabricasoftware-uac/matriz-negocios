import { describe, expect, it } from "vitest";
import {
  calculatePositionPayroll,
  calculatePayrollSummary,
  DEFAULT_PAYROLL_CONFIG,
} from "../payroll";
import { PositionItem } from "../types";

describe("Payroll Module - Colombian Labor Benefits", () => {
  it("calculates exact Colombian payroll for a single SMLMV employee", () => {
    const position: PositionItem = {
      role: "Administrador",
      headcount: 1,
      monthlyBaseSalary: 1160000,
    };

    const result = calculatePositionPayroll(position, DEFAULT_PAYROLL_CONFIG);

    expect(result.baseSalary).toBe(1160000);
    expect(result.auxilioTransporte).toBe(140606);
    expect(result.salud).toBe(-46400); // -1,160,000 * 4%
    expect(result.pension).toBe(-46400); // -1,160,000 * 4%
    expect(result.prima).toBeCloseTo(108383.8333, 4); // ((1160000 + 140606) / 360) * 30
    expect(result.cesantias).toBeCloseTo(108383.8333, 4);
    expect(result.interesesCesantias).toBeCloseTo(13006.06, 2); // cesantias * 12%
    expect(result.vacaciones).toBeCloseTo(48333.3333, 4); // (1160000 / 720) * 30

    // Exact sum matching Excel cell H27: 1,485,913.06
    expect(result.totalMonthlyCostPerPerson).toBeCloseTo(1485913.06, 2);
    expect(result.totalMonthlyCost).toBeCloseTo(1485913.06, 2);
    expect(result.totalAnnualCost).toBeCloseTo(17830956.72, 2);
  });

  it("calculates total annual payroll for 4 positions matching Jorge Orozco model", () => {
    const positions: PositionItem[] = [
      { role: "Administrador", headcount: 1 },
      { role: "Contador", headcount: 1 },
      { role: "Jurídico", headcount: 1 },
      { role: "Comunicaciones", headcount: 1 },
    ];

    const summary = calculatePayrollSummary(positions, DEFAULT_PAYROLL_CONFIG);

    expect(summary.positions).toHaveLength(4);
    // Total monthly: 4 * 1,485,913.06 = 5,943,652.24
    expect(summary.totalMonthlyCost).toBeCloseTo(5943652.24, 2);
    // Total annual matching Excel cell F35: 71,323,826.88
    expect(summary.totalAnnualCost).toBeCloseTo(71323826.88, 2);
  });

  it("handles custom salaries and headcount > 1", () => {
    const position: PositionItem = {
      role: "Senior Dev",
      headcount: 2,
      monthlyBaseSalary: 2000000,
    };

    const result = calculatePositionPayroll(position, DEFAULT_PAYROLL_CONFIG);

    expect(result.baseSalary).toBe(2000000);
    expect(result.salud).toBe(-80000);
    expect(result.pension).toBe(-80000);
    expect(result.totalMonthlyCost).toBe(result.totalMonthlyCostPerPerson * 2);
    expect(result.totalAnnualCost).toBe(result.totalMonthlyCost * 12);
  });
});

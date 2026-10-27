import { describe, expect, it } from "vitest";
import {
  DEFAULT_REVENUES,
  DEFAULT_POSITIONS,
  DEFAULT_DIRECT_SUPPLIES,
  DEFAULT_OPERATING_EXPENSES,
  DEFAULT_CAPEX,
  DEFAULT_WC_DAYS,
  DEFAULT_MACRO,
  DEFAULT_PAYROLL_CONFIG,
  DEFAULT_CONESA_IMPACTS,
} from "../ProjectContext";
import { runFinancialEngine, evaluateConesaMatrix } from "@/lib/financial-engine";

describe("ProjectContext Benchmark Integration", () => {
  it("initializes with exact Jorge Orozco benchmark inputs", () => {
    expect(DEFAULT_REVENUES).toHaveLength(3);
    expect(DEFAULT_POSITIONS).toHaveLength(4);
    expect(DEFAULT_CAPEX).toHaveLength(3);
    expect(DEFAULT_WC_DAYS.cxcDays).toBe(60);
    expect(DEFAULT_WC_DAYS.cxpDays).toBe(60);
    expect(DEFAULT_WC_DAYS.inventoryDays).toBe(90);
  });

  it("yields viable financial results with 0ms latency model", () => {
    const output = runFinancialEngine({
      revenues: DEFAULT_REVENUES,
      payrollConfig: DEFAULT_PAYROLL_CONFIG,
      positions: DEFAULT_POSITIONS,
      directSupplies: DEFAULT_DIRECT_SUPPLIES,
      operatingExpenses: DEFAULT_OPERATING_EXPENSES,
      capexItems: DEFAULT_CAPEX,
      workingCapitalDays: DEFAULT_WC_DAYS,
      macro: DEFAULT_MACRO,
      discountRate: 0.1,
    });

    expect(output.viability.isOverallViable).toBe(true);
    expect(output.viability.overallStatus).toBe("VIABLE");
    expect(output.irr * 100).toBeCloseTo(73.12, 1);
    expect(output.excelNpv).toBeCloseTo(81442455.82, 2);
  });

  it("evaluates initial Conesa matrix impacts correctly", () => {
    const summary = evaluateConesaMatrix(DEFAULT_CONESA_IMPACTS);
    expect(summary.totalImpacts).toBe(4);
    expect(summary.beneficialCount).toBe(2);
    expect(summary.adverseCount).toBe(2);
    expect(summary.averageImportance).toBeGreaterThan(0);
  });
});

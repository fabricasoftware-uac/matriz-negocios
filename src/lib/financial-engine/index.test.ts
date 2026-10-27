import { describe, expect, it } from "vitest";
import { calculateIRR, calculateNPV } from "@/lib/financial-engine";

describe("Financial Engine - Unit Tests", () => {
  describe("calculateNPV", () => {
    it("calculates NPV correctly for standard cash flows", () => {
      const cashFlows = [-1000, 500, 600];
      const rate = 0.1;
      const npv = calculateNPV(rate, cashFlows);
      expect(Math.round(npv * 100) / 100).toBe(-49.59);
    });

    it("throws error for discount rate <= -1", () => {
      expect(() => calculateNPV(-1, [100])).toThrowError("Discount rate must be greater than -100%");
    });
  });

  describe("calculateIRR", () => {
    it("calculates TIR accurately for an investment with known return", () => {
      // Outflow 1000, inflows 600 and 600 -> TIR is ~13.066%
      const cashFlows = [-1000, 600, 600];
      const irr = calculateIRR(cashFlows);
      expect(Math.round(irr * 10000) / 100).toBeCloseTo(13.07, 1);
    });
  });
});

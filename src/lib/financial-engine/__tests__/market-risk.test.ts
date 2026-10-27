import { describe, it, expect } from "vitest";
import {
  calculateRiskLevel,
  MARKET_ATTRIBUTES,
  DEFAULT_OUR_COMPANY_SCORES,
  DEFAULT_COMPETITORS,
  DEFAULT_RISKS,
  DEFAULT_LEGAL_DATA,
  DEFAULT_TECHNICAL_DATA,
} from "../market-risk-data";

describe("Market & Competitor Benchmark Evaluation", () => {
  it("should contain exactly 11 qualitative attributes", () => {
    expect(MARKET_ATTRIBUTES).toHaveLength(11);
    const attributeIds = MARKET_ATTRIBUTES.map((a) => a.id);
    expect(attributeIds).toContain("precio");
    expect(attributeIds).toContain("calidad");
    expect(attributeIds).toContain("imagen");
    expect(attributeIds).toContain("costes");
  });

  it("should match Excel benchmark total points of 80 for Nuestra Empresa", () => {
    const total = Object.values(DEFAULT_OUR_COMPANY_SCORES).reduce((a, b) => a + b, 0);
    expect(total).toBe(80);
  });

  it("should contain all 6 competitors from Excel with their benchmark totals", () => {
    expect(DEFAULT_COMPETITORS).toHaveLength(6);

    const compMap = new Map(
      DEFAULT_COMPETITORS.map((c) => [
        c.competitorName,
        Object.values(c.scores).reduce((a, b) => a + b, 0),
      ])
    );

    expect(compMap.get("Raw Talent")).toBe(55);
    expect(compMap.get("DCInfluenc")).toBe(40);
    expect(compMap.get("MatchAgenc")).toBe(45);
    expect(compMap.get("RangaMedia")).toBe(35);
    expect(compMap.get("Trendset")).toBe(38);
    expect(compMap.get("SomosInflu")).toBe(15);
  });
});

describe("Risk Matrix Evaluation (5x5)", () => {
  it("should correctly classify risk levels by score thresholds", () => {
    expect(calculateRiskLevel(1, 1)).toBe("Bajo");
    expect(calculateRiskLevel(1, 4)).toBe("Bajo");
    expect(calculateRiskLevel(2, 3)).toBe("Moderado");
    expect(calculateRiskLevel(3, 3)).toBe("Alto");
    expect(calculateRiskLevel(4, 4)).toBe("Extremo");
    expect(calculateRiskLevel(5, 5)).toBe("Extremo");
  });

  it("should load the 7 official risks from the Jorge Orozco Excel model", () => {
    expect(DEFAULT_RISKS).toHaveLength(7);

    // Verify key risks exist
    const riskTexts = DEFAULT_RISKS.map((r) => r.risk);
    expect(riskTexts.some((t) => t.includes("liquidación del impuesto"))).toBe(true);
    expect(riskTexts.some((t) => t.includes("Causación doble"))).toBe(true);
    expect(riskTexts.some((t) => t.includes("Fraude"))).toBe(true);
    expect(riskTexts.some((t) => t.includes("presupuesto"))).toBe(true);
  });
});

describe("Legal and Technical Project Metadata", () => {
  it("should verify corporate SAS identity and DIAN obligations", () => {
    expect(DEFAULT_LEGAL_DATA.companyType).toContain("Acciones Simplificada");
    expect(DEFAULT_LEGAL_DATA.paidCapital).toBe(1000000);
    expect(DEFAULT_LEGAL_DATA.legalRepLimitSmlmv).toBe(25);
    expect(DEFAULT_LEGAL_DATA.ciiuOther.code).toBe("J5911");
    expect(DEFAULT_LEGAL_DATA.dianObligations.length).toBeGreaterThanOrEqual(5);
  });

  it("should verify Popayán localization factors", () => {
    expect(DEFAULT_TECHNICAL_DATA.city).toBe("Popayán");
    expect(DEFAULT_TECHNICAL_DATA.department).toBe("Cauca");
    expect(DEFAULT_TECHNICAL_DATA.organicDistributionFactor).toContain("viralidad");
  });
});

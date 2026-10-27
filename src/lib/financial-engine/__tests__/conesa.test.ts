import { describe, expect, it } from "vitest";
import {
  calculateConesaImportance,
  evaluateConesaMatrix,
  categorizeConesaImportance,
} from "../conesa";
import { ConesaImpactInput } from "../types";

describe("Conesa Environmental Evaluation Module", () => {
  it("calculates Conesa formula: I = signo * (3*U + 2*EX + MO + PE + RV + MC + EF + PR)", () => {
    // Example test case:
    // U=1, EX=1, MO=1, PE=1, RV=1, MC=1, EF=1, PR=1
    // Raw = 3*1 + 2*1 + 1 + 1 + 1 + 1 + 1 + 1 = 3 + 2 + 6 = 11
    const impact: ConesaImpactInput = {
      component: "Medio Físico",
      element: "Suelo",
      item: "1.1",
      specificImpact: "Contaminación de suelos",
      sign: "-",
      intensity: 1,
      extension: 1,
      moment: 1,
      persistence: 1,
      reversibility: 1,
      recoverability: 1,
      effect: 1,
      periodicity: 1,
    };

    const result = calculateConesaImportance(impact);
    expect(result.rawImportance).toBe(11);
    expect(result.signedImportance).toBe(-11);
    expect(result.absImportance).toBe(11);
    expect(result.category).toBe("Irrelevante");
    expect(result.isBeneficial).toBe(false);
  });

  it("evaluates a positive/beneficial impact properly", () => {
    // Beneficial impact: Generación de empleo
    // U=4, EX=2, MO=4, PE=2, RV=2, MC=2, EF=4, PR=4
    // Raw = 3*4 (12) + 2*2 (4) + 4 + 2 + 2 + 2 + 4 + 4 = 16 + 18 = 34
    const impact: ConesaImpactInput = {
      component: "Socioeconómico",
      element: "Comunidades",
      item: "6.1",
      specificImpact: "Generación de empleo",
      sign: "+",
      intensity: 4,
      extension: 2,
      moment: 4,
      persistence: 2,
      reversibility: 2,
      recoverability: 2,
      effect: 4,
      periodicity: 4,
    };

    const result = calculateConesaImportance(impact);
    expect(result.rawImportance).toBe(34);
    expect(result.signedImportance).toBe(34);
    expect(result.category).toBe("Moderado");
    expect(result.isBeneficial).toBe(true);
  });

  it("categorizes correctly across all 4 severity thresholds", () => {
    // Irrelevante: < 25
    expect(categorizeConesaImportance(10)).toBe("Irrelevante");
    expect(categorizeConesaImportance(24.9)).toBe("Irrelevante");

    // Moderado: 25 to 50
    expect(categorizeConesaImportance(25)).toBe("Moderado");
    expect(categorizeConesaImportance(50)).toBe("Moderado");

    // Severo: 50 to 75
    expect(categorizeConesaImportance(51)).toBe("Severo");
    expect(categorizeConesaImportance(75)).toBe("Severo");

    // Crítico: > 75
    expect(categorizeConesaImportance(76)).toBe("Crítico");
    expect(categorizeConesaImportance(100)).toBe("Crítico");
  });

  it("evaluates a matrix of impacts and generates full summary statistics", () => {
    const matrix: ConesaImpactInput[] = [
      {
        component: "Físico",
        element: "Suelo",
        item: "1.1",
        specificImpact: "Contaminación suelos",
        sign: "-",
        intensity: 1, // 3
        extension: 1, // 2
        moment: 1,
        persistence: 1,
        reversibility: 1,
        recoverability: 1,
        effect: 1,
        periodicity: 1, // Total = 11 -> Irrelevante
      },
      {
        component: "Físico",
        element: "Aire",
        item: "3.1",
        specificImpact: "Emisiones atmosféricas",
        sign: "-",
        intensity: 4, // 12
        extension: 4, // 8
        moment: 4,
        persistence: 4,
        reversibility: 2,
        recoverability: 2,
        effect: 4,
        periodicity: 4, // Total = 40 -> Moderado
      },
      {
        component: "Socioeconómico",
        element: "Economía",
        item: "6.1",
        specificImpact: "Generación de empleo",
        sign: "+",
        intensity: 8, // 24
        extension: 4, // 8
        moment: 4,
        persistence: 4,
        reversibility: 4,
        recoverability: 4,
        effect: 4,
        periodicity: 4, // Total = 56 -> Severo (beneficioso)
      },
    ];

    const summary = evaluateConesaMatrix(matrix);

    expect(summary.totalImpacts).toBe(3);
    expect(summary.beneficialCount).toBe(1);
    expect(summary.adverseCount).toBe(2);
    expect(summary.categoryCounts.Irrelevante).toBe(1);
    expect(summary.categoryCounts.Moderado).toBe(1);
    expect(summary.categoryCounts.Severo).toBe(1);
    expect(summary.categoryCounts.Crítico).toBe(0);
    expect(summary.averageImportance).toBeCloseTo((11 + 40 + 56) / 3, 2);
  });
});

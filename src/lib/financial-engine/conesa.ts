import {
  ConesaImpactInput,
  ConesaImpactResult,
  ConesaCategory,
  ConesaSummary,
} from "./types";

/**
 * Categorizes an environmental impact importance value according to Vicente Conesa's method:
 * - Irrelevante: < 25
 * - Moderado: 25 a 50
 * - Severo: 50 a 75
 * - Crítico: > 75
 */
export function categorizeConesaImportance(absImportance: number): ConesaCategory {
  if (absImportance < 25) {
    return "Irrelevante";
  }
  if (absImportance <= 50) {
    return "Moderado";
  }
  if (absImportance <= 75) {
    return "Severo";
  }
  return "Crítico";
}

/**
 * Calculates Conesa Environmental Impact Importance:
 * Formula: I = signo * (3*U + 2*EX + MO + PE + RV + MC + EF + PR)
 *
 * Parameters:
 * - U: Intensidad (1 a 12)
 * - EX: Extensión (1 a 8)
 * - MO: Momento (1 a 4)
 * - PE: Persistencia (1 a 4)
 * - RV: Reversibilidad (1 a 4)
 * - MC: Recuperabilidad (1 a 8)
 * - EF: Efecto (1 a 4)
 * - PR: Periodicidad (1 a 4)
 */
export function calculateConesaImportance(
  impact: ConesaImpactInput
): ConesaImpactResult {
  const signMultiplier = impact.sign === "+" ? 1 : -1;

  const rawImportance =
    3 * impact.intensity +
    2 * impact.extension +
    impact.moment +
    impact.persistence +
    impact.reversibility +
    impact.recoverability +
    impact.effect +
    impact.periodicity;

  const signedImportance = signMultiplier * rawImportance;
  const absImportance = Math.abs(signedImportance);
  const category = categorizeConesaImportance(absImportance);
  const isBeneficial = impact.sign === "+";

  return {
    input: impact,
    rawImportance,
    signedImportance,
    absImportance,
    category,
    isBeneficial,
  };
}

/**
 * Evaluates a complete matrix of environmental impacts and generates aggregate statistics.
 */
export function evaluateConesaMatrix(
  impacts: ConesaImpactInput[]
): ConesaSummary {
  const results = impacts.map((imp) => calculateConesaImportance(imp));

  let beneficialCount = 0;
  let adverseCount = 0;
  let totalImportanceSum = 0;

  const categoryCounts: Record<ConesaCategory, number> = {
    Irrelevante: 0,
    Moderado: 0,
    Severo: 0,
    Crítico: 0,
  };

  for (const r of results) {
    if (r.isBeneficial) {
      beneficialCount++;
    } else {
      adverseCount++;
    }
    categoryCounts[r.category]++;
    totalImportanceSum += r.absImportance;
  }

  const averageImportance =
    results.length > 0 ? totalImportanceSum / results.length : 0;

  return {
    impacts: results,
    totalImpacts: results.length,
    beneficialCount,
    adverseCount,
    categoryCounts,
    averageImportance,
  };
}

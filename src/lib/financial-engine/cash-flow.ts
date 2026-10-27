import {
  IncomeStatementPeriod,
  WorkingCapitalPeriod,
  CashFlowPeriodResult,
  FinancialViability,
  CapexItem,
} from "./types";

/**
 * Calculates Free Cash Flow (Flujo de Caja Libre - FCL) by indirect method:
 * - EBITDA = Utilidad Neta + Depreciación + Impuestos
 * - Flujo Bruto = EBITDA - Impuestos (= Utilidad Neta + Depreciación)
 * - FCL = Flujo Bruto - Variación KTNO - CAPEX (en Período 0)
 */
export function calculateFreeCashFlow(
  incomeStatements: IncomeStatementPeriod[],
  workingCapital: WorkingCapitalPeriod[],
  initialCapex: number | CapexItem[]
): CashFlowPeriodResult[] {
  const totalCapex =
    typeof initialCapex === "number"
      ? initialCapex
      : initialCapex.reduce((sum, item) => sum + item.cost, 0);

  const results: CashFlowPeriodResult[] = [];

  for (let i = 0; i < incomeStatements.length; i++) {
    const is = incomeStatements[i];
    const wc = workingCapital[i];
    if (!is || !wc) continue;

    const netIncome = is.netIncome;
    const depreciation = is.depreciation;
    const incomeTax = is.incomeTax;
    const ebitda = netIncome + depreciation + incomeTax;
    const grossCashFlow = ebitda - incomeTax; // Equals netIncome + depreciation
    const deltaKtno = wc.deltaKtno;
    const capex = is.year === 0 ? totalCapex : 0;
    const freeCashFlow = grossCashFlow - deltaKtno - capex;

    results.push({
      year: is.year,
      netIncome,
      depreciation,
      incomeTax,
      ebitda,
      grossCashFlow,
      deltaKtno,
      capex,
      freeCashFlow,
    });
  }

  return results;
}

/**
 * Calculates Net Present Value (NPV / VPN).
 * - "standard" mode: flow_0 is at period 0 (undiscounted), sum_{t=0}^n flow_t / (1 + rate)^t.
 * - "excel" mode: replicates Excel's =NPV(rate, range) where the first cell is discounted by (1+rate)^1.
 */
export function calculateNPV(
  rate: number,
  cashFlows: readonly number[],
  mode: "standard" | "excel" = "standard"
): number {
  if (rate <= -1) {
    throw new Error("Discount rate must be greater than -100%");
  }

  const offset = mode === "excel" ? 1 : 0;

  return cashFlows.reduce<number>((accumulator, currentFlow, period) => {
    return accumulator + currentFlow / Math.pow(1 + rate, period + offset);
  }, 0);
}

/**
 * Convenience alias for Excel-compatible NPV.
 */
export function calculateExcelNPV(
  rate: number,
  cashFlows: readonly number[]
): number {
  return calculateNPV(rate, cashFlows, "excel");
}

/**
 * Calculates Internal Rate of Return (IRR / TIR) using Newton-Raphson with bisection fallback.
 */
export function calculateIRR(
  cashFlows: readonly number[],
  guess = 0.1,
  maxIterations = 150,
  tolerance = 1e-7
): number {
  if (cashFlows.length < 2) {
    throw new Error("IRR requires at least two cash flow periods.");
  }

  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      const flow = cashFlows[t] ?? 0;
      const factor = Math.pow(1 + rate, t);
      npv += flow / factor;

      if (t > 0) {
        derivative -= (t * flow) / Math.pow(1 + rate, t + 1);
      }
    }

    if (Math.abs(npv) < tolerance) {
      return rate;
    }

    if (Math.abs(derivative) < 1e-12 || isNaN(derivative)) {
      break;
    }

    let nextRate = rate - npv / derivative;

    // Guard against exploding rates or rates <= -1
    if (nextRate <= -0.999) {
      nextRate = (rate - 0.999) / 2;
    }

    if (Math.abs(nextRate - rate) < tolerance) {
      return nextRate;
    }

    rate = nextRate;
  }

  // Fallback to bisection method within [-0.99, 10.0] if Newton failed
  let low = -0.99;
  let high = 10.0;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const npvMid = cashFlows.reduce(
      (sum, flow, t) => sum + flow / Math.pow(1 + mid, t),
      0
    );
    if (Math.abs(npvMid) < tolerance) {
      return mid;
    }
    const npvLow = cashFlows.reduce(
      (sum, flow, t) => sum + flow / Math.pow(1 + low, t),
      0
    );
    if (npvMid * npvLow < 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return rate;
}

/**
 * Evaluates financial viability based on IRR and NPV criteria.
 */
export function evaluateViability(
  irr: number,
  npv: number,
  discountRate: number
): FinancialViability {
  const isIrrViable = irr > discountRate;
  const isNpvViable = npv > 0;
  const isOverallViable = isIrrViable && isNpvViable;

  return {
    isIrrViable,
    isNpvViable,
    isOverallViable,
    irrStatus: isIrrViable ? "VIABLE" : "INVIABLE",
    npvStatus: isNpvViable ? "VIABLE" : "INVIABLE",
    overallStatus: isOverallViable ? "VIABLE" : "INVIABLE",
  };
}

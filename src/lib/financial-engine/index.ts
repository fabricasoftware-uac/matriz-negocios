/**
 * Financial Calculation Engine (Pure TypeScript)
 * Full valuation engine for Jorge Orozco's project methodology.
 */

import {
  FinancialEngineInput,
  FinancialEngineOutput,
} from "./types";
import { projectIncomeStatement } from "./projections";
import { calculateWorkingCapital } from "./ktno";
import {
  calculateFreeCashFlow,
  calculateIRR,
  calculateNPV,
  calculateExcelNPV,
  evaluateViability,
} from "./cash-flow";

export * from "./types";
export * from "./payroll";
export * from "./projections";
export * from "./ktno";
export * from "./cash-flow";
export * from "./conesa";
export * from "./market-risk-data";

/**
 * Executes the complete financial calculation pipeline:
 * 1. P&G Projection (6 periods, Years 0-5)
 * 2. KTNO and delta KTNO
 * 3. Free Cash Flow (EBITDA, Gross Flow, FCL)
 * 4. Financial Indicators (TIR, VPN, Viability)
 */
export function runFinancialEngine(
  input: FinancialEngineInput
): FinancialEngineOutput {
  const discountRate = input.discountRate ?? 0.1;

  // 1. Income Statement (P&G)
  const incomeStatement = projectIncomeStatement({
    revenues: input.revenues,
    positions: input.positions,
    payrollConfig: input.payrollConfig,
    directSupplies: input.directSupplies,
    otherDirectCosts: input.otherDirectCosts,
    operatingExpenses: input.operatingExpenses,
    capexItems: input.capexItems,
    macro: input.macro,
  });

  // 2. Working Capital (KTNO)
  const workingCapital = calculateWorkingCapital(
    incomeStatement,
    input.workingCapitalDays
  );

  // 3. Free Cash Flow (FCL)
  const cashFlow = calculateFreeCashFlow(
    incomeStatement,
    workingCapital,
    input.capexItems
  );

  const freeCashFlowSeries = cashFlow.map((cf) => cf.freeCashFlow);

  // 4. Financial Metrics
  const irr = calculateIRR(freeCashFlowSeries);
  const npv = calculateNPV(discountRate, freeCashFlowSeries, "standard");
  const excelNpv = calculateExcelNPV(discountRate, freeCashFlowSeries);
  const viability = evaluateViability(irr, excelNpv, discountRate);

  return {
    incomeStatement,
    workingCapital,
    cashFlow,
    freeCashFlowSeries,
    irr,
    npv,
    excelNpv,
    discountRate,
    viability,
  };
}

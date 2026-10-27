import {
  WorkingCapitalDays,
  WorkingCapitalPeriod,
  IncomeStatementPeriod,
} from "./types";

export const DEFAULT_WORKING_CAPITAL_DAYS: WorkingCapitalDays = {
  cxcDays: 60,
  inventoryDays: 90,
  cxpDays: 60,
};

/**
 * Calculates Working Capital (KTNO) and Delta KTNO for each period.
 *
 * Formulas:
 * CxC = (diasCxC / 360) * Ingresos
 * Inventarios = (diasInv / 360) * Costos
 * CxP = (diasCxP / 360) * Costos
 * KTNO = CxC + Inventarios - CxP
 * Variación KTNO = KTNO_t - KTNO_{t-1}
 */
export function calculateWorkingCapital(
  incomeStatements: IncomeStatementPeriod[],
  days: WorkingCapitalDays = DEFAULT_WORKING_CAPITAL_DAYS
): WorkingCapitalPeriod[] {
  const result: WorkingCapitalPeriod[] = [];
  let previousKtno = 0;

  for (const is of incomeStatements) {
    const cxc = (days.cxcDays / 360) * is.revenues;
    const inventories = (days.inventoryDays / 360) * is.totalCostOfSales;
    const cxp = (days.cxpDays / 360) * is.totalCostOfSales;

    const ktno = cxc + inventories - cxp;
    const deltaKtno = ktno - previousKtno;
    previousKtno = ktno;

    result.push({
      year: is.year,
      cxc,
      inventories,
      cxp,
      ktno,
      deltaKtno,
    });
  }

  return result;
}

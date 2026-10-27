import {
  RevenueItem,
  DirectCostItem,
  OperatingExpenseItem,
  CapexItem,
  MacroeconomicParameters,
  IncomeStatementPeriod,
  PositionItem,
  PayrollConfig,
} from "./types";
import { calculatePayrollSummary, DEFAULT_PAYROLL_CONFIG } from "./payroll";

export const DEFAULT_MACRO_PARAMETERS: MacroeconomicParameters = {
  ipcProjections: [0.0145, 0.036, 0.032, 0.03, 0.03, 0.03],
  salesGrowthProjections: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  taxRates: [0.32, 0.31, 0.3, 0.3, 0.3, 0.3],
};

/**
 * Calculates total initial revenue from product/service items.
 */
export function calculateInitialRevenues(items: RevenueItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/**
 * Calculates initial direct material / supply costs.
 */
export function calculateInitialDirectCosts(items: DirectCostItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.monthlyValue * (item.annualMultiplier ?? 12),
    0
  );
}

/**
 * Calculates initial operating expenses (OPEX).
 */
export function calculateInitialOpex(items: OperatingExpenseItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.monthlyValue * (item.annualMultiplier ?? 12),
    0
  );
}

/**
 * Calculates annual fixed straight-line depreciation for CAPEX assets.
 */
export function calculateAnnualDepreciation(capexItems: CapexItem[]): number {
  return capexItems.reduce((sum, item) => {
    if (item.usefulLifeYears <= 0) return sum;
    const depreciableAmount = item.cost - (item.salvageValue ?? 0);
    return sum + depreciableAmount / item.usefulLifeYears;
  }, 0);
}

export interface IncomeStatementProjectionOptions {
  revenues: RevenueItem[];
  positions: PositionItem[];
  payrollConfig?: PayrollConfig;
  directSupplies: DirectCostItem[];
  otherDirectCosts?: DirectCostItem[];
  operatingExpenses: OperatingExpenseItem[];
  capexItems: CapexItem[];
  macro?: Partial<MacroeconomicParameters>;
  periodsCount?: number; // default: 6 (Period 0 to 5)
  replicateExcelOpexFormula?: boolean; // Replicates Jorge Orozco's exact formula: Year >= 2 uses F12 + F16*(1+F6)
}

/**
 * Generates the full 6-period Income Statement (P&G) projection.
 */
export function projectIncomeStatement(
  options: IncomeStatementProjectionOptions
): IncomeStatementPeriod[] {
  const periodsCount = options.periodsCount ?? 6;
  const replicateExcelOpex = options.replicateExcelOpexFormula ?? true;
  const macro: MacroeconomicParameters = {
    ipcProjections: options.macro?.ipcProjections ?? DEFAULT_MACRO_PARAMETERS.ipcProjections,
    salesGrowthProjections:
      options.macro?.salesGrowthProjections ?? DEFAULT_MACRO_PARAMETERS.salesGrowthProjections,
    taxRates: options.macro?.taxRates ?? DEFAULT_MACRO_PARAMETERS.taxRates,
  };

  const initialRevenue = calculateInitialRevenues(options.revenues);
  const payrollSummary = calculatePayrollSummary(
    options.positions,
    options.payrollConfig ?? DEFAULT_PAYROLL_CONFIG
  );
  const initialLaborCost = payrollSummary.totalAnnualCost;
  const initialDirectMaterials = calculateInitialDirectCosts(options.directSupplies);
  const initialOtherCosts = options.otherDirectCosts
    ? calculateInitialDirectCosts(options.otherDirectCosts)
    : 0;
  const initialOpex = calculateInitialOpex(options.operatingExpenses);
  const fixedDepreciation = calculateAnnualDepreciation(options.capexItems);

  const periods: IncomeStatementPeriod[] = [];

  let currentRevenue = initialRevenue;
  let currentLabor = initialLaborCost;
  let currentMaterials = initialDirectMaterials;
  let currentOtherCosts = initialOtherCosts;
  let currentOpex = initialOpex;

  for (let year = 0; year < periodsCount; year++) {
    const ipc = macro.ipcProjections[year] ?? 0.03;
    const salesGrowth = macro.salesGrowthProjections[year] ?? 0.1;
    const taxRate = macro.taxRates[year] ?? 0.3;

    if (year > 0) {
      // Revenues indexed by sales growth and IPC
      currentRevenue = currentRevenue * (1 + salesGrowth) * (1 + ipc);
      // Fixed labor costs indexed by IPC only
      currentLabor = currentLabor * (1 + ipc);
      // Material / supplies indexed by sales growth and IPC
      currentMaterials = currentMaterials * (1 + salesGrowth) * (1 + ipc);
      // Other direct costs indexed by IPC
      currentOtherCosts = currentOtherCosts * (1 + ipc);
      // Operating expenses indexed by IPC
      currentOpex = currentOpex * (1 + ipc);
    }

    const totalCostOfSales = currentLabor + currentMaterials + currentOtherCosts;

    // In Jorge Orozco's Excel (row 11):
    // Year 0: D16 + D12
    // Year 1: E12 + E16
    // Year >= 2: F12 + F16 * (1 + F6)
    const effectiveOpexForTotal =
      replicateExcelOpex && year >= 2 ? currentOpex * (1 + ipc) : currentOpex;
    const totalCostAndExpenses = totalCostOfSales + effectiveOpexForTotal;

    const operatingProfitBeforeTax =
      currentRevenue - totalCostAndExpenses - fixedDepreciation;
    const incomeTax =
      operatingProfitBeforeTax > 0 ? operatingProfitBeforeTax * taxRate : 0;
    const netIncome = operatingProfitBeforeTax - incomeTax;

    periods.push({
      year,
      ipc,
      salesGrowth,
      taxRate,
      revenues: currentRevenue,
      directLaborCost: currentLabor,
      directMaterialsCost: currentMaterials,
      otherDirectCosts: currentOtherCosts,
      totalCostOfSales,
      operatingExpenses: currentOpex,
      totalCostAndExpenses,
      depreciation: fixedDepreciation,
      operatingProfitBeforeTax,
      incomeTax,
      netIncome,
    });
  }

  return periods;
}

import {
  PayrollConfig,
  PositionItem,
  PositionCostBreakdown,
  PayrollSummary,
} from "./types";

/**
 * Calculates Colombian payroll benefits and monthly/annual labor costs.
 * Conforms to Colombian labor standards and Jorge Orozco's project template.
 */

export const DEFAULT_PAYROLL_CONFIG: PayrollConfig = {
  smlmv: 1160000,
  auxilioTransporte: 140606,
  healthEmployeeRate: 0.04,
  pensionEmployeeRate: 0.04,
  primaDays: 30,
  cesantiasDays: 30,
  interesesCesantiasRate: 0.12,
  vacacionesDays: 30,
};

/**
 * Computes individual breakdown for a given position/salary.
 */
export function calculatePositionPayroll(
  position: PositionItem,
  config: PayrollConfig = DEFAULT_PAYROLL_CONFIG
): PositionCostBreakdown {
  const baseSalary = position.monthlyBaseSalary ?? config.smlmv;
  const auxTransporte = config.auxilioTransporte;

  const healthRate = config.healthEmployeeRate ?? 0.04;
  const pensionRate = config.pensionEmployeeRate ?? 0.04;
  const salud = -baseSalary * healthRate;
  const pension = -baseSalary * pensionRate;

  const primaDays = config.primaDays ?? 30;
  const cesantiasDays = config.cesantiasDays ?? 30;
  const prima = ((baseSalary + auxTransporte) / 360) * primaDays;
  const cesantias = ((baseSalary + auxTransporte) / 360) * cesantiasDays;

  const interesesRate = config.interesesCesantiasRate ?? 0.12;
  const interesesCesantias = cesantias * interesesRate;

  const vacacionesDays = config.vacacionesDays ?? 30;
  const vacaciones = (baseSalary / 720) * vacacionesDays;

  const totalMonthlyCostPerPerson =
    baseSalary +
    auxTransporte +
    salud +
    pension +
    prima +
    cesantias +
    interesesCesantias +
    vacaciones;

  const totalMonthlyCost = totalMonthlyCostPerPerson * position.headcount;
  const totalAnnualCost = totalMonthlyCost * 12;

  return {
    role: position.role,
    headcount: position.headcount,
    baseSalary,
    auxilioTransporte: auxTransporte,
    salud,
    pension,
    prima,
    cesantias,
    interesesCesantias,
    vacaciones,
    totalMonthlyCostPerPerson,
    totalMonthlyCost,
    totalAnnualCost,
  };
}

/**
 * Calculates total payroll for a list of positions.
 */
export function calculatePayrollSummary(
  positions: PositionItem[],
  config: PayrollConfig = DEFAULT_PAYROLL_CONFIG
): PayrollSummary {
  const breakdowns = positions.map((pos) => calculatePositionPayroll(pos, config));

  const totalMonthlyCost = breakdowns.reduce(
    (sum, item) => sum + item.totalMonthlyCost,
    0
  );
  const totalAnnualCost = breakdowns.reduce(
    (sum, item) => sum + item.totalAnnualCost,
    0
  );

  return {
    positions: breakdowns,
    totalMonthlyCost,
    totalAnnualCost,
  };
}

/**
 * Financial Engine Type Definitions
 * Jorge Orozco Business Project Evaluation Model
 */

export interface RevenueItem {
  id?: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface PayrollConfig {
  smlmv: number; // Salario Mínimo Legal Mensual Vigente (e.g. 1,160,000 COP)
  auxilioTransporte: number; // Auxilio legal de transporte (e.g. 140,606 COP)
  healthEmployeeRate?: number; // Descuento salud empleado (default: 0.04)
  pensionEmployeeRate?: number; // Descuento pensión empleado (default: 0.04)
  primaDays?: number; // Días base prima (default: 30)
  cesantiasDays?: number; // Días base cesantías (default: 30)
  interesesCesantiasRate?: number; // Tasa intereses cesantías (default: 0.12)
  vacacionesDays?: number; // Días base vacaciones (default: 30)
}

export interface PositionItem {
  id?: string;
  role: string;
  headcount: number;
  monthlyBaseSalary?: number; // Si no se especifica, toma smlmv de PayrollConfig
}

export interface PositionCostBreakdown {
  role: string;
  headcount: number;
  baseSalary: number;
  auxilioTransporte: number;
  salud: number; // Aporte/deducción salud
  pension: number; // Aporte/deducción pensión
  prima: number;
  cesantias: number;
  interesesCesantias: number;
  vacaciones: number;
  totalMonthlyCostPerPerson: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
}

export interface PayrollSummary {
  positions: PositionCostBreakdown[];
  totalMonthlyCost: number;
  totalAnnualCost: number;
}

export interface DirectCostItem {
  id?: string;
  name: string;
  quantity: number;
  monthlyValue: number;
  annualMultiplier?: number; // 12 para valores mensuales, 1 para anuales
}

export interface OperatingExpenseItem {
  id?: string;
  name: string;
  quantity: number;
  monthlyValue: number;
  annualMultiplier?: number; // default: 12
}

export interface CapexItem {
  id?: string;
  name: string;
  unit?: string;
  cost: number;
  usefulLifeYears: number;
  salvageValue?: number;
}

export interface WorkingCapitalDays {
  cxcDays: number; // Cuentas por Cobrar (días)
  cxpDays: number; // Cuentas por Pagar (días)
  inventoryDays: number; // Inventarios / Intangibles (días)
}

export interface MacroeconomicParameters {
  ipcProjections: number[]; // IPC por período [Año 0 .. Año 5]
  salesGrowthProjections: number[]; // Crecimiento ventas [Año 0 .. Año 5]
  taxRates: number[]; // Tasa de impuesto de renta [Año 0 .. Año 5]
}

export interface FinancialEngineInput {
  revenues: RevenueItem[];
  payrollConfig: PayrollConfig;
  positions: PositionItem[];
  directSupplies: DirectCostItem[]; // Insumos / Materias primas
  otherDirectCosts?: DirectCostItem[];
  operatingExpenses: OperatingExpenseItem[]; // OPEX (arriendo, servicios, etc.)
  capexItems: CapexItem[];
  workingCapitalDays: WorkingCapitalDays;
  macro: MacroeconomicParameters;
  discountRate?: number; // Default 0.10 (10%)
}

export interface IncomeStatementPeriod {
  year: number; // 0 a 5
  ipc: number;
  salesGrowth: number;
  taxRate: number;
  revenues: number;
  directLaborCost: number; // Nómina de producción
  directMaterialsCost: number; // Materiales e insumos
  otherDirectCosts: number; // Otros costos de ventas
  totalCostOfSales: number; // Costo total de venta y producción
  operatingExpenses: number; // Gastos operacionales (administración y ventas)
  totalCostAndExpenses: number; // Total costos y gastos (Fila 11 P&G)
  depreciation: number; // Depreciación
  operatingProfitBeforeTax: number; // Utilidad / Pérdida antes de impuestos
  incomeTax: number; // Impuesto de renta
  netIncome: number; // Utilidad neta
}

export interface WorkingCapitalPeriod {
  year: number; // 0 a 5
  cxc: number; // Cuentas por cobrar
  inventories: number; // Inventarios
  cxp: number; // Cuentas por pagar
  ktno: number; // KTNO = CxC + Inventarios - CxP
  deltaKtno: number; // Variación KTNO frente al período anterior
}

export interface CashFlowPeriodResult {
  year: number; // 0 a 5
  netIncome: number;
  depreciation: number;
  incomeTax: number;
  ebitda: number;
  grossCashFlow: number; // EBITDA - Impuestos (Utilidad Neta + Depreciación)
  deltaKtno: number; // Variación KTNO
  capex: number; // Inversiones (generalmente en Año 0)
  freeCashFlow: number; // Flujo de Caja Libre
}

export type ViabilityStatus = "VIABLE" | "INVIABLE";

export interface FinancialViability {
  isIrrViable: boolean;
  isNpvViable: boolean;
  isOverallViable: boolean;
  irrStatus: ViabilityStatus;
  npvStatus: ViabilityStatus;
  overallStatus: ViabilityStatus;
}

export interface FinancialEngineOutput {
  incomeStatement: IncomeStatementPeriod[];
  workingCapital: WorkingCapitalPeriod[];
  cashFlow: CashFlowPeriodResult[];
  freeCashFlowSeries: number[];
  irr: number;
  npv: number; // Standard NPV
  excelNpv: number; // Excel-compatible NPV
  discountRate: number;
  viability: FinancialViability;
}

/* Conesa Environmental Matrix Types */
export type ConesaSign = "+" | "-";

export interface ConesaImpactInput {
  id?: string;
  component: string;
  element: string;
  item: string;
  specificImpact: string;
  sign: ConesaSign; // Signo o Carácter (+ o -)
  intensity: number; // U (1, 2, 4, 8, 12)
  extension: number; // EX (1, 2, 4, 8)
  moment: number; // MO (1, 2, 4)
  persistence: number; // PE (1, 2, 4)
  reversibility: number; // RV (1, 2, 4)
  recoverability: number; // MC (1, 2, 4, 8)
  effect: number; // EF (1, 4)
  periodicity: number; // PR (1, 2, 4)
  activities?: string[];
}

export type ConesaCategory = "Irrelevante" | "Moderado" | "Severo" | "Crítico";

export interface ConesaImpactResult {
  input: ConesaImpactInput;
  rawImportance: number; // 3*U + 2*EX + MO + PE + RV + MC + EF + PR
  signedImportance: number; // signo * (3*U + 2*EX + MO + PE + RV + MC + EF + PR)
  absImportance: number;
  category: ConesaCategory;
  isBeneficial: boolean;
}

export interface ConesaSummary {
  impacts: ConesaImpactResult[];
  totalImpacts: number;
  beneficialCount: number;
  adverseCount: number;
  categoryCounts: Record<ConesaCategory, number>;
  averageImportance: number;
}

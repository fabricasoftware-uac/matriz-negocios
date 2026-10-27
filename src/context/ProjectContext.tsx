"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  runFinancialEngine,
  evaluateConesaMatrix,
  type FinancialEngineInput,
  type FinancialEngineOutput,
  type RevenueItem,
  type PositionItem,
  type DirectCostItem,
  type OperatingExpenseItem,
  type CapexItem,
  type WorkingCapitalDays,
  type ConesaImpactInput,
  type ConesaSummary,
  type CompetitorScore,
  type RiskItem,
  type LegalProjectData,
  type TechnicalProjectData,
  DEFAULT_OUR_COMPANY_SCORES,
  DEFAULT_COMPETITORS,
  DEFAULT_RISKS,
  DEFAULT_LEGAL_DATA,
  DEFAULT_TECHNICAL_DATA,
  calculateRiskLevel,
} from "@/lib/financial-engine";

export type NavigationMode = "wizard" | "dashboard";

export interface ProjectInfo {
  name: string;
  description: string;
  sector: string;
  author: string;
  currency: string;
}

export type DashboardTabId =
  | "kpis"
  | "revenues"
  | "payroll"
  | "capex"
  | "expenses"
  | "ktno"
  | "cashflow"
  | "conesa"
  | "market"
  | "risks"
  | "legal";

export interface ProjectContextValue {
  // Estado de navegación
  navMode: NavigationMode;
  setNavMode: (mode: NavigationMode) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  activeTab: DashboardTabId;
  setActiveTab: (tab: DashboardTabId) => void;

  // Información del proyecto
  projectInfo: ProjectInfo;
  setProjectInfo: React.Dispatch<React.SetStateAction<ProjectInfo>>;

  // Parámetros del modelo
  revenues: RevenueItem[];
  positions: PositionItem[];
  directSupplies: DirectCostItem[];
  operatingExpenses: OperatingExpenseItem[];
  capexItems: CapexItem[];
  workingCapitalDays: WorkingCapitalDays;
  discountRate: number;
  conesaImpacts: ConesaImpactInput[];

  // Estudio de Mercado (Radar)
  ourCompanyScores: Record<string, number>;
  competitors: CompetitorScore[];
  updateOurScore: (attributeId: string, score: number) => void;
  updateCompetitorScore: (competitorId: string, attributeId: string, score: number) => void;

  // Matriz de Riesgos
  risks: RiskItem[];
  addRisk: (item: Omit<RiskItem, "id" | "level"> & { id?: string }) => void;
  updateRisk: (id: string, updates: Partial<RiskItem>) => void;
  removeRisk: (id: string) => void;

  // Estudio Legal y Técnico
  legalData: LegalProjectData;
  technicalData: TechnicalProjectData;
  updateLegalData: (updates: Partial<LegalProjectData>) => void;
  updateTechnicalData: (updates: Partial<TechnicalProjectData>) => void;

  // Modificadores de estado
  updateRevenue: (index: number, updates: Partial<RevenueItem>) => void;
  addRevenue: (item: RevenueItem) => void;
  removeRevenue: (index: number) => void;

  updatePosition: (index: number, updates: Partial<PositionItem>) => void;
  addPosition: (item: PositionItem) => void;
  removePosition: (index: number) => void;

  updateCapex: (index: number, updates: Partial<CapexItem>) => void;
  addCapex: (item: CapexItem) => void;
  removeCapex: (index: number) => void;

  updateDirectSupply: (index: number, updates: Partial<DirectCostItem>) => void;
  addDirectSupply: (item: DirectCostItem) => void;
  removeDirectSupply: (index: number) => void;

  updateOperatingExpense: (index: number, updates: Partial<OperatingExpenseItem>) => void;
  addOperatingExpense: (item: OperatingExpenseItem) => void;
  removeOperatingExpense: (index: number) => void;

  setWorkingCapitalDays: React.Dispatch<React.SetStateAction<WorkingCapitalDays>>;
  setDiscountRate: (rate: number) => void;

  updateConesaImpact: (index: number, updates: Partial<ConesaImpactInput>) => void;
  addConesaImpact: (item: ConesaImpactInput) => void;
  removeConesaImpact: (index: number) => void;

  resetToDefault: () => void;

  // Salidas calculadas por el motor financiero
  engineOutput: FinancialEngineOutput;
  conesaSummary: ConesaSummary;
}

// Datos de referencia oficiales (Benchmark Jorge Orozco)
export const DEFAULT_PROJECT_INFO: ProjectInfo = {
  name: "Plataforma de Afiliaciones y Consultoría Digital",
  description:
    "Modelo de negocio recurrente de suscripción, consultoría y canones de soporte web (Benchmark Jorge Orozco).",
  sector: "Servicios Digitales y Consultoría",
  author: "Jorge Orozco",
  currency: "COP ($)",
};

export const DEFAULT_REVENUES: RevenueItem[] = [
  { id: "rev-1", name: "Afiliación", quantity: 20, unitPrice: 482893 },
  { id: "rev-2", name: "Asesoria inicial", quantity: 20, unitPrice: 482893 },
  { id: "rev-3", name: "Canon de mantenimiento de la página", quantity: 20, unitPrice: 4828930 },
];

export const DEFAULT_POSITIONS: PositionItem[] = [
  { id: "pos-1", role: "Administrador", headcount: 1, monthlyBaseSalary: 1160000 },
  { id: "pos-2", role: "Contador", headcount: 1, monthlyBaseSalary: 1160000 },
  { id: "pos-3", role: "Jurídico", headcount: 1, monthlyBaseSalary: 1160000 },
  { id: "pos-4", role: "Comunicaciones", headcount: 1, monthlyBaseSalary: 1160000 },
];

export const DEFAULT_DIRECT_SUPPLIES: DirectCostItem[] = [
  { id: "sup-1", name: "Distribución", quantity: 1, monthlyValue: 1437240, annualMultiplier: 12 },
  { id: "sup-2", name: "Páginas", quantity: 20, monthlyValue: 119770, annualMultiplier: 1 },
];

export const DEFAULT_OPERATING_EXPENSES: OperatingExpenseItem[] = [
  { id: "opex-1", name: "Arriendo", quantity: 1, monthlyValue: 700000, annualMultiplier: 12 },
  { id: "opex-2", name: "Servicios Públicos y Celulares", quantity: 1, monthlyValue: 200000, annualMultiplier: 12 },
];

export const DEFAULT_CAPEX: CapexItem[] = [
  { id: "cpx-1", name: "Muebles y Enseres", unit: "$", cost: 2000000, usefulLifeYears: 5 },
  { id: "cpx-2", name: "Equipos de Oficina", unit: "$", cost: 5000000, usefulLifeYears: 5 },
  { id: "cpx-3", name: "Otros (Páginas monetizadas)", unit: "$", cost: 7340000, usefulLifeYears: 5 },
];

export const DEFAULT_WC_DAYS: WorkingCapitalDays = {
  cxcDays: 60,
  cxpDays: 60,
  inventoryDays: 90,
};

export const DEFAULT_MACRO = {
  ipcProjections: [0.0145, 0.036, 0.032, 0.03, 0.03, 0.03],
  salesGrowthProjections: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  taxRates: [0.32, 0.31, 0.3, 0.3, 0.3, 0.3],
};

export const DEFAULT_PAYROLL_CONFIG = {
  smlmv: 1160000,
  auxilioTransporte: 140606,
  healthEmployeeRate: 0.04,
  pensionEmployeeRate: 0.04,
  primaDays: 30,
  cesantiasDays: 30,
  interesesCesantiasRate: 0.12,
  vacacionesDays: 30,
};

export const DEFAULT_CONESA_IMPACTS: ConesaImpactInput[] = [
  {
    id: "imp-1",
    component: "Socioeconómico",
    element: "Generación de Empleo",
    item: "Creación de 4 empleos formales directos",
    specificImpact: "Inclusión y estabilidad laboral formal",
    sign: "+",
    intensity: 4,
    extension: 2,
    moment: 4,
    persistence: 4,
    reversibility: 1,
    recoverability: 1,
    effect: 4,
    periodicity: 4,
  },
  {
    id: "imp-2",
    component: "Medio Físico",
    element: "Consumo Energético",
    item: "Equipos informáticos y servidores cloud",
    specificImpact: "Demanda de energía eléctrica en oficinas y centros de datos",
    sign: "-",
    intensity: 2,
    extension: 1,
    moment: 4,
    persistence: 2,
    reversibility: 1,
    recoverability: 1,
    effect: 4,
    periodicity: 4,
  },
  {
    id: "imp-3",
    component: "Medio Físico",
    element: "Residuos Tecnológicos",
    item: "Obsolescencia de computadores a 5 años",
    specificImpact: "Generación de residuos de aparatos eléctricos (RAEE)",
    sign: "-",
    intensity: 2,
    extension: 1,
    moment: 1,
    persistence: 2,
    reversibility: 2,
    recoverability: 4,
    effect: 1,
    periodicity: 1,
  },
  {
    id: "imp-4",
    component: "Socioeconómico",
    element: "Competitividad Empresarial",
    item: "Digitalización de clientes afiliados",
    specificImpact: "Aumento de productividad de pymes asesoradas",
    sign: "+",
    intensity: 8,
    extension: 4,
    moment: 4,
    persistence: 4,
    reversibility: 1,
    recoverability: 1,
    effect: 4,
    periodicity: 4,
  },
];

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  // Navegación
  const [navMode, setNavMode] = useState<NavigationMode>("wizard");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<DashboardTabId>("kpis");

  // Parámetros de negocio
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(DEFAULT_PROJECT_INFO);
  const [revenues, setRevenues] = useState<RevenueItem[]>(DEFAULT_REVENUES);
  const [positions, setPositions] = useState<PositionItem[]>(DEFAULT_POSITIONS);
  const [directSupplies, setDirectSupplies] = useState<DirectCostItem[]>(DEFAULT_DIRECT_SUPPLIES);
  const [operatingExpenses, setOperatingExpenses] = useState<OperatingExpenseItem[]>(DEFAULT_OPERATING_EXPENSES);
  const [capexItems, setCapexItems] = useState<CapexItem[]>(DEFAULT_CAPEX);
  const [workingCapitalDays, setWorkingCapitalDays] = useState<WorkingCapitalDays>(DEFAULT_WC_DAYS);
  const [discountRate, setDiscountRate] = useState<number>(0.1);
  const [conesaImpacts, setConesaImpacts] = useState<ConesaImpactInput[]>(DEFAULT_CONESA_IMPACTS);

  // Estudio de Mercado
  const [ourCompanyScores, setOurCompanyScores] = useState<Record<string, number>>(DEFAULT_OUR_COMPANY_SCORES);
  const [competitors, setCompetitors] = useState<CompetitorScore[]>(DEFAULT_COMPETITORS);

  // Matriz de Riesgos
  const [risks, setRisks] = useState<RiskItem[]>(DEFAULT_RISKS);

  // Estudio Legal y Técnico
  const [legalData, setLegalData] = useState<LegalProjectData>(DEFAULT_LEGAL_DATA);
  const [technicalData, setTechnicalData] = useState<TechnicalProjectData>(DEFAULT_TECHNICAL_DATA);

  // Pasos del Wizard
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // CRUD Ingresos
  const updateRevenue = useCallback((index: number, updates: Partial<RevenueItem>) => {
    setRevenues((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return copy;
    });
  }, []);

  const addRevenue = useCallback((item: RevenueItem) => {
    setRevenues((prev) => [...prev, { ...item, id: `rev-${Date.now()}` }]);
  }, []);

  const removeRevenue = useCallback((index: number) => {
    setRevenues((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // CRUD Nómina
  const updatePosition = useCallback((index: number, updates: Partial<PositionItem>) => {
    setPositions((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return copy;
    });
  }, []);

  const addPosition = useCallback((item: PositionItem) => {
    setPositions((prev) => [...prev, { ...item, id: `pos-${Date.now()}` }]);
  }, []);

  const removePosition = useCallback((index: number) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // CRUD CAPEX
  const updateCapex = useCallback((index: number, updates: Partial<CapexItem>) => {
    setCapexItems((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return copy;
    });
  }, []);

  const addCapex = useCallback((item: CapexItem) => {
    setCapexItems((prev) => [...prev, { ...item, id: `cpx-${Date.now()}` }]);
  }, []);

  const removeCapex = useCallback((index: number) => {
    setCapexItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // CRUD Insumos
  const updateDirectSupply = useCallback((index: number, updates: Partial<DirectCostItem>) => {
    setDirectSupplies((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return copy;
    });
  }, []);

  const addDirectSupply = useCallback((item: DirectCostItem) => {
    setDirectSupplies((prev) => [...prev, { ...item, id: `sup-${Date.now()}` }]);
  }, []);

  const removeDirectSupply = useCallback((index: number) => {
    setDirectSupplies((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // CRUD OPEX
  const updateOperatingExpense = useCallback((index: number, updates: Partial<OperatingExpenseItem>) => {
    setOperatingExpenses((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return copy;
    });
  }, []);

  const addOperatingExpense = useCallback((item: OperatingExpenseItem) => {
    setOperatingExpenses((prev) => [...prev, { ...item, id: `opex-${Date.now()}` }]);
  }, []);

  const removeOperatingExpense = useCallback((index: number) => {
    setOperatingExpenses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // CRUD Conesa
  const updateConesaImpact = useCallback((index: number, updates: Partial<ConesaImpactInput>) => {
    setConesaImpacts((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return copy;
    });
  }, []);

  const addConesaImpact = useCallback((item: ConesaImpactInput) => {
    setConesaImpacts((prev) => [...prev, { ...item, id: `imp-${Date.now()}` }]);
  }, []);

  const removeConesaImpact = useCallback((index: number) => {
    setConesaImpacts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // CRUD Estudio de Mercado
  const updateOurScore = useCallback((attributeId: string, score: number) => {
    setOurCompanyScores((prev) => ({
      ...prev,
      [attributeId]: Math.max(0, Math.min(10, score)),
    }));
  }, []);

  const updateCompetitorScore = useCallback((competitorId: string, attributeId: string, score: number) => {
    setCompetitors((prev) =>
      prev.map((c) => {
        if (c.competitorId === competitorId) {
          return {
            ...c,
            scores: {
              ...c.scores,
              [attributeId]: Math.max(0, Math.min(10, score)),
            },
          };
        }
        return c;
      })
    );
  }, []);

  // CRUD Matriz de Riesgos
  const addRisk = useCallback((item: Omit<RiskItem, "id" | "level"> & { id?: string }) => {
    const id = item.id || `risk-${Date.now()}`;
    const level = calculateRiskLevel(item.probability, item.impact);
    setRisks((prev) => [...prev, { ...item, id, level }]);
  }, []);

  const updateRisk = useCallback((id: string, updates: Partial<RiskItem>) => {
    setRisks((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const merged = { ...r, ...updates };
          const level = calculateRiskLevel(merged.probability, merged.impact);
          return { ...merged, level };
        }
        return r;
      })
    );
  }, []);

  const removeRisk = useCallback((id: string) => {
    setRisks((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // CRUD Legal & Técnico
  const updateLegalData = useCallback((updates: Partial<LegalProjectData>) => {
    setLegalData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateTechnicalData = useCallback((updates: Partial<TechnicalProjectData>) => {
    setTechnicalData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset al Benchmark Original
  const resetToDefault = useCallback(() => {
    setProjectInfo(DEFAULT_PROJECT_INFO);
    setRevenues(DEFAULT_REVENUES);
    setPositions(DEFAULT_POSITIONS);
    setDirectSupplies(DEFAULT_DIRECT_SUPPLIES);
    setOperatingExpenses(DEFAULT_OPERATING_EXPENSES);
    setCapexItems(DEFAULT_CAPEX);
    setWorkingCapitalDays(DEFAULT_WC_DAYS);
    setDiscountRate(0.1);
    setConesaImpacts(DEFAULT_CONESA_IMPACTS);
    setOurCompanyScores(DEFAULT_OUR_COMPANY_SCORES);
    setCompetitors(DEFAULT_COMPETITORS);
    setRisks(DEFAULT_RISKS);
    setLegalData(DEFAULT_LEGAL_DATA);
    setTechnicalData(DEFAULT_TECHNICAL_DATA);
    setCurrentStep(1);
    setActiveTab("kpis");
  }, []);

  // Ejecución reactiva instantánea del motor financiero
  const engineOutput = useMemo<FinancialEngineOutput>(() => {
    const input: FinancialEngineInput = {
      revenues,
      payrollConfig: DEFAULT_PAYROLL_CONFIG,
      positions,
      directSupplies,
      operatingExpenses,
      capexItems,
      workingCapitalDays,
      macro: DEFAULT_MACRO,
      discountRate,
    };
    return runFinancialEngine(input);
  }, [
    revenues,
    positions,
    directSupplies,
    operatingExpenses,
    capexItems,
    workingCapitalDays,
    discountRate,
  ]);

  // Evaluación reactiva de la matriz Conesa
  const conesaSummary = useMemo<ConesaSummary>(() => {
    return evaluateConesaMatrix(conesaImpacts);
  }, [conesaImpacts]);

  return (
    <ProjectContext.Provider
      value={{
        navMode,
        setNavMode,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        activeTab,
        setActiveTab,
        projectInfo,
        setProjectInfo,
        revenues,
        positions,
        directSupplies,
        operatingExpenses,
        capexItems,
        workingCapitalDays,
        discountRate,
        conesaImpacts,
        ourCompanyScores,
        competitors,
        updateOurScore,
        updateCompetitorScore,
        risks,
        addRisk,
        updateRisk,
        removeRisk,
        legalData,
        technicalData,
        updateLegalData,
        updateTechnicalData,
        updateRevenue,
        addRevenue,
        removeRevenue,
        updatePosition,
        addPosition,
        removePosition,
        updateCapex,
        addCapex,
        removeCapex,
        updateDirectSupply,
        addDirectSupply,
        removeDirectSupply,
        updateOperatingExpense,
        addOperatingExpense,
        removeOperatingExpense,
        setWorkingCapitalDays,
        setDiscountRate,
        updateConesaImpact,
        addConesaImpact,
        removeConesaImpact,
        resetToDefault,
        engineOutput,
        conesaSummary,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

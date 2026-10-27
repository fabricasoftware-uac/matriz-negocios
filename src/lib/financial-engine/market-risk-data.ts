/**
 * Market, Risk, Legal and Technical Data Models and Default Benchmarks
 * Methodology: Jorge Orozco Business Evaluation
 */

export interface MarketAttribute {
  id: string;
  name: string;
  description: string;
}

export interface CompetitorScore {
  competitorId: string;
  competitorName: string;
  scores: Record<string, number>; // attributeId -> score (1-10)
  color: string;
}

export const MARKET_ATTRIBUTES: MarketAttribute[] = [
  { id: "precio", name: "Precio", description: "Competitividad de precios y tarifas" },
  { id: "calidad", name: "Calidad", description: "Excelencia y acabado de productos/servicios" },
  { id: "imagen", name: "Imagen", description: "Percepción de marca y presencia visual" },
  { id: "marca", name: "Reconocimiento de marca", description: "Top of mind en el público objetivo" },
  { id: "relacion", name: "Relación con clientes", description: "Cercanía, empatía y fidelización" },
  { id: "ubicacion", name: "Ubicación", description: "Accesibilidad física y cobertura estratégica" },
  { id: "servicio", name: "Servicio al cliente", description: "Atención rápida, amable y resolutiva" },
  { id: "postventa", name: "Servicio Post-Venta", description: "Soporte y garantías posteriores a la venta" },
  { id: "entrega", name: "Tiempo de entrega", description: "Puntualidad y agilidad de entrega" },
  { id: "pago", name: "Formas de pago", description: "Variedad de pasarelas y facilidades de pago" },
  { id: "costes", name: "Costes", description: "Estructura eficiente de costes operativos" },
];

export const DEFAULT_OUR_COMPANY_SCORES: Record<string, number> = {
  precio: 8,
  calidad: 10,
  imagen: 5,
  marca: 5,
  relacion: 10,
  ubicacion: 1,
  servicio: 10,
  postventa: 6,
  entrega: 10,
  pago: 10,
  costes: 5,
};

export const DEFAULT_COMPETITORS: CompetitorScore[] = [
  {
    competitorId: "raw-talent",
    competitorName: "Raw Talent",
    color: "#8b5cf6", // Purple
    scores: {
      precio: 0,
      calidad: 5,
      imagen: 10,
      marca: 10,
      relacion: 10,
      ubicacion: 10,
      servicio: 10,
      postventa: 0,
      entrega: 0,
      pago: 0,
      costes: 0,
    },
  },
  {
    competitorId: "dc-influenc",
    competitorName: "DCInfluenc",
    color: "#f59e0b", // Amber
    scores: {
      precio: 0,
      calidad: 10,
      imagen: 10,
      marca: 10,
      relacion: 0,
      ubicacion: 10,
      servicio: 0,
      postventa: 0,
      entrega: 0,
      pago: 0,
      costes: 0,
    },
  },
  {
    competitorId: "match-agenc",
    competitorName: "MatchAgenc",
    color: "#ec4899", // Pink
    scores: {
      precio: 0,
      calidad: 10,
      imagen: 10,
      marca: 5,
      relacion: 0,
      ubicacion: 10,
      servicio: 10,
      postventa: 0,
      entrega: 0,
      pago: 0,
      costes: 0,
    },
  },
  {
    competitorId: "ranga-media",
    competitorName: "RangaMedia",
    color: "#06b6d4", // Cyan
    scores: {
      precio: 0,
      calidad: 10,
      imagen: 10,
      marca: 5,
      relacion: 0,
      ubicacion: 10,
      servicio: 0,
      postventa: 0,
      entrega: 0,
      pago: 0,
      costes: 0,
    },
  },
  {
    competitorId: "trendset",
    competitorName: "Trendset",
    color: "#10b981", // Emerald
    scores: {
      precio: 0,
      calidad: 10,
      imagen: 10,
      marca: 8,
      relacion: 0,
      ubicacion: 10,
      servicio: 0,
      postventa: 0,
      entrega: 0,
      pago: 0,
      costes: 0,
    },
  },
  {
    competitorId: "somos-influ",
    competitorName: "SomosInflu",
    color: "#64748b", // Slate
    scores: {
      precio: 0,
      calidad: 5,
      imagen: 5,
      marca: 2,
      relacion: 0,
      ubicacion: 3,
      servicio: 0,
      postventa: 0,
      entrega: 0,
      pago: 0,
      costes: 0,
    },
  },
];

/* Risk Matrix Types & Data */

export type RiskLevel = "Bajo" | "Moderado" | "Alto" | "Extremo";

export interface RiskItem {
  id: string;
  process: string;
  risk: string;
  probability: number; // 1 to 5 (1: Raro, 2: Improbable, 3: Posible, 4: Probable, 5: Frecuente)
  probabilityLabel: string;
  impact: number; // 1 to 5 (1: Insignificante, 2: Menor, 3: Moderado, 4: Mayor, 5: Catastrófico)
  impactLabel: string;
  control: string;
  whatItControls: string;
  level: RiskLevel;
}

export function calculateRiskLevel(probability: number, impact: number): RiskLevel {
  const score = probability * impact;
  if (score <= 4) return "Bajo";
  if (score <= 8) return "Moderado";
  if (score <= 15) return "Alto";
  return "Extremo";
}

export const PROBABILITY_LABELS: Record<number, string> = {
  1: "Raro",
  2: "Improbable",
  3: "Posible",
  4: "Probable",
  5: "Casi Seguro",
};

export const IMPACT_LABELS: Record<number, string> = {
  1: "Insignificante",
  2: "Menor",
  3: "Moderado",
  4: "Mayor",
  5: "Catastrófico",
};

export const DEFAULT_RISKS: RiskItem[] = [
  {
    id: "risk-1",
    process: "Gestión Financiera",
    risk: "Errores en la liquidación del impuesto en la elaboración de la factura.",
    probability: 1,
    probabilityLabel: "Raro",
    impact: 2,
    impactLabel: "Menor",
    control: "La facturación se realiza a través de la herramienta gratuita de la DIAN.",
    whatItControls: "Errores humanos en la liquidación de impuestos. Caída constante de la plataforma.",
    level: "Bajo",
  },
  {
    id: "risk-2",
    process: "Gestión Financiera",
    risk: "Mala práctica en la contabilización de factura o cuentas de cobro de proveedores que no cumplan requisitos de ley.",
    probability: 1,
    probabilityLabel: "Raro",
    impact: 1,
    impactLabel: "Insignificante",
    control: "Verificación de los requisitos de la ley para facturación, cuentas de cobro y soportes. Auditoría de Revisoría Fiscal.",
    whatItControls: "Registros y pagos sin los requisitos exigidos en las normas y leyes contables vigentes. Incumplimientos de normas internacionales.",
    level: "Bajo",
  },
  {
    id: "risk-3",
    process: "Gestión Financiera",
    risk: "Errores en la liquidación del impuesto en la contabilización de la factura.",
    probability: 1,
    probabilityLabel: "Raro",
    impact: 2,
    impactLabel: "Menor",
    control: "Verificación de la causación por el auxiliar contable y una segunda instancia por el contador.",
    whatItControls: "Errores humanos en el registro contable de la factura.",
    level: "Bajo",
  },
  {
    id: "risk-4",
    process: "Gestión Financiera",
    risk: "Causación doble de una factura o cuenta de cobro.",
    probability: 1,
    probabilityLabel: "Raro",
    impact: 3,
    impactLabel: "Moderado",
    control: "Siigo controla la duplicidad en la numeración de la factura.",
    whatItControls: "Errores humanos en el registro contable y alta rotación de personal en el área contable.",
    level: "Moderado",
  },
  {
    id: "risk-5",
    process: "Gestión Financiera",
    risk: "Pérdida de las facturas y cuentas de cobro.",
    probability: 1,
    probabilityLabel: "Raro",
    impact: 2,
    impactLabel: "Menor",
    control: "Gestión en el archivo de cuentas por pagar y auditorías constantes del archivo.",
    whatItControls: "Descuidos con los documentos soporte, sobrecarga laboral o falta de asignación clara de funciones.",
    level: "Bajo",
  },
  {
    id: "risk-6",
    process: "Gestión Financiera",
    risk: "Fraude en la información contable.",
    probability: 1,
    probabilityLabel: "Raro",
    impact: 4,
    impactLabel: "Mayor",
    control: "Desagregación estricta de funciones y auditorías independientes de revisoría fiscal.",
    whatItControls: "Falta de valores, debilidad en controles internos e información fraudulenta o sin razonabilidad.",
    level: "Alto",
  },
  {
    id: "risk-7",
    process: "Gestión Financiera",
    risk: "Ausencia de variables estratégicas en la definición del presupuesto.",
    probability: 3,
    probabilityLabel: "Posible",
    impact: 3,
    impactLabel: "Moderado",
    control: "Planear de acuerdo al PAT (Presupuesto Anual de Trabajo). Revisión contable y aprobación por Junta Directiva, Socios o Gerente.",
    whatItControls: "Gastos que no estén orientados al cumplimiento del objeto misional o desbordamiento financiero.",
    level: "Alto",
  },
];

/* Legal & Technical Data */

export interface LegalProjectData {
  companyName: string;
  commercialName: string;
  companyType: string;
  partnersCount: number;
  authorizedCapital: number;
  subscribedCapital: number;
  paidCapital: number;
  shareCount: number;
  shareNominalValue: number;
  legalRepresentative: string;
  legalRepId: string;
  legalRepLimitSmlmv: number;
  companySize: string;
  ciiuPrincipal: { code: string; name: string };
  ciiuSecondary: { code: string; name: string };
  ciiuOther: { code: string; name: string };
  dianObligations: string[];
  supervisionEntity: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  corporatePurpose: string;
}

export const DEFAULT_LEGAL_DATA: LegalProjectData = {
  companyName: "Compañía Digital Xparta Entertainment SAS",
  commercialName: "Xparta SAS",
  companyType: "Sociedad por Acciones Simplificada (S.A.S.)",
  partnersCount: 5,
  authorizedCapital: 1000000,
  subscribedCapital: 1000000,
  paidCapital: 1000000,
  shareCount: 1000,
  shareNominalValue: 1000,
  legalRepresentative: "Yulian Eduardo Rosales Viveros",
  legalRepId: "1087199552",
  legalRepLimitSmlmv: 25,
  companySize: "MICRO EMPRESA (Decreto 1074 de 2015 / Res. 2225 de 2019 DANE)",
  ciiuPrincipal: {
    code: "R9004",
    name: "Creación Audiovisual",
  },
  ciiuSecondary: {
    code: "R9002",
    name: "Creación Musical",
  },
  ciiuOther: {
    code: "J5911",
    name: "Actividades de producción de películas, videos, programas y comerciales de TV",
  },
  dianObligations: [
    "05 - Impuesto renta y compl. régimen ordinario",
    "07 - Retención en la fuente a título de renta",
    "14 - Informante de exógena",
    "42 - Obligado a llevar contabilidad",
    "48 - Impuesto sobre las ventas - IVA",
    "52 - Facturador electrónico",
  ],
  supervisionEntity: "Superintendencia de Sociedades",
  address: "Calle 3N # 10-04, Barrio Modelo",
  city: "Popayán, Cauca",
  phone: "6028359408",
  email: "comercial@xpartaentertainment.com",
  corporatePurpose:
    "Creación de entretenimiento digital, capacitación en estrategias para monetizar redes sociales, compra, venta y creación de páginas web y fan pages, producción de contenido audiovisual y multimedia, y representación de artistas.",
};

export interface TechnicalProjectData {
  city: string;
  department: string;
  transportFactors: string;
  organicDistributionFactor: string;
  laborFactors: string;
  virginMarketFactor: string;
  populationFactor: string;
}

export const DEFAULT_TECHNICAL_DATA: TechnicalProjectData = {
  city: "Popayán",
  department: "Cauca",
  transportFactors:
    "Cercanía a locaciones urbanas y rurales, bajos costos de desplazamiento y rápida respuesta operativa.",
  organicDistributionFactor:
    "Al ser Popayán una ciudad intermedia con alta densidad relacional, la participación de talentos y público local detona viralidad orgánica inicial inmediata.",
  laborFactors:
    "Fácil acceso a talento joven universitario en diseño, multimedia y marketing con esquemas de remuneración flexibles y competitivos.",
  virginMarketFactor:
    "Mercado poco saturado en creadores de contenido profesional e influenciadores digitales frente a Bogotá o Medellín.",
  populationFactor:
    "Población receptiva, participativa y flexible ante dinámicas de retos, activaciones de marca y producción en calle.",
};

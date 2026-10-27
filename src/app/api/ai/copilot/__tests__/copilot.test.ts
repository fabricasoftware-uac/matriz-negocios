import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

describe("AI Copilot API Route (/api/ai/copilot)", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("should gracefully return friendly rule-based response when OPENROUTER_API_KEY is not set (Golden Rule)", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");

    const req = new Request("http://localhost:3000/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "audit",
        projectMetrics: {
          projectName: "Xparta SAS Test",
          irr: 0.5649,
          excelNpv: 164717348,
          discountRate: 0.1,
          fclYear0: -30701378,
          workingCapitalDays: { cxcDays: 60, cxpDays: 60, inventoryDays: 90 },
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.isAiOffline).toBe(true);
    expect(json.notice).toContain("La IA con OpenRouter es opcional");
    expect(json.result).toContain("Auditoría de Viabilidad Estratégica");
    expect(json.result).toContain("56.49%");
    expect(json.result).toContain("164.717.348");
  });

  it("should handle margins optimization action in offline mode", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");

    const req = new Request("http://localhost:3000/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "margins",
        projectMetrics: {
          projectName: "Xparta SAS",
          workingCapitalDays: { cxcDays: 60, cxpDays: 60, inventoryDays: 90 },
        },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.result).toContain("Optimización de Márgenes");
    expect(json.result).toContain("KTNO");
  });

  it("should handle pitch generation action in offline mode", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");

    const req = new Request("http://localhost:3000/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "pitch",
        projectMetrics: {
          projectName: "Xparta SAS",
          irr: 0.5649,
          excelNpv: 164717348,
        },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.result).toContain("Executive Pitch");
    expect(json.result).toContain("Popayán");
  });
});

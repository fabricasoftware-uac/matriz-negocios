import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { createClient as createBrowserClient } from "../client";
import { createClient as createServerClient, createAdminClient } from "../server";
import { updateSession } from "../middleware";
import type { NextRequest } from "next/server";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}));

describe("Supabase Client Factories", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Browser Client", () => {
    it("throws an error if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      expect(() => createBrowserClient()).toThrow(
        /Missing Supabase environment variables/
      );
    });

    it("successfully instantiates client when environment variables are defined", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key";

      const client = createBrowserClient();
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
    });
  });

  describe("Server Client", () => {
    it("throws an error if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await expect(createServerClient()).rejects.toThrow(
        /Missing Supabase environment variables/
      );
    });

    it("successfully instantiates server client when environment variables are defined", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key";

      const client = await createServerClient();
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
    });

    it("throws error for createAdminClient if SUPABASE_SERVICE_ROLE_KEY is missing", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      await expect(createAdminClient()).rejects.toThrow(
        /Missing Supabase admin environment variables/
      );
    });

    it("instantiates createAdminClient when service role key is provided", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "dummy-service-key";

      const adminClient = await createAdminClient();
      expect(adminClient).toBeDefined();
    });
  });

  describe("Middleware Helper", () => {
    it("returns null user when environment variables are not configured", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const mockRequest = {
        cookies: {
          getAll: () => [],
          set: vi.fn(),
        },
        nextUrl: {
          pathname: "/",
        },
      } as unknown as NextRequest;

      const { user, supabaseResponse } = await updateSession(mockRequest);
      expect(user).toBeNull();
      expect(supabaseResponse).toBeDefined();
    });
  });
});

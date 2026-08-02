import { describe, expect, it } from "vitest";
import {
  canNavigateToModule,
  getNavigationItemByHref,
  isNavigationItemActive,
  moduleStateLabels,
  moduleStateShowcase,
  navigationItems
} from "../../lib/modules/navigation";

describe("app shell navigation contracts", () => {
  it("keeps the official module state vocabulary", () => {
    expect(Object.keys(moduleStateLabels)).toEqual(["AVAILABLE", "LOCKED", "COMING_SOON", "DISABLED", "MAINTENANCE"]);
    expect(moduleStateShowcase.map((state) => state.id)).toEqual(["AVAILABLE", "LOCKED", "COMING_SOON", "DISABLED", "MAINTENANCE"]);
  });

  it("maps approved app shell routes and active states", () => {
    expect(navigationItems.map((item) => item.href)).toEqual([
      "/inicio",
      "/precificacao",
      "/estoque",
      "/fornecedores",
      "/minicursos",
      "/minha-assinatura",
      "/minha-conta"
    ]);

    const inicio = navigationItems[0];
    expect(getNavigationItemByHref("/inicio")).toMatchObject({ id: "inicio" });
    expect(getNavigationItemByHref("/inicio/detalhe")).toMatchObject({ id: "inicio" });
    expect(isNavigationItemActive("/minha-conta", navigationItems.at(-1)!)).toBe(true);
    expect(isNavigationItemActive("/login", inicio)).toBe(false);
  });

  it("allows navigation only for available structural destinations", () => {
    const byId = Object.fromEntries(navigationItems.map((item) => [item.id, item]));

    expect(canNavigateToModule(byId.inicio)).toBe(true);
    expect(canNavigateToModule(byId["minha-conta"])).toBe(true);
    expect(canNavigateToModule(byId["minha-assinatura"])).toBe(true);
    expect(canNavigateToModule(byId.precificacao)).toBe(true);
    expect(canNavigateToModule(byId.estoque)).toBe(false);
    expect(canNavigateToModule(byId.fornecedores)).toBe(false);
    expect(canNavigateToModule(byId.minicursos)).toBe(false);
  });

  it("keeps future modules visible as structure without enabled actions", () => {
    const futureModules = navigationItems.filter((item) => item.state === "COMING_SOON");

    expect(futureModules.map((item) => item.id)).toEqual(["estoque", "fornecedores", "minicursos"]);
    expect(futureModules.every((item) => item.description.includes("futur") || item.description.includes("Porta estrutural"))).toBe(true);
    expect(futureModules.every((item) => canNavigateToModule(item) === false)).toBe(true);
  });
});

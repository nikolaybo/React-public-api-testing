import type { RouteObject } from "react-router";
import { routes } from "@/routes/AppRoutes";
import type { NavHandle, NavLinkItem, NavLinkNode } from "@/types/navigation";

function isNavHandle(handle: unknown): handle is NavHandle {
  if (typeof handle !== "object" || handle === null) return false;
  const h = handle as {
    nav?: unknown;
    label?: unknown;
    parent?: unknown;
    side?: unknown;
  };
  return (
    (h.nav === "header" || h.nav === "footer") &&
    typeof h.label === "string" &&
    (h.parent === undefined || typeof h.parent === "string") &&
    (h.side === undefined || h.side === "left" || h.side === "right")
  );
}

function collect(routeTree: RouteObject[]): NavLinkItem[] {
  const out: NavLinkItem[] = [];
  const walk = (nodes: RouteObject[]) => {
    for (const node of nodes) {
      if (node.path && isNavHandle(node.handle)) {
        out.push({
          path: node.path,
          label: node.handle.label,
          slot: node.handle.nav,
          parent: node.handle.parent,
          side: node.handle.side ?? "left",
        });
      }
      if (node.children) walk(node.children);
    }
  };
  walk(routeTree);
  return out;
}

let cache: { header: NavLinkNode[]; footer: NavLinkItem[] } | null = null;

function build() {
  if (cache) return cache;
  const all = collect(routes);
  cache = {
    header: all
      .filter((l) => l.slot === "header" && !l.parent)
      .map((root) => ({
        ...root,
        children: all.filter((l) => l.parent === root.path),
      })),
    footer: all.filter((l) => l.slot === "footer"),
  };
  return cache;
}

export const getHeaderTree = (): NavLinkNode[] => build().header;
export const getFooterLinks = (): NavLinkItem[] => build().footer;

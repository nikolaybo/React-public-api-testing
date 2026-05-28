export type NavSlot = "header" | "footer";
export type NavSide = "left" | "right";

export interface NavHandle {
  label: string;
  nav: NavSlot;
  parent?: string;
  side?: NavSide;
}

export interface NavLinkItem {
  path: string;
  label: string;
  slot: NavSlot;
  parent?: string;
  side: NavSide;
}

export interface NavLinkNode extends NavLinkItem {
  children: NavLinkItem[];
}

// Prop shapes for route-guard components in `src/routes/*`. Routes are part of
// navigation, so their guard-prop types live here rather than in a separate file.
export interface RoleRouteProps {
  allowedRoles: string[];
}

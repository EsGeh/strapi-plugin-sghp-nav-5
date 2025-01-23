import * as types from "../basic";


export type Navigation = types.Navigation<NavItem>;

export type NavItem = types.NavItem<NavItemData>;

export type NavItemData =
  types.Optional<types.NavItemData, "id"|"documentId">;

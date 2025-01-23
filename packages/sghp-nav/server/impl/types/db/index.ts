import * as types from "../basic";


export type NavFromDB = types.Navigation<NavItemFromDB>;
export type NavItemFromDB = Omit<NavItemFlat, "order">;
export type NavItemToDB = Omit<NavItemFlat, "subItems">;

export type NavItemFlat = Omit<types.NavItemData,"related"> & {
  subItems: { id: number }[],
  parent?: { id: number },
  order: number,
  related: {
    [field: string]: any,
  }|null,
};

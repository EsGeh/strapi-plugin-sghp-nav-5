
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Navigation<Item, NavData = NavigationData> = NavData & {
  items: Item[],
};

export type NavItem<Data = NavItemData> = Data & {
  subItems: NavItem<Data>[],
};

export interface Localization {
  id: number,
  name: string,
  locale: string,
}

export interface Locale {
  id: number,
  name: string,
  code: string,
  isDefault: boolean,
}

export interface NavigationData {
  id: number,
  documentId: string,
  name: string,
  locale: string,
  // localizations: Localization[]
}

export interface NavItemData<Related = any> {
  id: number,
  documentId: string,
  title: string,
  path: string,
  related: Related|null,
}

import * as types from '../../server/impl/types/admin';

export type {
  Related,
  Locale,
} from '../../server/impl/types/admin';

export type {
  Config
} from '../../server/impl/config';


export type FrontNav = types.Navigation<FrontNavItem >
export type FrontNavItem =
  types.NavItem<ItemData>;

type ItemData =
  Omit<types.NavItemData,"id"> & {
    id?: types.NavItemData["id"],
    removed: boolean,
  }

export type NavInfo = {
  name: string,
  id: number,
}

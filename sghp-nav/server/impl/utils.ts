import * as db from "./types/db";
import * as types from "./types/basic";


export function fromFlatItems(
  itemsRaw: db.NavItemFromDB[]
):
  types.NavItem[]
{
  let retItems: types.NavItem[] = [];
  // next elements to add.
  // FORMAT: [parentToAddEl, elToAdd]:
  let itemsToAdd: [types.NavItem|null, db.NavItemFromDB][] = itemsRaw.filter( x => !x.parent ).map( x => [null, x]);
  // descend the menu level by level (breadth first)
  // and add elements:
  while( itemsToAdd.length > 0 ) {
    let added = [];
    let addNext = [];
    for( const [parent, item] of itemsToAdd ) {
      const newEl = {
        id: item.id,
        title: item.title,
        path: item.path,
        related: item.related,
        subItems: [],
      };
      if( !parent ) {
        retItems.push( newEl );
      }
      else {
        if( !parent.subItems ) {
          parent.subItems = [];
        }
        parent.subItems.push( newEl );
      }
      if( item.subItems ) {
        let subItems = [];
        item.subItems.forEach( subRaw => {
          const subItem = itemsRaw.find( i => i.id == subRaw.id );
          if( ! subItem ) { /* log( "inconsistent data!" ); */ }
          else {
            subItems.push( subItem );
          }
        } );
        addNext.push( ...subItems.map( x => [newEl, x] ) );
      }
    }
    itemsToAdd = addNext;
  }
  return retItems;
};

export function toFlatItems( items: types.NavItem[] ):
  db.NavItemToDB[]
{
  return toFlatItemsHelper( null, items );
}

export function adminRenderRelated(
  items: types.NavItem[],
  relatedDisplayField: string,
):
  types.NavItem[]
{
  return items.map( item => ({
    ...item,
    related:
      item.related
      ? {
        id: item.related.id,
        displayName: item.related[relatedDisplayField],
      }
      : null,
    subItems: adminRenderRelated( item.subItems, relatedDisplayField ),
  }));
}

function toFlatItemsHelper( parent: number|null, items: types.NavItem[] ):
  db.NavItemToDB[]
{
  let retItems: db.NavItemToDB[] = [];
  items.forEach( (item, i) => {
    retItems.push( {
      ...item,
      parent: { id: parent } || undefined,
      order: i,
    });
    retItems.push(
      ...toFlatItemsHelper( item.id, item.subItems )
    );
  });
  return retItems;
}

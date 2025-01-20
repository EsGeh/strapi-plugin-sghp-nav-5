import { PLUGIN_ID as pluginId } from "./pluginId";
import { FrontNav, FrontNavItem, Locale, } from './types'
import * as utils from './utils'
import * as backendTypes from '../../server/impl/types/admin';
import { Config } from '../../server/impl/config';

import { getFetchClient } from '@strapi/strapi/admin';

import * as qs from "qs";


export async function get(
  locale?: string,
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  let query: { [k:string]: any } = {}
  if( locale ) { query.locale = locale;}
  const queryString = qs.stringify( query );

  let response;
  try {
    response = await client.get<{ data: backendTypes.Navigation[] }>( `/${pluginId}/navigations?${ queryString }`);
  }
  catch( error ) {
    throw error;
  };
  return response.data.data.map( utils.navFromBackend );
};

export async function getConfig(
  locale?: string,
):
  Promise<Config>
{
  const client = getFetchClient();
  const res: { data: Config } = await client.get( `/${pluginId}/config`);
  return res.data;
}

export async function getLocales():
  Promise<Locale[]>
{
  const client = getFetchClient();
  const res = await client.get( `/i18n/locales`);
  return res.data;
};

export async function update(
  data: FrontNav,
  locale?: string,
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  let query: { [k:string]: any } = {}
  // if( locale ) { query.locale = locale;}
  const queryString = qs.stringify( query );
  const dataToSend = {
    ...data,
    items: applyRemove( data.items )
  };

  let response: FrontNav[] | null;
  try {
    await client.put(
      `/${pluginId}/navigations/${data.documentId}`,
      dataToSend
    );
    response = await get( locale );
  }
  catch( error ) {
    throw error;
  };
  return response;
};

export async function addItem(
  item: Omit<FrontNavItem,"id"|"documentId">,
  navId: number,
  parent?: FrontNavItem,
  locale?: string,
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  let dataToSend: { [k:string]: any } = {
    ...item,
    master: navId,
  }
  if( parent ) { dataToSend.parent = parent.id; }
  if( item.related ) { dataToSend.related = item.related.id; }
  if( locale ) { dataToSend.locale = locale }
  let response: FrontNav[] | null;
  try {
    await client.post( `/${pluginId}/navigations/items`,
      dataToSend
    );
    response = await get( locale );
  }
  catch( e ) {
    throw e;
  }
  return response;
};

export async function updateItem(
  item: FrontNavItem,
  locale?: string,
):
  Promise<FrontNav[]>
{
  const client = getFetchClient();
  const {
    id,
    documentId,
    removed,
    subItems,
    ...dataToSend
  } = item;

  let response: FrontNav[] | null;
  try {
    await client.put( `/${pluginId}/navigations/items/${item.documentId}`,
      dataToSend
    );
    response = await get( locale );
  }
  catch( e ) {
    throw e;
  }
  return response;
};

/*****************
 * Utils:
 *****************
*/

function applyRemove( items: FrontNavItem[] )
  : FrontNavItem[]
{
  return items.filter(item => !item.removed).map( item => {
    return {
      ...item,
      subItems: applyRemove( item.subItems ),
    };
  })
}

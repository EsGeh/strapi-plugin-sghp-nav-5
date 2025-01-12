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
    // console.log( "response:" );
    // console.log( JSON.stringify( response, null, 2 ) );
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

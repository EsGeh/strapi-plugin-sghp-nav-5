import Item, { ItemEditHooks } from '../Item';
import {
  FrontNav,
  FrontNavItem,
  Config,
} from '../../types'

import {
  Box,
  Flex,
  Button,
} from '@strapi/design-system';
import {
  Plus,
} from '@strapi/icons';
import {
  useTheme,
} from 'styled-components';
import React, { FunctionComponent } from 'react';

export { ItemEditHooks } from '../Item';

type Args = {
  config: Config,
  items: FrontNavItem[],
} & ItemEditHooks;

export default function ItemList(args : Args) {
  const { config, items, ...itemEditHooks } = args;
  const theme = useTheme();
  return (
    <Flex
      background={ theme['colors']['neutral150'] }
      padding={ theme['spaces'][2] }
      gap={ theme['spaces'][2] }
      direction="column"
      alignItems="stretch"

    >{
      items.map( (item, i) => {
        return <Item
          config={ config }
          key={ i }
          level={ 0 }
          item={ item }
          { ...itemEditHooks }
        />
      } )
    }
      <Button
        fullWidth
        startIcon={<Plus />}
        label={ "label" }
        onClick={ () => { itemEditHooks.onAddItemClicked(); } }
      >{
        "Add Child"
      }</Button>
    </Flex>
  );
};

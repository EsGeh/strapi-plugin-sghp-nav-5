import {
  FrontNav,
  FrontNavItem,
  Config,
} from '../../types'
import * as utils from '../../utils';

import {
  Flex,
  Box,
  Card,
  CardBody,
  Badge,
  Typography,
  IconButton,
  Button,
} from '@strapi/design-system';
import {
  Pencil,
  Trash,
  ArrowClockwise,
  Plus,
  ArrowUp,
  ArrowDown,
} from '@strapi/icons';
import { useTheme } from 'styled-components';
import { FunctionComponent } from 'react';

type Args = {
  config: Config,
  item: FrontNavItem,
  parentPath?: string,
  level: number,
} & ItemEditHooks;

export type ItemEditHooks = {
  onSetRemoved: (item: FrontNavItem, removed: boolean) => void,
  onEditItemClicked: (item: FrontNavItem) => void,
  onAddItemClicked: (parent?: FrontNavItem) => void,
  onMoveUp: (item: FrontNavItem) => void,
  onMoveDown: (item: FrontNavItem) => void,
}

export default function Item(args : Args) {
  const { config, item, parentPath, level} = args;
  const theme = useTheme();
  const path: string = utils.renderPath(item, config.hierarchicalPaths, parentPath);
  return (
    <Flex
      // marginTop={ theme['spaces'][2] }
      // marginBottom={ theme['spaces'][2] }
      direction="column"
      alignItems="stretch"
      gap={ theme['spaces'][2] }
    >
      <ItemCard { ...{...args, path: path }  }/>
      { /* subitems: */ }
      { item.subItems.length > 0 &&
        <Box
          paddingLeft={ theme['spaces'][8] }
        >
        { item.subItems.map( (subItem, i) => (
          <Item
            key={ i }
            { ...{
              ...args,
              parentPath: path,
              level: level+1,
              item: subItem,
            } }
          />
        ) ) }
        </Box>
      }
    </Flex>
  );
};

const ItemCard: FunctionComponent<Args & { path: string }> = (args) => {
  const {
    item,
    path,
    level,
    ...itemEditHooks
  } = args;
  const theme = useTheme();
  // return <div>{ item.path }</div>;
  return (
    <Card
      background={ theme['colors']['neutral300'] }
      {
      ...( item.removed ? {
        style: { opacity: 0.5 }
      } : {}
        // ...{ style: { opacity: 0.5 } }
      )
      }
    >
      <CardBody
        direction="column"
        alignItems="stretch"
        gap={ theme['spaces'][2] }
        width="100%"
      >
        <Flex
          alignItems="center"
          width="100%"
          gap={ theme['spaces'][2] }
        >
          { /* CAPTIONS */ }
          <Flex
            flexGrow="0"
            alignItems="center"
            width="100%"
            wrap="wrap"
            gap={ theme['spaces'][2] }
          >
            <Box
              padding={ theme['spaces'][2] }
              grow={ 1 }
              width="150px"
              borderColor="neutral200"
              // background="neutral200"
            >
              <Typography
                elipsis
                fontWeight="bold"
                textColor={ theme['colors']['primary800'] }
              >{
                item.title
              }</Typography>
            </Box>
            <Box
              padding={ theme['spaces'][2] }
              grow={ 1 }
              width="150px"
              borderColor="neutral200"
              // background="neutral200"
            >
              <Typography
                elipsis
                fontWeight="bold"
                textColor={ theme['colors']['primary800'] }
              >{
                path
              }</Typography>
            </Box>
            <Box
              grow={ 1 }
              padding={ theme['spaces'][2] }
              width="150px"
            >
            {
              item.related
              &&
              <Badge
                active={ item.related }
              >{
                `${ item.related?.displayName }`
              }</Badge>
            }
            </Box>
          </Flex>
          { /* EDIT BUTTONS */ }
          <Flex
            alignItems="center"
            gap={ theme['spaces'][2] }
          >
          <IconButton
            disabled={ item.removed }
            onClick={ () => { itemEditHooks.onMoveUp( item ); } }
            label={ "Move Up"}
          >
            <ArrowUp/>
          </IconButton>
          <IconButton
            disabled={ item.removed }
            onClick={ () => { itemEditHooks.onMoveDown( item ); } }
            label={ "Move Down"}
          >
            <ArrowDown/>
          </IconButton>
          <IconButton
            disabled={ item.removed }
            onClick={ () => { itemEditHooks.onEditItemClicked( item ); } }
            label={ "Edit"}
          >
            <Pencil/>
          </IconButton>
          { !item.removed
              ? <IconButton
                onClick={ () => { itemEditHooks.onSetRemoved(item, true); } }
                label={ "Remove"}
              ><Trash/></IconButton>
              : <IconButton
                onClick={ () => { itemEditHooks.onSetRemoved(item, false); } }
                label={ "Restore"}
              ><ArrowClockwise/></IconButton>
          }
          </Flex>
        </Flex>
        <Button
          disabled={ item.removed }
          fullWidth
          startIcon={<Plus />}
          label={ "label" }
          onClick={ () => { itemEditHooks.onAddItemClicked( item ); } }
        >{
          "Add Child"
        }</Button>
      </CardBody>
    </Card>
  );
}

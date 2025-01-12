import * as api from '../api';
import { PLUGIN_ID as pluginId } from '../pluginId';
import {
  FrontNav,
  FrontNavItem,
  Locale,
  Config,
} from '../types'
import ItemList, { ItemEditHooks } from '../components/List';
import * as utils from '../utils';


import {
  Main,
  EmptyStateLayout,
  Button,
} from '@strapi/design-system';
import {
  Layouts,
  Page,
} from '@strapi/strapi/admin';
import {
  Plus,
} from '@strapi/icons';
import { useIntl } from 'react-intl';
import {
  useState,
  useEffect,
  use,
  Suspense,
} from 'react';

import { getTranslation } from '../utils/getTranslation';


type PageState = PageStateError | PageStateLoading | PageStateOK;

type PageStateOK = {
  type: "ok",
  data: Data,
  selection: Selection,
};

type PageStateLoading = {
  type: "loading",
  data?: Data,
  selection?: Selection,
  // selection: Optional<Selection, "locale">,
};
type PageStateError = {
  type: "error",
  error: string
  selection?: Selection,
};

type Data = {
  config: Config,
  navigations: FrontNav[],
  locales: Locale[],
};

type Selection = {
  name: string,
  locale: string,
  // navigation?: FrontNav,
  // newNavFormParams: NewNavParams|null,
  // itemFormParams: ItemFormParams|null,
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/*
type NewNavParams = {};

type ItemFormParams = {
  parent?: FrontNavItem,
  item?: FrontNavItem,
  errors: string[],
};
*/

const Header = () => {
  return <Layouts.Header
    title={ pluginId }
    subtitle="Edit Navigation"
    // primaryAction={ "PrimaryAction" }
  />;
};

const NavEditor = (
  args
  : {
    state: PageStateOK,
  } & ItemEditHooks
) => {
  const state = args.state;
  const navigation = state.data.navigations.find(navigation => navigation.name === state.selection.name);
  return <Layouts.Content>{
    !navigation
    ? <EmptyStateLayout
      content="No navigation yet..."
      action={
        <Button
          startIcon={<Plus />}
          onClick={ () => { } }
        >{
          "Add Navigation"
        }</Button>
      }
    />
    : <ItemList
      config={ state.data.config }
      items={ navigation.items }
      { ...args }
    />
  }</Layouts.Content>;
};

const HomePage = () => {

  const { formatMessage } = useIntl();
  const [pageState, setPageState] = useState<PageState>({
    type: "loading",
  });

  function loadData(
    name?: string,
    locale?: string,
  ) {
    setPageState({
      type:"loading",
      data: (pageState.type=="ok" || pageState.type=="loading") ? pageState.data : undefined,
      selection: pageState.selection,
    });
    Promise.all([
      api.getConfig(),
      api.getLocales(),
      api.get()
    ]).then(([config,locales,navigations]) => {
      name = name || pageState.selection?.name || "Main";
      locale = locale || pageState.selection?.locale || locales.find(locale => locale.isDefault)?.code;
      if( !locale ) {
        throw Error("no default locale!");
      }
      setPageState({
        type: "ok",
        data: {
          config: config,
          locales: locales,
          navigations: navigations,
        },
        selection: {
          name: name,
          locale: locale
        }
      });
    }).catch( error => {
      setPageState({
        type: "error",
        error: error,
        selection: pageState.selection,
      });
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  if( pageState.type == "error" ) {
    throw pageState.error;
  }
  else if( pageState.type == "loading" ) {
    return <div>Page loading</div>;
  }

  const itemEditHooks = {
    onSetRemoved: (item: FrontNavItem, removed: boolean) => {
      console.log( "onSetRemoved" );
    },
    onEditItemClicked: (item: FrontNavItem) => {
      console.log( "onEditItemClicked" );
    },
    onAddItemClicked: (parent?: FrontNavItem) => {
      console.log( "onAddItemClicked" );
    },
    onMoveUp: (item: FrontNavItem) => {
      console.log( "onMoveUp" );
    },
    onMoveDown: (item: FrontNavItem) => {
      console.log( "onMoveDown" );
    },
  };

  return (
    <Layouts.Root>
      <Page.Title>{ pluginId }</Page.Title>
      <Header />
      <Page.Main>
        <NavEditor state={pageState}
          { ...itemEditHooks }
        />
      </Page.Main>
    </Layouts.Root>
  );
};

export { HomePage };

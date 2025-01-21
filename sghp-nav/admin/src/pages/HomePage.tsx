import * as api from '../api';
import { PLUGIN_ID as pluginId } from '../pluginId';
import {
  FrontNav,
  FrontNavItem,
  Locale,
  Config,
} from '../types'
import ItemList, { ItemEditHooks } from '../components/List';
import ItemModal, {
  ItemFormHooks,
  Args as ItemModalArgs
} from '../components/ItemModal';
import NavigationModal, {
  FormHooks as NavFormHooks,
  Args as NavModalArgs,
  Return as NavModalReturn,
} from '../components/NavigationModal';
import * as utils from '../utils';


import {
  Main,
  EmptyStateLayout,
  Button,
  IconButton,
  Flex,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import {
  Layouts,
  Page,
} from '@strapi/strapi/admin';
import {
  Plus,
  Trash,
  Check,
} from '@strapi/icons';
import { useIntl } from 'react-intl';
import {
  useState,
  useEffect,
  use,
  Suspense,
} from 'react';
import { useTheme } from 'styled-components';

import { getTranslation } from '../utils/getTranslation';


type PageState = PageStateError | PageStateLoading | PageStateOK;

type PageStateOK = {
  type: "ok",
  data: Data,
  selection: Selection,
  itemFormParams?: ItemFormParams,
  navFormParams?: NavModalArgs,
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
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type EditHooks = {
  onSave: () => void,
  onAddNav: () => void,
  onDelNav: () => void,
  onChangeNavigation: (name: string) => void,
  onChangeLanguage: (locale: string) => void,
  itemFormHooks: ItemFormHooks,
  navFormHooks: NavFormHooks,
}
  & ItemEditHooks
;

type ItemFormParams = {
  parent?: FrontNavItem,
  item?: FrontNavItem,
};

function loadData(
  {pageState, setPageState, ...args}
  : {
    pageState: PageState,
    setPageState: (_: PageState) => void,
  } & {
    name?: string,
    locale?: string,
  }
) {
  setPageState({
    type:"loading",
    data: (pageState.type=="ok" || pageState.type=="loading") ? pageState.data : undefined,
    selection: pageState.selection,
  });
  Promise.all([
    api.getConfig(),
    api.getLocales(),
    api.get(args.locale)
  ]).then(([config,locales,navigations]) => {
    let name: string|undefined = args.name
    if( !name ) {
      name = pageState.selection?.name;
    }
    if( !name || !navigations.find( nav => nav.name == name ) ) {
      name = navigations.at(0)?.name;
    }
    if( !name ) {
      name = "Main";
    }
    const locale = args.locale || pageState.selection?.locale || locales.find(locale => locale.isDefault)?.code;
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

const getEditHooks = (
  {pageState, setPageState}
  : {
    pageState: PageStateOK,
    setPageState: (_: PageState) => void,
  }
) => ({
  onSave: () => {
    console.debug( "onSave" );
    const navigation = pageState.data.navigations.find(navigation => navigation.name === pageState.selection.name);
    if( navigation === undefined ) return;
    api.update(
      navigation,
      pageState.selection.locale,
    )
    .then(navigations => {
      setPageState({
        ...pageState,
        data: {
          ...pageState.data,
          navigations: navigations,
        },
      });
    })
    .catch(error => {
      setPageState({
        type: "error",
        error: error,
        selection: pageState.selection,
      });
    });
  },
  onAddNav: () => {
    console.debug( "onAddNav" );
    const existing = pageState.data.navigations;
    setPageState({
      ...pageState,
      navFormParams: {
        existing: existing,
      }
    });
  },
  onDelNav: () => {
    console.debug( "onDelNav" );
    const navigation = pageState.data.navigations.find(navigation => navigation.name === pageState.selection.name);
    if( navigation === undefined ) return;
    api.del(
      navigation.documentId,
      pageState.selection.locale,
    )
    .then(navigations => {
      setPageState({
        ...pageState,
        data: {
          ...pageState.data,
          navigations: navigations,
        },
        selection: {
          ...pageState.selection,
          name: navigations.at(0)?.name || "Main",
        }
      });
    })
    .catch(error => {
      setPageState({
        type: "error",
        error: error,
        selection: pageState.selection,
      });
    });
  },
  onChangeNavigation: (name: string) => {
    console.debug( `onChangeNavigation ${ name }` );
    setPageState({
      ...pageState,
      selection: {
        ...pageState.selection,
        name: name,
      }
    });
  },
  onChangeLanguage: (locale: string) => {
    console.debug( `onChangeLanguage ${ locale }` );
    loadData({
      pageState, setPageState,
      locale: locale
    });
  },
  onSetRemoved: (item: FrontNavItem, removed: boolean) => {
    console.debug( `onSetRemoved /${item.path}: ${removed}` );
    utils.itemSetRemoved( item, removed );
    setPageState({ ...pageState });
  },
  onEditItemClicked: (item: FrontNavItem) => {
    console.debug( `onEditItemClicked /${item.path}` );
    setPageState({
      ...pageState,
      itemFormParams: { item: item }
    });
  },
  onAddItemClicked: (parent?: FrontNavItem) => {
    console.debug( `onAddItemClicked parent: /${parent?.path}` );
    setPageState({
      ...pageState,
      itemFormParams: { parent: parent }
    });
  },
  onMoveUp: (item: FrontNavItem) => {
    console.debug( `onMoveUp /${item.path}` );
    const navigation = pageState.data.navigations.find(navigation => navigation.name === pageState.selection.name);
    if( navigation === undefined ) return;
    utils.itemMoveUp( navigation, item );
    setPageState({ ...pageState });
  },
  onMoveDown: (item: FrontNavItem) => {
    console.debug( `onMoveDown /${item.path}` );
    const navigation = pageState.data.navigations.find(navigation => navigation.name === pageState.selection.name);
    if( navigation === undefined ) return;
    utils.itemMoveDown( navigation, item );
    setPageState({ ...pageState });
  },
  itemFormHooks: {
    onCommit: (data: Omit<FrontNavItem,"id"|"documentId">) => {
      console.debug( "itemFormHooks.onCommit" );
      if( !pageState.itemFormParams ) return;
      const navigation = pageState.data.navigations.find(navigation => navigation.name === pageState.selection.name);
      if( navigation == undefined ) return;
      // add:
      if( !pageState.itemFormParams?.item ) {
        console.debug( "addItem commit" );
        const parent = pageState.itemFormParams?.parent;
        api.addItem(
            data,
            navigation.id,
            parent,
            pageState.selection.locale
        )
          .then(navigations => {
            setPageState({
              ...pageState,
              data: {
                ...pageState.data,
                navigations: navigations,
              },
              itemFormParams: undefined,
            });
          })
          .catch(error => {
            console.error( `error while commiting ${error}` );
            setPageState({
              type: "error",
              error: error,
              selection: pageState.selection,
            });
          });
      }
      else {
        console.debug( "itemFormHooks.editItem commit" );
        const item = pageState.itemFormParams?.item;
        const newItem: FrontNavItem = {
          ...data,
          documentId: item.documentId,
          id: item.id,
        };
        api.updateItem( newItem,  pageState.selection.locale )
          .then(navigations => {
            setPageState({
              ...pageState,
              data: {
                ...pageState.data,
                navigations: navigations,
              },
              itemFormParams: undefined,
            });
          })
          .catch(error => {
            console.error( `error while commiting ${error}` );
            setPageState({
              type: "error",
              error: error,
              selection: pageState.selection,
            });
          });
      }
    },
    onAbort: () => {
      console.debug("itemFormHooks.onAbort");
      setPageState( {
        ...pageState,
        itemFormParams: undefined,
      });
    },
    onValidate: (data: Omit<FrontNavItem,"id"|"documentId">) => {
      console.debug("itemFormHooks.onValidate");
      // return ["test error"];
      const navigation = pageState.data.navigations.find(navigation => navigation.name === pageState.selection.name);
      if( navigation === undefined ) return ["no navigation"];
      if( !pageState.itemFormParams ) return ["no itemFormParams"];
      if( !pageState.itemFormParams?.item ) {
        console.debug( "addItem validate" );
        const parent = pageState.itemFormParams?.parent;
        const validationErrors = utils.validateAdd(
          navigation,
          data,
          pageState.data.config?.hierarchicalPaths || false,
          parent,
        );
        return validationErrors;
      }
      else {
        console.debug( "editItem commit" );
        const item = pageState.itemFormParams?.item;
        const newItem: FrontNavItem = {
          ...data,
          documentId: item.documentId,
          id: item.id,
        };
        // console.debug( `setting: ${ JSON.stringify( newItem ) }` )
        const validationErrors = utils.validateEdit(
          navigation,
          newItem,
          pageState.data.config.hierarchicalPaths,
        );
        return validationErrors;
      }
      return [];
    },
  },
  navFormHooks: {
    onCommit: (data: NavModalReturn) => {
      console.debug( "NavModal commit" );
      api.create(
        data,
        pageState.selection.locale,
      )
      .then(navigations => {
        setPageState({
          ...pageState,
          data: {
            ...pageState.data,
            navigations: navigations,
          },
          selection: {
            ...pageState.selection,
            name: data.name,
          },
          navFormParams: undefined,
        });
      })
      .catch(error => {
        setPageState({
          type: "error",
          error: error,
          selection: pageState.selection,
        });
      });
    },
    onAbort: () => {
      console.debug( "NavModal abort" );
      setPageState({
        ...pageState,
        navFormParams: undefined,
      });
    },
  }
});

export default function HomePage() {

  const { formatMessage } = useIntl();
  const [pageState, setPageState] = useState<PageState>({
    type: "loading",
  });


  useEffect(() => {
    loadData({
      pageState: pageState,
      setPageState: setPageState
    });
  }, []);

  if( pageState.type == "error" ) {
    throw pageState.error;
  }
  else if( pageState.type == "loading" ) {
    return <Page.Loading />
  }

  const editHooks = getEditHooks({
    pageState:pageState,
    setPageState: setPageState
  });
  return <NavEditor state={pageState} {...editHooks} />
};

function NavEditor(
  args
  : {
    state: PageStateOK
  } & EditHooks
) {
  let itemModalArgs: ItemModalArgs|undefined = undefined;
  if( args.state.itemFormParams ) {
    const navigation = args.state.data.navigations.find(navigation => navigation.name === args.state.selection.name);
    if( navigation ) {
      itemModalArgs = {
        relatedEntities: navigation.relatedEntities,
        item: args.state.itemFormParams.item,
      }
    }
  }
  return (<>
    <Layouts.Root>
      <ItemModal
        args={ itemModalArgs }
        { ...args.itemFormHooks }
      />
      <NavigationModal
        args={ args.state.navFormParams }
        { ...args.navFormHooks }
      />
      <Page.Title>{ pluginId }</Page.Title>
      <EditorHeader { ...args } />
      <Page.Main>
        <EditorMain { ...args } />
      </Page.Main>
    </Layouts.Root>
  </>);
}

const EditorMain = (
  { state, ...editHooks }
  : {
    state: PageStateOK,
  } & EditHooks
) => {
  const navigation = state.data.navigations.find(navigation => navigation.name === state.selection.name);
  const theme = useTheme();
  return <Layouts.Content>
  <Flex
    direction="column"
    gap={ theme['spaces'][2] }
    alignItems="stretch"
  >
    <EditorCommands state={state} { ...editHooks } />
    { (navigation === undefined)
    ? <EmptyStateLayout
      content="No navigation yet..."
      action={
        <Button
          startIcon={<Plus />}
          onClick={ editHooks.onAddNav }
        >{
          "Add Navigation"
        }</Button>
      }
    />
    : <>
    <ItemList
      config={ state.data.config }
      items={ navigation.items }
      { ...editHooks }
    />
    <Button
      // disabled={ }
      fullWidth
      startIcon={<Plus />}
      label={ "label" }
      onClick={ () => { editHooks.onAddItemClicked(); } }
    >{
      "Add Child"
    }</Button>
    </>
  }
  </Flex>
  </Layouts.Content>;
};

const EditorCommands = (
  { state, ...editHooks }
  : {
    state: PageStateOK,
  } & EditHooks
) => {
  const theme = useTheme();
  return (
    <Flex
      gap={ theme['spaces'][2] }
    >
      <IconButton
        label={ "Add Navigation" }
        onClick={ editHooks.onAddNav }
        variant="primary"
        size="M"
      >
        <Plus />
      </IconButton>
      <SingleSelect
        label="Navigations"
        placeholder="Select Navigation..."
        onChange={ editHooks.onChangeNavigation }
        value={ state.selection.name }
      >{
        state.data.navigations.map( (navInfo, i) => (
          <SingleSelectOption key={ i } value={ navInfo.name }>{ navInfo.name }</SingleSelectOption>
        ) )
      }</SingleSelect>
      <IconButton
        label={ "Delete Navigation" }
        onClick={ editHooks.onDelNav }
        disabled={ state.selection.name == "Main" }
        variant="secondary"
        size="M"
      >
        <Trash />
      </IconButton>
      <div style={{ marginLeft:"auto" }} >
        <SingleSelect
          label="Locales"
          placeholder="Language..."
          onChange={ editHooks.onChangeLanguage }
          value={ state.selection.locale }
        >{
          state.data.locales.map( (locale, i) => (
            <SingleSelectOption key={ i } value={ locale.code }>{ locale.name }</SingleSelectOption>
          ) )
        }</SingleSelect>
      </div>
    </Flex>
  );
}

const EditorHeader = (
  { state, ...editHooks }
  : { state : PageStateOK } & EditHooks
) => {
  const theme = useTheme();
  return <Layouts.Header
    title={ pluginId }
    subtitle="Edit Navigation"
    primaryAction={
      <Button
        // disabled={ !state.data || state.itemFormParams }
        startIcon={ <Check/> }
        onClick={ editHooks.onSave }
      >Save</Button>
    }
  />;
};

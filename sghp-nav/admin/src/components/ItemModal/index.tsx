import {
  FrontNav,
  FrontNavItem,
  Related,
} from '../../types'

import {
  Typography,
  Button,
  Modal,
  Field,
  SingleSelect, SingleSelectOption,
  Flex,
  Alert,
} from '@strapi/design-system';
import { useTheme } from 'styled-components';
import slugify from '@sindresorhus/slugify';
import React, { FunctionComponent, useState, useEffect } from 'react';


export type Args = {
  relatedEntities: FrontNav['relatedEntities'],
  item?: FrontNavItem,
};

export type ItemFormHooks = {
  onCommit: (data: Omit<FrontNavItem,"id"|"documentId">) => void,
  onAbort: () => void,
  onValidate: (data: Omit<FrontNavItem,"id"|"documentId">) => string[],
}

type State = {
  formData: FormData,
  errors: Errors,
  formErrors: string[],
}

type Errors = Record<Exclude<keyof FormData,"related">, string|undefined>;

const noErrors: Readonly<Errors> = {
  title: undefined, path: undefined
}

interface FormData {
  title: string,
  path: string,
  related: Related|null,
}

const emptyFormData: FormData = {
  title: "",
  path: "",
  related: null,
}

const validators = {
  title: (val: string) => {
    if( val == "" )
      return "Title cannot be empty";
  },
  path: (val: string) => {
    if(
      val.startsWith( "/" )
      || val.endsWith( "/" )
    )
      return "Path cannot start or end with '/'";
  },
}

const initState = ((args?: Args) => {
  // console.log( `initSTATE` );
  let initFormData: FormData = {... emptyFormData };
  if( args?.item ) {
    initFormData = {
      title: args.item.title,
      path: args.item.path,
      related: args.item.related,
    };
  }
  let initErrors: Errors = { ...noErrors };
  for( const field of ["title", "path"] as const ) {
    initErrors[field] = validators[field]( initFormData[field] );
  }
  return {
    formData: initFormData,
    errors: {...initErrors},
    formErrors: [],
  };
});

export default function ItemModal(
  {args, ...hooks}
  : {
    args?: Args,
  } & ItemFormHooks
)
  : React.ReactElement
{
  // console.log( "AddItemModal():" );
  //console.log( JSON.stringify( args, null, 2) );
  const theme = useTheme();
  const [state, setState] = useState<State>( initState() );
  /* update form data whenever
   * props change: */
  useEffect(() => {
    setState( initState(args) );
  }, [args]);
  // console.log( JSON.stringify( state, null, 2) );
  const handleAbort = () => {
    hooks.onAbort();
    setState( initState(args) );
  };
  const handleCommit = (event: Event) => {
    event.preventDefault();
    if( JSON.stringify( state.errors ) !== JSON.stringify( noErrors ) )
      return;
    const data = {
      ...state.formData,
      subItems: [],
      removed: false,
    };
    const validationErrors = hooks.onValidate(
      data
    );
    if( validationErrors.length > 0 ) {
      setState({
        ...state,
        formErrors: validationErrors
      });
      return;
    }
    hooks.onCommit(
      data
    );
    setState(initState(args));
  }

  function onTitleChange( val: string ) {
    state.formData.path = slugify( val );
  }

  function onInputChange( field: keyof Errors, val: string) {
    state.errors = { ...noErrors };
    state.formData[field] = val;
    state.errors[field] = undefined;
    const error = validators[field]( val );
    if( error ) state.errors[field] = error;
    if( field === "title" ) {
      onTitleChange( val );
    }
    state.formErrors = [];
    setState( { ...state } );
  };

  return (
    <Modal.Root
      open={ args }
      onOpenChange={ (value: boolean) => {
        // console.error(`onOpenChange: ${value}`);
        if( !value ) {
          handleAbort();
        }
      } }
      labelledBy="title"
    >
      <Modal.Content>
        <Modal.Header>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">Title</Typography>
        </Modal.Header>
        <form
          onSubmit={ (e) => e.preventDefault() }
        >
          <Modal.Body>
            { (state.formErrors.length > 0) &&
            <Alert
              title="Errors"
              onClose={ ()=> { setState({...state, formErrors: [] }); } }
              variant="danger">{ state.formErrors.join(", ") }
            </Alert>
            }
            <Field.Root
              name="title"
              required={false}
              hint="Item Caption"
              error={ state.errors.title }
            >
              <Flex direction="column" alignItems="flex-start" gap={1}>
                <Field.Label>Title</Field.Label>
                <Field.Input
                  type="text"
                  placeholder="e.g. Home"
                  value={ state.formData.title }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { onInputChange( "title", e.target.value ); } }
                />
                <Field.Hint/>
                <Field.Error/>
              </Flex>
            </Field.Root>

            <Field.Root
              name="path"
              required={false}
              hint="The link where this entry points to, e.g. 'home' will link to /home"
              error={ state.errors.path }
            >
              <Flex direction="column" alignItems="flex-start" gap={1}>
                <Field.Label>Path</Field.Label>
                <Field.Input
                  type="text"
                  placeholder="e.g. home"
                  value={ state.formData.path }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { onInputChange( "path", e.target.value ); } }
                />
                <Field.Hint/>
                <Field.Error/>
              </Flex>
            </Field.Root>

            { args &&
            <SingleSelect
              placeholder={ `related object` }
              label={ `Related object` }
              value={ state.formData.related?.id }
              onChange={ (value: string) => {
                state.formData.related = args.relatedEntities.find( x => x.id == Number.parseInt(value) ) ?? null;
                setState( {...state} );
              } }
              onClear={ () => {
                state.formData.related = null;
                setState( {...state} );
              } }
            >{
              args.relatedEntities.map( (relatedEntity, i) => (
                <SingleSelectOption key={ i } value={ relatedEntity.id }>{ relatedEntity.displayName }</SingleSelectOption>
              ) )
            }</SingleSelect>
            }
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button onClick={ handleAbort } variant="tertiary">Cancel</Button>
            </Modal.Close>
            <Button
              onClick={ handleCommit }
              disabled={ JSON.stringify( state.errors ) !== JSON.stringify( noErrors ) }
            >Submit</Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}

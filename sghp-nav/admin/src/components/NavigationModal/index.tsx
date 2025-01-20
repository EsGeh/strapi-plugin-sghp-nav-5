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
  existing: NavInfo[],
};

type NavInfo = {
  name: string
};

export type Return = NavInfo;

type State = {
  formData: FormData,
  fieldErrors: Errors,
  /* errors not related
   * to a specific field: */
  // formErrors: string[],
}

export type FormHooks = {
  onCommit: (data: Return) => void,
  onAbort: () => void,
  // onValidate: (data: Omit<FrontNavItem,"id"|"documentId">) => string[],
}

type Errors = Record<keyof FormData, string|undefined>;
const noErrors: Readonly<Errors> = {
  name: undefined
}

type FormData = {
  name: string
}
const emptyFormData: Readonly<FormData> = {
  name: "",
}

type Validators = Record<
  keyof FormData,
  (_:string) => string|undefined
>;

function getValidators(
  args?: Args
): Validators
{
  return {
    name: (val: string) => {
      if( args?.existing.find( x => (x.name == val) ) )
        return "Name already used";
    }
  }
}

const initState = ((validators: Validators) => {
  // console.log( `initSTATE` );
  let initFormData: FormData = {... emptyFormData };
  let initErrors: Errors = { ...noErrors };
  for( const field of ["name"] as const ) {
    initErrors[field] = validators[field]( initFormData[field] );
  }
  return {
    formData: initFormData,
    fieldErrors: initErrors,
  };
});

export default function ItemModal(
  {args, ...hooks}
  : {
    args?: Args,
  } & FormHooks
)
  : React.ReactElement
{


  const theme = useTheme();
  const validators = getValidators(args);
  const [state, setState] = useState<State>( initState(validators) );
  /* update form data whenever
   * props change: */
  useEffect(() => {
    setState( initState(validators) );
  }, [args]);
  const handleAbort = () => {
    hooks.onAbort();
    setState( initState(validators) );
  };
  const handleCommit = (event: Event) => {
    event.preventDefault();
    if( JSON.stringify( state.fieldErrors ) !== JSON.stringify( noErrors ) )
      return;
    const ret = {
      ...state.formData,
    };
    /*
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
    */
    hooks.onCommit( ret );
    setState(initState(validators));
  }

  function onInputChange( field: keyof Errors, val: string) {
    state.fieldErrors = { ...noErrors };
    state.formData[field] = val;
    state.fieldErrors[field] = undefined;
    const error = validators[field]( val );
    if( error ) state.fieldErrors[field] = error;
    // state.formErrors = [];
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
            { /* (state.formErrors.length > 0) &&
            <Alert
              title="Errors"
              onClose={ ()=> { setState({...state, formErrors: [] }); } }
              variant="danger">{ state.formErrors.join(", ") }
            </Alert>
            */ }
            <Field.Root
              name="title"
              required={true}
              hint="Navigation Menu"
              error={ state.fieldErrors.name }
            >
              <Flex direction="column" alignItems="flex-start" gap={1}>
                <Field.Label>Title</Field.Label>
                <Field.Input
                  type="text"
                  placeholder="e.g. Footermenu"
                  value={ state.formData.name }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { onInputChange( "name", e.target.value ); } }
                />
                <Field.Hint/>
                <Field.Error/>
              </Flex>
            </Field.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button onClick={ handleAbort } variant="tertiary">Cancel</Button>
            </Modal.Close>
            <Button
              onClick={ handleCommit }
              disabled={ JSON.stringify( state.fieldErrors ) !== JSON.stringify( noErrors ) }
            >Submit</Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}

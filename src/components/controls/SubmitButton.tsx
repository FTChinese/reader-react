import { useFormikContext } from 'formik';
import Button from 'react-bootstrap/esm/Button';
import { ButtonVariant } from 'react-bootstrap/types';
import { LoadIndicator } from '../progress/LoadIndicator';

export function SubmitButton<T>(
  props: {
    text: string;
    variant?: ButtonVariant;
    wrapped?: 'block' | 'start' | 'end';
  }
) {

  // isSubmitting from FormikState,
  // dirty, isValid from FormikComputedProps
  // FormikProps contains all of them.
  const { dirty, isValid, isSubmitting } = useFormikContext<T>();

  const indicator = (
    <LoadIndicator
      progress={isSubmitting}
      small={true}
    />
  );

  let wrapperClass = '';
  let atEnd = false;

  switch (props.wrapped) {
    case 'block':
      wrapperClass = 'd-grid';
      break;

    case 'start':
      wrapperClass = 'text-start';
      break;

    case 'end':
      wrapperClass = 'text-end';
      atEnd = true;
      break;
  }

  const btn = (
    <Button
      disabled={!(dirty && isValid) || isSubmitting}
      size="sm"
      variant={props.variant}
      type="submit"
    >
      { atEnd && indicator }
      <span>{props.text}</span>
      { !atEnd && indicator }
    </Button>
  );

  if (!wrapperClass) {
    return btn;
  }

  return (
    <div className={wrapperClass}>
      { btn }
    </div>
  );
}

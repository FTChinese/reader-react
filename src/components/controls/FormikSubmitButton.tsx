import { useFormikContext } from 'formik';
import Button from 'react-bootstrap/esm/Button';
import { ButtonVariant } from 'react-bootstrap/types';
import { CircleLoader } from '../progress/LoadIndicator';

export function FormikSubmitButton<T>(
  props: {
    text: string;
    variant?: ButtonVariant;
    wrapped?: 'block' | 'end';
  }
) {

  // isSubmitting from FormikState,
  // dirty, isValid from FormikComputedProps
  // FormikProps contains all of them.
  const { dirty, isValid, isSubmitting } = useFormikContext<T>();

  let wrapperClass = '';

  switch (props.wrapped) {
    case 'block':
      wrapperClass = 'd-grid mt-3';
      break;

    case 'end':
      wrapperClass = 'text-end mt-3';
      break;

    default:
      wrapperClass = 'mt-3';
      break;
  }

  const btn = (
    <Button
      disabled={!(dirty && isValid) || isSubmitting}
      size="sm"
      variant={props.variant}
      type="submit"
    >
      {
        <CircleLoader
          progress={isSubmitting}
        />
      }
      {
        !isSubmitting &&
        <span>{props.text}</span>
      }
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

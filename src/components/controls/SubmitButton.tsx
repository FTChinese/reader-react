import { useFormikContext } from 'formik';
import { ProgressButton } from '../buttons/ProgressButton';

export function SubmitButton<T>(
  props: {
    text: string;
    inline?: boolean;
  }
) {

  // isSubmitting from FormikState,
  // dirty, isValid from FormikComputedProps
  // FormikProps contains all of them.
  const { dirty, isValid, isSubmitting } = useFormikContext<T>();

  return (
    <ProgressButton
      disabled={!(dirty && isValid) || isSubmitting}
      text={props.text}
      isSubmitting={isSubmitting}
      inline={props.inline}
    />
  );
}

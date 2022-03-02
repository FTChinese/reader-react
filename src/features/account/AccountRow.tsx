import { Button } from 'react-bootstrap';
import { XLarge, Pencil } from '../../components/graphics/icons';

export function AccountRow(
  props: {
    title: string;
    children: JSX.Element;
    isEditing?: boolean;
    onEdit?: () => void
  }
) {

  return (
    <div className="border-bottom pb-3 pt-3">
      <div
        className="d-flex justify-content-between align-items-center"
      >
        <h5>{props.title}</h5>

        {
          props.onEdit &&
          <Button
            variant="link"
            onClick={props.onEdit}
          >
            { props.isEditing ?
              <XLarge /> :
              <Pencil />
            }
          </Button>
        }
      </div>

      {props.children}
    </div>
  );
}

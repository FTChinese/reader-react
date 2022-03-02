import { Button } from 'react-bootstrap';
import { XLarge, Pencil } from '../../components/graphics/icons';
import { RowContainer } from '../../components/list/RowCotainer';

export function AccountRow(
  props: {
    title: string;
    children: JSX.Element;
    isEditing?: boolean;
    onEdit?: () => void
  }
) {

  return (
    <RowContainer>
      <>
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
      </>
    </RowContainer>
  );
}

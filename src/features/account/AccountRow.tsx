import { Button } from 'react-bootstrap';
import { XLarge, Pencil } from '../../components/graphics/icons';
import { TwoLineRow } from '../../components/layout/TwoLineRow';

export function AccountRow(
  props: {
    title: string;
    children: JSX.Element;
    isEditing?: boolean;
    onEdit?: () => void
  }
) {

  const editBtn = (
    <Button
      variant="link"
      onClick={props.onEdit}
    >
      { props.isEditing ?
        <XLarge /> :
        <Pencil />
      }
    </Button>
  );

  return (
    <TwoLineRow
      primary={props.title}
      icon={editBtn}
    >
      {props.children}
    </TwoLineRow>
  );
}

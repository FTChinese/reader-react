import { XLarge, Pencil } from '../icons';

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
      <div className="d-flex justify-content-between align-items-center">
        <h5>{props.title}</h5>

        {!props.onEdit ||
          <button className="btn btn-link"
            onClick={props.onEdit}
          >
            { props.isEditing ?
              <XLarge /> :
              <Pencil />
            }
          </button>
        }
      </div>

      {props.children}
    </div>
  );
}

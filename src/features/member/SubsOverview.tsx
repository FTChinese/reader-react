import Card from 'react-bootstrap/Card';
import { TwoColList } from '../../components/list/TwoColList';
import { StringPair } from '../../data/pair';
import { MemberStatus } from './member-status';

export function SubsOverview(
  props: {
    status: MemberStatus
  }
) {

  return (
    <Card>
      <Card.Body className="text-center">
        <Card.Title>{props.status.productName}</Card.Title>

        {
          props.status.reminder &&
          <p className="text-danger text-center">{props.status.reminder}</p>
        }

      </Card.Body>
      <TwoColList rows={props.status.details}/>
    </Card>
  );
}

export function AddOnOverview(
  props: {
    rows: StringPair[]
  }
) {

  if (props.rows.length === 0) {
    return null;
  }

  return (
    <Card className="mt-3">
      <Card.Body className="text-center">
        <Card.Title>
          待启用订阅时长
        </Card.Title>
        <p className="text-danger scale-down8">以下订阅时间将在当前订阅到期后使用</p>
      </Card.Body>
      <TwoColList
        rows={props.rows}
      />
    </Card>
  );
}



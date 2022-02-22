import Card from 'react-bootstrap/Card';
import { TwoColList } from '../../components/list/TwoColList';
import { StringPair } from '../../data/pair';

export function AddOnOverview(
  props: {
    standard: number;
    premium: number;
  }
) {

  const rows: StringPair[] = [
    ['高端版', `${props.premium}天`],
    ['标准版', `${props.standard}天`],
  ];

  return (
    <Card className="mt-3">
      <Card.Body className="text-center">
        <Card.Title>
          待启用订阅时长
        </Card.Title>
        <p className="text-danger scale-down8">以下订阅时间将在当前订阅到期后使用</p>
      </Card.Body>
      <TwoColList
        rows={rows}
      />
    </Card>
  );
}

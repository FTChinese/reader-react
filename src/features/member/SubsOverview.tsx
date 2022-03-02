import Card from 'react-bootstrap/Card';
import { TwoColList } from '../../components/list/TwoColList';
import { ReaderPassport } from '../../data/account';
import { hasAddOn, Membership } from '../../data/membership';
import { StringPair } from '../../data/pair';
import { buildMemberStatus } from './member-status';

export function SubsOverview(
  props: {
    passport: ReaderPassport;
  }
) {

  const memberStatus = buildMemberStatus(props.passport.membership);

  return (
    <Card>
      <Card.Header>我的订阅</Card.Header>
      <Card.Body className="text-center">
        <Card.Title>{memberStatus.productName}</Card.Title>

        {
          memberStatus.reminder &&
          <p className="text-danger text-center">{memberStatus.reminder}</p>
        }

      </Card.Body>
      <TwoColList rows={memberStatus.details}/>

      {
        // memberStatus.reactivateStripe &&
        // <ReactivateStripe/>
      }
    </Card>
  );
}

export function AddOnOverview(
  props: {
    member: Membership;
  }
) {

  if (!hasAddOn(props.member)) {
    return null;
  }

  const rows: StringPair[] = [
    ['高端版', `${props.member.premiumAddOn}天`],
    ['标准版', `${props.member.standardAddOn}天`],
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

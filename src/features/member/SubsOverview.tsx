import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import { useAuth } from '../../components/hooks/useAuth';
import { TwoColList } from '../../components/list/TwoColList';
import { ReaderPassport } from '../../data/account';
import { hasAddOn, Membership } from '../../data/membership';
import { StringPair } from '../../data/pair';
import { ResponseError } from '../../repository/response-error';
import { reactivateSubs } from '../../repository/stripe';
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

      <ReactivateStripe
        show={memberStatus.reactivateStripe || false}
      />
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

function ReactivateStripe(
  props: {
    show: boolean
  }
) {

  if (!props.show) {
    return null;
  }

  const { passport, setMembership } = useAuth();
  const [ progress, setProgress ] = useState(false);

  const handleClick = () => {
    if (!passport) {
      return;
    }

    const subsId = passport.membership.stripeSubsId;
    if (!subsId) {
      return;
    }

    setProgress(true);

    reactivateSubs(passport.token, subsId)
      .then(result => {
        console.log(result);
        setProgress(false)
        setMembership(result.membership);
      })
      .catch((err: ResponseError) => {
        console.error(err);
        toast.error(err.message);
        setProgress(false);
      });
  };

  return (
    <Card.Footer className="text-end">
      <ProgressButton
        disabled={progress}
        progress={progress}
        text="打开自动续订"
        onClick={handleClick}
      />
    </Card.Footer>
  );
}

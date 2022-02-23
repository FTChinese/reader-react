import Card from 'react-bootstrap/Card';
import { useAuth } from '../components/hooks/useAuth';
import { Unauthorized } from '../components/routes/Unauthorized';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { buildMemberStatus } from '../features/member/member-status';
import { hasAddOn, isStripe, Membership } from '../data/membership';
import { TwoColList } from '../components/list/TwoColList';
import { ReactivateStripe } from '../features/member/ReactivateStripe';
import { AddOnOverview } from '../features/member/AddOnOverview';
import { StripeSettings } from '../features/member/StripeSettings';

export function MembershipPage() {
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <SingleCenterCol>
      <>
        <SubsOverview
          {...passport.membership}
        />

        {
          hasAddOn(passport.membership) &&
          <AddOnOverview
            standard={passport.membership.standardAddOn}
            premium={passport.membership.premiumAddOn}
          />
        }

        {
          isStripe(passport.membership) &&
          <StripeSettings/>
        }
      </>
    </SingleCenterCol>
  );
}

function SubsOverview(
  props: Membership
) {

  const memberStatus = buildMemberStatus(props);

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

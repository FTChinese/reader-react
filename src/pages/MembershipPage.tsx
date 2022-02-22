import { useAuth } from '../components/hooks/useAuth';
import { Unauthorized } from '../components/routes/Unauthorized';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { buildMemberStatus } from '../features/member/member-status';
import { Membership } from '../data/membership';
import { TwoColList } from '../components/list/TwoColList';
import { ReactivateStripe } from '../features/member/ReactivateStripe';

export function MembershipPage() {
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <SingleCenterCol>
      <CurrentSubs
        {...passport.membership}
      />
    </SingleCenterCol>
  );
}

function CurrentSubs(
  props: Membership
) {

  const memberStatus = buildMemberStatus(props);

  return (
    <div className="card mb-3">
      <div className="card-header">我的订阅</div>
      <div className="card-body">
        <h5 className="card-title text-center">{memberStatus.productName}</h5>

        {
          memberStatus.reminder &&
          <p className="text-danger text-center">{memberStatus.reminder}</p>
        }
      </div>
      <TwoColList rows={memberStatus.details}/>

      {
        memberStatus.reactivateStripe &&
        <ReactivateStripe/>
      }
    </div>
  );
}

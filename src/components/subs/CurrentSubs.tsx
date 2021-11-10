import { buildMemberStatus } from "../../data/member-status";
import { Membership } from "../../data/membership";
import { TwoColList } from '../list/TwoColList';

export function CurrentSubs(
  props: Membership
) {

  const memberStatus = buildMemberStatus(props);

  return (
    <div className="card">
      <div className="card-header">我的订阅</div>
      <div className="card-body">
        <h5 className="card-title text-center">{memberStatus.productName}</h5>

        {
          memberStatus.reminder ||
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

function ReactivateStripe() {
  return (
    <div className="card-footer text-end">
      <button className="btn btn-primary btn-sm">打开自动续订</button>
    </div>
  );
}

import { buildMemberStatus } from "../../data/member-status";
import { Membership, isMembershipZero } from "../../data/membership";
import { CardList } from "../list/CardList";

export function CurrentSubs(
  props: Membership
) {
  if (isMembershipZero(props)) {
    return <div>您尚未订阅FT中文网服务。去订阅</div>;
  }

  const memberStatus = buildMemberStatus(props);

  return (
    <CardList
      rows={memberStatus.details}
      header="我的订阅"
      title={memberStatus.productName}
    >
      {
        memberStatus.reminder ?
        <p className="text-danger text-center">{memberStatus.reminder}</p> :
        <></>
      }
    </CardList>
  )
}

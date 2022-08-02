import { buildMemberStatus } from './member-status';
import { MemberParsed } from '../../data/membership';
import { TwoColList } from '../../components/list/TwoColList';

/**
 * @description Show the current subscripiton upon severing link between email and wechat.
 */
export function UnlinkableSubs(
  props: {
    member: MemberParsed
  },
) {
  const status = buildMemberStatus(props.member);

  return (
    <div className="card mb-3">
      <div className="card-header">我的订阅</div>
      <div className="card-body">
        <h5 className="card-title text-center">{status.productName}</h5>
      </div>
      <TwoColList rows={status.details}/>
    </div>
  );
}

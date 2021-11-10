import { buildMemberStatus } from './member-status';
import { Membership } from '../../data/membership';
import { TwoColList } from '../list/TwoColList';

/**
 * @description Show the current subscripiton upon severing link between email and wechat.
 */
export function UnlinkableSubs(
  props: Membership,
) {
  const status = buildMemberStatus(props);

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

import { buildMemberStatus } from './member-status'
import { Membership } from '../../data/membership';
export function ReactivateStripe() {
  return (
    <div className="card-footer text-end">
      <button className="btn btn-primary btn-sm">打开自动续订</button>
    </div>
  );
}

import { useAuthContext } from '../store/AuthContext';
import { ContentLayout } from '../components/Layout';
import { isMembershipZero, Membership } from '../data/membership';
import { Redirect } from 'react-router-dom';
import { sitemap } from '../data/sitemap';
import { buildMemberStatus } from '../data/member-status';

function SubsDetail(
  props: Membership
) {
  if (isMembershipZero(props)) {
    return <div>您尚未订阅FT中文网服务。去订阅</div>;
  }

  const memberStatus = buildMemberStatus(props);

  return (
    <div className="card">
      <div className="card-header text-muted text-center">当前订阅</div>
      <div className="card-body">
        <h5 className="text-center">{memberStatus.productName}</h5>
        {
          memberStatus.reminder &&
          <p className="text-danger text-center">{memberStatus.reminder}</p>
        }
      </div>

      <ul className="list-group list-group-flush">
      {
        memberStatus.details.map(pair =>
          <li className="list-group-item d-flex justify-content-between">
            <span>{pair[0]}</span>
            <span>{pair[1]}</span>
          </li>
        )
      }
      </ul>

    </div>
  )
}

export function MembershipPage() {
  const { passport } = useAuthContext();
  if (!passport) {
    return <Redirect to={sitemap.login}/>;
  }

  return (
    <ContentLayout>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <SubsDetail
            {...passport.membership}
          />
        </div>
      </div>
    </ContentLayout>
  );
}

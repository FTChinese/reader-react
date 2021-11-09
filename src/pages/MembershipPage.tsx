import { useAuthContext } from '../store/AuthContext';
import { ContentLayout } from '../components/Layout';
import { isMembershipZero, Membership } from '../data/membership';
import { Redirect } from 'react-router-dom';
import { sitemap } from '../data/sitemap';
import { buildMemberStatus } from '../data/member-status';
import { CardList } from '../components/list/CardList';

function SubsDetail(
  props: Membership
) {
  if (isMembershipZero(props)) {
    return <div>您尚未订阅FT中文网服务。去订阅</div>;
  }

  const memberStatus = buildMemberStatus(props);

  return (
    <CardList
      rows={memberStatus.details}
      header="当前订阅"
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

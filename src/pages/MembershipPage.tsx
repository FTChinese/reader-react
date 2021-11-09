import { useAuthContext } from '../store/AuthContext';
import { ContentLayout } from '../components/Layout';
import { Redirect } from 'react-router-dom';
import { sitemap } from '../data/sitemap';
import { CurrentSubs } from '../components/subs/CurrentSubs';


export function MembershipPage() {
  const { passport } = useAuthContext();
  if (!passport) {
    return <Redirect to={sitemap.login}/>;
  }

  return (
    <ContentLayout>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <CurrentSubs
            {...passport.membership}
          />
        </div>
      </div>
    </ContentLayout>
  );
}

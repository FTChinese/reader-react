import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResponseError } from '../repository/response-error';
import { verifyEmail } from '../repository/email-auth';
import { ErrorBoudary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';

function VerifyToken(
  props: {
    token: string
  }
) {

  const [ progress, setProgress ] = useState(true);
  const [ verified, setVerified ] = useState(false);
  const [ errMsg, setErrMsg ]= useState('');

  useEffect(() => {
    verifyEmail(props.token)
      .then(ok => {
        setProgress(false);
        setVerified(ok);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        if (err.notFound) {
          setErrMsg('您似乎使用了无效的验证链接，请重试');
          return;
        }
        setErrMsg(err.message);
      });
  }, []);

  return (
    <div className="text-center">
      <h6>验证FT中文网登录邮箱</h6>
      <ErrorBoudary
        errMsg={errMsg}
      >
        <Loading
          loading={progress}
        >
          <div>
            {
              verified ? '您的邮箱已验证' : '验证失败，请重试'
            }
          </div>
        </Loading>
      </ErrorBoudary>
    </div>
  );
}

export function VerificationPage() {

  const { token } = useParams<'token'>();

  if (!token) {
    return <div>Invalid query parameter</div>;
  }

  return (
    <VerifyToken
      token={token}
    />
  );
}

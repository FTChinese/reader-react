import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResponseError } from '../../repository/response-error';
import { CenterLayout } from '../../components/Layout';
import { verifyEmail } from '../../repository/email-auth';

function VerifyToken(
  props: {
    token: string,
    onVerified: (ok: boolean) => void
  }
) {

  const [ progress, setProgress ] = useState(true);
  const [ errMsg, setErrMsg ]= useState('');

  useEffect(() => {
    verifyEmail(props.token)
      .then(ok => {
        props.onVerified(ok);
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

  if (progress) {
    return (
      <div className="text-center">
        正在验证FT中文网登录邮箱...
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="text-center">
        {errMsg}
      </div>
    );
  }

  return <div>Unknown status</div>;
}

export function VerificationPage() {
  const [ verified, setVerified ] = useState(false);

  const { token } = useParams<{token: string}>();

  if (verified) {
    return (
      <CenterLayout>
        <div className="text-center">
          您用于登录FT中文网的邮箱已验证。
        </div>
      </CenterLayout>
    );
  }

  return (
    <CenterLayout>
      <VerifyToken
        token={token}
        onVerified={setVerified} />
    </CenterLayout>
  );
}

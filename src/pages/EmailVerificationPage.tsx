import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResponseError } from '../repository/response-error';
import { CenterLayout } from '../components/Layout';
import { verifyEmail } from '../repository/email-auth';

function VerifyToken(
  props: {
    token: string,
    onVerified: (ok: boolean) => void
  }
) {

  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState<ResponseError>();

  useEffect(() => {
    verifyEmail(props.token)
      .then(ok => {
        props.onVerified(ok);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setErr(err);
      });
  }, []);

  if (progress) {
    return (
      <div className="text-center">
        正在验证您用于登录FT中文网的邮箱...
        {/* 正在验证您用于登录FT中文网的邮箱 <Spinner animation="border" /> */}
      </div>
    );
  }

  if (err) {
    const msg = err.notFound
      ? '您似乎使用无效的验证链接，请重试'
      : err.message;

    return (
      <div className="text-center">
        {msg}
      </div>
    );
  }

  return <div>Unknown status</div>;
}

export function ReaderVerificationPage() {
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

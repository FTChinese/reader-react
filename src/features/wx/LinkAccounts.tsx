import { useState } from 'react';
import { isLinkable, OnReaderAccount, ReaderAccount } from '../../data/account';
import { ResponseError } from '../../repository/response-error';
import { wxLinkExistingEmail } from '../../repository/wx-auth';
import { StringPair, pairEmail, pairMobile, pairWxName } from '../../data/pair';
import Card from 'react-bootstrap/Card';
import { TwoColList } from '../../components/list/TwoColList';
import { rowExpiration, rowTier } from '../member/member-status';
import { ErrorAlert } from '../../components/progress/ErrorAlert';
import { LoadButton } from '../../components/buttons/LoadButton';
import { CircleLoader } from '../../components/progress/LoadIndicator';

/**
 * @description Display the two accounts to be linked and a button
 * to let user to confirm the link.
 */
export function LinkAccounts(
  props: {
    token: string;
    wxAccount: ReaderAccount,
    ftcAccount: ReaderAccount,
    onLinked: OnReaderAccount;
  }
) {

  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const denied = isLinkable({
    ftc: props.ftcAccount,
    wx: props.wxAccount,
  });

  const handleSubmit = () => {
    setSubmitting(true);

    wxLinkExistingEmail({
        ftcId: props.ftcAccount.id,
        token: props.token,
      })
      .then(passport => {
        setSubmitting(false);
        props.onLinked(passport);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        setErrMsg(err.message);
      });
  };

  return (
    <div className="mt-5">
      <h4 className="text-center">关联如下账号</h4>
      {
        denied &&
        <p className="text-danger text-center">{denied}</p>
      }
      <Card className="mt-3">
        <Card.Header>邮箱/手机账号</Card.Header>
        <TwoColList
          rows={linkableAccountRows(props.ftcAccount)}
        />
      </Card>

      <Card className="mt-3 mb-3">
        <Card.Header>微信账号</Card.Header>
        <TwoColList
          rows={linkableAccountRows(props.wxAccount)}
        />
      </Card>
      <ErrorAlert
        msg={errMsg}
        onClose={() => setErrMsg('')}
      />
      {
        !denied &&
        <LoadButton
          disabled={submitting}
          text="绑定账号"
          onClick={handleSubmit}
          variant="primary"
          startIcon={<CircleLoader progress={submitting} />}
        />
      }
    </div>
  );
}

function linkableAccountRows(a: ReaderAccount): StringPair[] {
  switch (a.loginMethod) {
    case 'email':
      return [
        pairEmail(a.email),
        rowTier(a.membership.tier),
        rowExpiration(a.membership.expireDate),
      ];

    case 'mobile':
      return [
        pairMobile(a.mobile),
        rowTier(a.membership.tier),
        rowExpiration(a.membership.expireDate),
      ];

    case 'wechat':
      return [
        pairWxName(a.wechat.nickname),rowTier(a.membership.tier),
        rowExpiration(a.membership.expireDate),
      ];

    default:
      return [];
  }
}

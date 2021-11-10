import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { ReaderAccount } from '../../data/account';
import { ResponseError } from '../../repository/response-error';
import { wxLinkExistingEmail } from '../../repository/wx-auth';
import ProgressButton from '../buttons/ProgressButton';
import { CardList } from '../list/CardList';
import { StringPair, rowAccountIdentifier, rowTier, rowExpiration } from '../list/pair';
import { OnLinkOrUnlink } from "./OnLinkOrUnlink";

/**
 * @description Display the two accounts to be linked and a button
 * to let user to confirm the link.
 */
export function LinkAccounts(
  props: {
    token: string;
    wxAccount: ReaderAccount,
    ftcAccount: ReaderAccount,
    onLinked: OnLinkOrUnlink;
  }
) {

  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');

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
      <CardList
        rows={linkableAccountRows(props.ftcAccount)}
        header="邮箱/手机账号"
        className="mt-3"
      />
      <CardList
        rows={linkableAccountRows(props.wxAccount)}
        header="微信账号"
        className="mt-3 mb-3"
      />
      {
        errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrMsg('')}
        >
          {errMsg}
        </Alert>
      }
      <ProgressButton
        disabled={submitting}
        text="绑定账号"
        isSubmitting={submitting}
        asButton={true}
        onClick={handleSubmit}
      />
    </div>
  );
}

function linkableAccountRows(a: ReaderAccount): StringPair[] {
  return [
    rowAccountIdentifier(a),
    rowTier(a.membership.tier),
    rowExpiration(a.membership.expireDate),
  ];
}

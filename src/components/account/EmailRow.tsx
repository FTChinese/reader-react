import { isEmailMissing } from '../../data/account';
import { AccountRow } from "./AccountRow";

export function DisplayEmail(
  props: {
    email: string;
    isVerified: boolean;
  }
) {
  return (
    <AccountRow
      title="邮箱"
    >
      <EmailDetails
        {...props}
      />
    </AccountRow>
  );
}

function EmailDetails(
  props: {
    email: string;
    isVerified: boolean;
  }
) {

  if (isEmailMissing(props.email)) {
    return <div>未设置</div>;
  }

  if (props.isVerified) {
    return <div>{props.email}</div>;
  }

  return <div>{props.email} （未验证）</div>
}

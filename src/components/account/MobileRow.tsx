import { AccountRow } from "./AccountRow";

export function DisplayMobile(
  props: {
    mobile: string | null;
  }
) {
  return (
    <AccountRow
      title="手机号"
    >
      <div>{props.mobile || '未设置'}</div>
    </AccountRow>
  );
}

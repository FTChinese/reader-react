import { AccountRow } from "./AccountRow";

export function DisplayName(
  props: {
    name: string | null;
  }
) {
  return (
    <AccountRow
      title="用户名"
    >
      <div>{props.name || '未设置'}</div>
    </AccountRow>
  );
}

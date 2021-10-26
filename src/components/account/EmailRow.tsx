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
      <div>{props.email}</div>
    </AccountRow>
  );
}

import { Wechat } from "../../data/account";
import { AccountRow } from "./AccountRow";

export function DisplayWechat(
  props: {
    unionId: string | null;
    wechat: Wechat;
  }
) {
  return (
    <AccountRow
      title="微信"
    >
      <div>{props.unionId ? props.wechat.nickname : '尚未绑定'}</div>
    </AccountRow>
  )
}

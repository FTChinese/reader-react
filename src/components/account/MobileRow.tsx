import { useState } from 'react';
import { AccountRow } from "./AccountRow";

export function DisplayMobile(
  props: {
    mobile: string | null;
  }
) {

  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  return (
    <AccountRow
      title="手机号"
      isEditing={editing}
      onEdit={() => setEditing(!editing)}
    >
      <div>{props.mobile || '未设置'}</div>
    </AccountRow>
  );
}

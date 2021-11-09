import { useState } from 'react';
import { isAccountLinked, ReaderPassport, Wechat } from "../../data/account";
import { WxAvatar } from '../wx/WxAvatar';
import { AccountRow } from "./AccountRow";

export function DisplayWechat(
  props: {
    passport: ReaderPassport;
  }
) {

  const isLinked = isAccountLinked(props.passport);

  return (
    <AccountRow
      title="微信"
    >
      { isLinked ?
        <WechatLinked
          wechat={props.passport.wechat}
        /> :
        <WechatMissing/>
      }
    </AccountRow>
  )
}

function WechatLinked(
  props: {
    wechat: Wechat;
  }
) {
  if (!props.wechat.avatarUrl && !props.wechat.nickname) {
    return <></>;
  }

  return (
    <div className="d-flex justify-content-between">
      <div className="flex-grow-1">
        <button className="btn btn-link">
          解除绑定
        </button>
      </div>
      <WxAvatar wechat={props.wechat} />
    </div>
  );
}

function WechatMissing() {
  return (
    <div className="d-flex">
      <div className="flex-grow-1">未设置</div>
      <button className="btn btn-link">绑定微信</button>
    </div>
  )
}

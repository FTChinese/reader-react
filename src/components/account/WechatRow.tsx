import { useState } from 'react';
import { Wechat } from "../../data/account";
import { AccountRow } from "./AccountRow";

export function DisplayWechat(
  props: {
    unionId: string | null;
    wechat: Wechat;
  }
) {

  const isLinked = !!props.unionId;

  return (
    <AccountRow
      title="微信"
    >
      { isLinked ?
        <WechatLinked/> :
        <WechatMissing/>
      }
    </AccountRow>
  )
}

function WechatLinked(
  props: Wechat
) {
  if (!props.avatarUrl && !props.nickname) {
    return <></>;
  }

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <figure className="figure ">
          <img src={props.avatarUrl} alt="微信头像" />
          <figcaption className="figure-caption text-center">
            {props.nickname}
          </figcaption>
        </figure>
      </div>

      <button className="btn btn-link">
        解除绑定
      </button>
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

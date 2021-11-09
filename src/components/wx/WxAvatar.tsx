import { Wechat } from '../../data/account';

export function WxAvatar(
  props: {
    wechat: Wechat;
  }
) {
  return (
    <figure className="figure">
      <img
        className="figure-img img-fluid rounded"
        src={props.wechat.avatarUrl}
        alt="微信头像" />
      <figcaption className="figure-caption text-center">
        {props.wechat.nickname}
      </figcaption>
    </figure>
  );
}

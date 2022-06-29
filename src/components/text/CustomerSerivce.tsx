import { BorderHeader } from './BorderHeader';

export function CustomerService() {
  return (
    <div className="mt-3">
      <BorderHeader
        text="联系客服"
        level={5}
      />
      <dl>
        {/* <dt>电话</dt>
        <dd>010-xxxxxx</dd> */}

        <dt>邮箱</dt>
        <dd><a href="mailto:subscriber.service@ftchinese.com">subscriber.service@ftchinese.com</a></dd>
      </dl>
    </div>
  );
}

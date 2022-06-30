import { ArrowClockwise, ChevronRight, XLarge } from '../../components/graphics/icons';
import { BorderHeader } from '../../components/text/BorderHeader';
import { PrimaryLine, SecondaryLine, TwoLineRow } from '../../components/layout/TwoLineRow';
import { TrailIconButton, TrailIconText } from '../../components/buttons/Buttons';
import { Link } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { getStripeAction, StripeAction } from './member-status';
import { Membership } from '../../data/membership';
import { CircleLoader } from '../../components/progress/LoadIndicator';

/**
 * @description Show stripe payment setting.
 * This is visible as long as user has a stripe subscription.
 */
export function StripeSubsSettings(
  props: {
    membership: Membership;
    onAction: (action: StripeAction) => void;
    reactivating: boolean;
  }
) {

  if (!props.membership.stripeSubsId) {
    return null;
  }

  const action = getStripeAction(props.membership);

  return (
    <div className="mt-4">
      <BorderHeader
        text="Stripe订阅设置"
        level={5}
      />

      <TwoLineRow
        first={<PrimaryLine
          text="默认支付方式"
          trailIcon={
            <Link to={sitemap.stripeSetting} className="btn btn-link btn-sm">
              <TrailIconText
                text='设置'
                icon={<ChevronRight />}
              />
            </Link>
          }
        />}
        second={<SecondaryLine text="自动续订时使用的默认支付方式" />}
      />

      <RowCancelOrReactivate
        action={action}
        onClick={() => props.onAction(action)}
        reactivating={props.reactivating}
      />
    </div>
  );
}

function RowCancelOrReactivate(
  props: {
    action: StripeAction;
    onClick: () => void;
    reactivating: boolean;
  }
) {

  switch (props.action) {
    case StripeAction.Cancel:
      return (
        <TwoLineRow
          first={<PrimaryLine
            text="关闭自动续订"
            trailIcon={
              <TrailIconButton
                text="关闭"
                onClick={props.onClick}
                icon={<XLarge />}
              />
            }
          />}
          second={<SecondaryLine text="关闭自动续订将在本次订阅到期后停止扣款"/>}
        />
      );

    case StripeAction.Activate:
      return (
        <TwoLineRow
          first={
            <PrimaryLine
              text="打开自动续订"
              trailIcon={
                <TrailIconButton
                  text="打开"
                  onClick={props.onClick}
                  icon={
                    props.reactivating ?
                    <CircleLoader progress={true} /> :
                    <ArrowClockwise />
                  }
                />
              }
            />
          }
          second={<SecondaryLine text="订阅到期前可重新启用自动续订" />}
        />
      );

    default:
      return null;
  }
}



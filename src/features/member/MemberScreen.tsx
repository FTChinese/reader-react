import { LeadIconButton } from '../../components/buttons/Buttons';
import { Flex } from '../../components/layout/Flex';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { CustomerService } from '../../components/text/CustomerSerivce';
import { MemberParsed, Membership } from '../../data/membership';
import { StripeInvoice } from '../../data/stripe';
import { buildMemberStatus, buildAddOnRows, StripeAction } from './member-status';
import { StripeSubsSettings } from './StripeSubsSettings';
import { SubsOverview, AddOnOverview } from './SubsOverview';

export function MemberScreen(
  props: {
    member: MemberParsed
    refreshing: boolean,
    onRefresh: () => void;
    onStripeAction: (action: StripeAction) => void;
    reactivating: boolean;
    stripeInvoice?: StripeInvoice;
  }
) {
  const status = buildMemberStatus(props.member);

  return (
    <>
      <Flex justify="between" align="center">
        <>
          <span>我的订阅</span>
          <LeadIconButton
            text="刷新"
            icon={<CircleLoader progress={props.refreshing} />}
            disabled={props.refreshing}
            onClick={props.onRefresh}
          />
        </>
      </Flex>

      <SubsOverview
        status={status}
      />

      <AddOnOverview
        rows={buildAddOnRows(props.member)}
      />

      <StripeSubsSettings
        membership={props.member}
        onAction={props.onStripeAction}
        reactivating={props.reactivating}
        stripeInvoice={props.stripeInvoice}
      />

      <CustomerService />
    </>
  );
}

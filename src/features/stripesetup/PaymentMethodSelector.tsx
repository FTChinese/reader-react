import { OButton, LeadIconText } from '../../components/buttons/Buttons';
import { PlusCircle } from '../../components/graphics/icons';
import { Flex } from '../../components/layout/Flex';



export function PaymentMethodSelector(
  props: {
    onClick: () => void;
  }
) {
  return (
    <Flex border={true}>
      <>
        <h6>支付方式</h6>
        <OButton
          onClick={props.onClick}
          variant="link"
        >
          <LeadIconText
            icon={<PlusCircle />}
            text="添加或选择" />
        </OButton>
      </>
    </Flex>
  );
}

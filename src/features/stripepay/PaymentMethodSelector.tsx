import { TextButton, TrailIconText } from '../../components/buttons/Buttons';
import { ChevronRight } from '../../components/graphics/icons';
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
        <TextButton
          onClick={props.onClick}
        >
          <TrailIconText
            icon={<ChevronRight />}
            text="添加或选择"
          />
        </TextButton>
      </>
    </Flex>
  )
}

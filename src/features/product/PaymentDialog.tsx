import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { ShelfItemParams } from '../../data/product-shelf';
import { PriceCardBody } from './PriceCard';
import styles from './PaymentDialog.module.css';
import { localizeTier } from '../../data/localization';
import { Tier } from '../../data/enum';

export function PaymentDialog(
  props: {
    show: boolean;
    onHide: () => void;
    tier: Tier;
    params: ShelfItemParams;
    children: JSX.Element;
  }
) {
  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          成为FT中文网会员
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <Card className={styles.card}>
              <Card.Header>
                {localizeTier(props.tier)}
              </Card.Header>
              <PriceCardBody
                params={props.params}
              />
            </Card>

            {props.children}

          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}





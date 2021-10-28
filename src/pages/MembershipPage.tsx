import { useEffect, useState } from 'react';
import { localizedCycle } from '../data/localization';
import { Paywall, Price, ProductGroup } from '../data/paywall';
import { paywallRepo } from '../repository/paywall';
import { useAuthContext } from '../store/AuthContext';
import { Unauthorized } from '../components/routes/Unauthorized';
import { ResponseError } from '../repository/response-error';
import { ContentLayout } from '../components/Layout';

interface PriceProps {
  price: Price;
}

/**
 * @description Render formatted price.
 */
function PriceOfCycle(props: PriceProps) {
  return (
    <div className="mb-2 border-bottom text-center">
      {props.price.unitAmount}/{localizedCycle(props.price.cycle)}
    </div>
  );
}

interface ProductDescProps {
  desc: string;
}

/**
 * @description Render product description into a list.
 */
function ProductDesc(props: ProductDescProps) {
  const listItems = props.desc
    .split('\n')
    .map((line, index) => <li key={index}>{line}</li>);

  return (
    <ul>
      {listItems}
    </ul>
  );
}

interface ProductCardProps {
  product: ProductGroup;
}

/**
 * @description Render a product.
 */
function ProductCard(props: ProductCardProps) {

  const price = props.product.prices[0];

  return (
    <div className="col mt-3">
      <div className="card h-100">
        <div className="card-body">

          <h4 className="card-title mb-3 text-center">
            {props.product.heading}
          </h4>

          <PriceOfCycle price={price}/>

          <ProductDesc
            desc={props.product.description || ''} />
        </div>

      </div>
    </div>
  );
}

function ProductList(
  props: {
    products?: ProductGroup[];
  }
) {

  if (!props.products) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h3 className="text-center">订阅方案</h3>
      <div className="row row-cols-1 row-cols-lg-2">
        {props.products.map(p =>
          <ProductCard
            key={p.id}
            product={p}/>
        )}
      </div>
    </>
  );
}

export function ProductPage() {

  const { passport } = useAuthContext();
  const [ paywall, setPaywall ] = useState<Paywall>();

  if (!passport) {
    return <Unauthorized />;
  }

  useEffect(() => {
    paywallRepo.loadPaywall()
      .then(pw => {
        setPaywall(pw);
      })
      .catch((err: ResponseError) => {
        alert(err.message);
      });
  }, []);

  return (
    <ContentLayout>
      <ProductList products={paywall?.products} />
    </ContentLayout>
  );
}

import { useEffect, useState } from 'react';
import { localizedCycle } from '../data/localization';
import { Paywall, Price, ProductGroup } from '../data/paywall';
import { paywallRepo } from '../repository/paywall';
import { useAuthContext } from '../store/AuthContext';
import { Unauthorized } from '../components/routes/Unauthorized';
import { ResponseError } from '../repository/response-error';
import { ContentLayout } from '../components/Layout';
import { CustomerService } from '../components/product/CustomerSerivce';


export function MembershipPage() {
  return (
    <ContentLayout>
      <div>Membership status</div>
    </ContentLayout>
  );
}

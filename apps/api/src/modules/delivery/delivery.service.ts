import { Injectable, NotImplementedException } from '@nestjs/common';
import { DeliveryZone } from '@bartal/shared';

/** Delivery service — scaffolded per PRD §10.3 /api/delivery. */
@Injectable()
export class DeliveryService {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async zones() { throw new NotImplementedException(); }
  async calculateFee(_zone: DeliveryZone, _total: number) { throw new NotImplementedException(); }
  /* eslint-enable */
}

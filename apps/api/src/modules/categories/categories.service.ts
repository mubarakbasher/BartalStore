import { Injectable, NotImplementedException } from '@nestjs/common';

/** Categories service — scaffolded per PRD §10.3 /api/categories. */
@Injectable()
export class CategoriesService {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async tree() { throw new NotImplementedException(); }
  async detail(_id: string) { throw new NotImplementedException(); }
  async productsIn(_id: string, _page?: number, _limit?: number) {
    throw new NotImplementedException();
  }
  /* eslint-enable */
}

import { PreOrderService } from './pre-order.service';

describe('PreOrderService', () => {
  let service: PreOrderService;

  beforeEach(async () => {
    service = new PreOrderService({} as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

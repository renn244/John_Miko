import { StaffManagementEmailService } from './staff-management-email.service';

describe('StaffManagementEmailService', () => {
  const originalFrontendUrl = process.env.FRONTEND_URL;
  const originalFrontendUrls = process.env.FRONTEND_URLS;
  const originalMobileUrl = process.env.MOBILE_URL;

  afterEach(() => {
    if (originalFrontendUrl === undefined) delete process.env.FRONTEND_URL;
    else process.env.FRONTEND_URL = originalFrontendUrl;
    if (originalFrontendUrls === undefined) delete process.env.FRONTEND_URLS;
    else process.env.FRONTEND_URLS = originalFrontendUrls;
    if (originalMobileUrl === undefined) delete process.env.MOBILE_URL;
    else process.env.MOBILE_URL = originalMobileUrl;
  });

  it('uses the web portal URL for staff-email sign-in links when both URLs exist', () => {
    process.env.FRONTEND_URL = 'https://jm-port.vercel.app/';
    process.env.MOBILE_URL = 'jmport://';
    const service = new StaffManagementEmailService({} as never);

    expect((service as any).getStaffLoginUrl()).toBe('https://jm-port.vercel.app/login');
  });

  it('uses the first configured web origin when Azure provides FRONTEND_URLS', () => {
    delete process.env.FRONTEND_URL;
    process.env.FRONTEND_URLS = 'https://jm-port.vercel.app, https://preview.example.test';
    process.env.MOBILE_URL = 'jmport://';
    const service = new StaffManagementEmailService({} as never);

    expect((service as any).getStaffLoginUrl()).toBe('https://jm-port.vercel.app/login');
  });
});

import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

describe('paymentApproved email template', () => {
  const templatePath = path.join(__dirname, 'paymentApproved.hbs');
  const previewDataPath = path.join(__dirname, 'paymentApproved.hbs.json');

  it('uses email-safe table markup for booking detail rows', () => {
    const source = fs.readFileSync(templatePath, 'utf-8');
    const previewData = JSON.parse(fs.readFileSync(previewDataPath, 'utf-8'));
    const template = Handlebars.compile(source);
    const rendered = template(previewData);

    expect(rendered).toContain('<table role="presentation"');
    expect(rendered).toContain('Payment Information');
    expect(rendered).not.toContain('display: flex');
    expect(rendered).not.toContain('justify-content: space-between');
  });
});

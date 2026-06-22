import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

describe('forgotPassword email template', () => {
  const templatePath = path.join(__dirname, 'forgotPassword.hbs');
  const previewDataPath = path.join(__dirname, 'forgotPassword.hbs.json');

  it('uses email-safe table markup for the reset email layout', () => {
    const source = fs.readFileSync(templatePath, 'utf-8');
    const previewData = JSON.parse(fs.readFileSync(previewDataPath, 'utf-8'));
    const template = Handlebars.compile(source);
    const rendered = template(previewData);

    expect(rendered).toContain('<table role="presentation"');
    expect(rendered).toContain('Reset Password');
    expect(rendered).not.toContain('display: flex');
    expect(rendered).not.toContain('class="btn"');
  });
});

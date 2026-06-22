import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

describe('bookingStatusUpdated email template', () => {
  const templatePath = path.join(__dirname, 'bookingStatusUpdated.hbs');
  const previewDataPath = path.join(__dirname, 'bookingStatusUpdated.hbs.json');

  it('uses email-safe table markup for status detail rows', () => {
    const source = fs.readFileSync(templatePath, 'utf-8');
    const previewData = JSON.parse(fs.readFileSync(previewDataPath, 'utf-8'));
    const template = Handlebars.compile(source);
    const rendered = template(previewData);

    expect(rendered).toContain('<table role="presentation"');
    expect(rendered).toContain('Current status');
    expect(rendered).not.toContain('display: flex');
    expect(rendered).not.toContain('justify-content: space-between');
  });

  it('shows a green Booking Completed badge without a duplicate status section', () => {
    const source = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(source);
    const rendered = template({
      guestName: 'Avery Stone',
      bookingId: 'BK-2026-052',
      accommodationName: 'Family Hall',
      bookingDate: 'July 3, 2026, Friday',
      stayOptionLabel: 'Day Event',
      status: 'Completed',
      statusMessage: 'Your booking has been marked as completed. Thank you for staying with John Miko\'s Place.',
      badgeLabel: 'Booking Completed',
      badgeBackgroundColor: '#ecfdf5',
      badgeBorderColor: '#a7f3d0',
      badgeTextColor: '#047857',
    });

    expect(rendered).toContain('Booking Completed');
    expect(rendered).toContain('#ecfdf5');
    expect(rendered).not.toContain('Status: Completed');
    expect(rendered).not.toContain('Current status');
  });
});

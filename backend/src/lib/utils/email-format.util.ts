export function formatCurrencyPhp(amount: number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
}

export function formatBookingDateManila(date: Date) {
    return new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    }).format(date);
}

export function getFrontendMyBookingsUrl() {
    const baseUrl = process.env.FRONTEND_URL;

    if (!baseUrl) {
        return undefined;
    }

    return `${baseUrl.replace(/\/$/, '')}/my-bookings`;
}

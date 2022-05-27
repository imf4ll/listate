export const datetime = (init, now) => {
    const a = new Date(init);
    const b = new Date(now);

    const since = Math.floor((b.getTime() - a.getTime()) / 1000);

    const times = {
        hours: 60 * 60,
        days: 60 * 60 * 24,
        years: 60 * 60 * 24 * 365,
    }

    if (since < 60) {
        return `${ since }s`;

    } else if (since >= 60 && since < times.hours) {
        return `${ Math.floor(since / 60) }m`;

    } else if (since >= times.hours && since < times.days) {
        return `${ Math.floor(since / 60 / 60) }h`;

    } else if (since >= times.days && since < times.years) {
        return `${ Math.floor(since / 60 / 60 / 24) }d`;

    } else {
        return `${ Math.floor(since / 60 / 60 / 24 / 365) }y`;

    }
}

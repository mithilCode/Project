export function diffYMD(date1, date2) {
    let years = date1.diff(date2, 'years');
    date2.add(years, 'years');
    let month = date1.diff(date2, 'month');
    date2.add(month, 'month');
    let days = date1.diff(date2, 'days');
    return `${years}Y,` + ` ${month}M,` + ` ${days}D`
}
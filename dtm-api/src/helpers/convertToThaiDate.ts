export default (date: Date): string => {
    const dayDate = new Date(date)
    // const thday = [ 'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์' ]
    const thmonth = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
    ]

    const showDate = dayDate.getDate() + ' ' + thmonth[dayDate.getMonth()]+ ' ' + (dayDate.getFullYear()+543)
    return showDate
}

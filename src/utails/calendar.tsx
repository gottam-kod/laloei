
const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DayString = (date: Date): string => {

    const currentTime: any = new Date().toISOString().includes('T') ? true : false;

    if (currentTime) {
        return `วัน${thaiDays[date.getDay()]}`;
    } else {
        return `${englishDays[date.getDay()]}`;
    }
}
const DateString = (date: Date): string => {

    const currentTime: any = new Date().toISOString().includes('T') ? true : false;

    if (currentTime) {
        return currentTime[0]
    } else {
        return `${englishDays[date.getDay()]}`;
    }
}

const ThaiDayString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // เดือนเริ่มจาก 0
    const year = date.getFullYear();
    return `วัน${thaiDays[date.getDay()]}ที่ ${day}/${month}/${year}`;
}

// วันที่ 15 ตุลาคม 2023

const ThaiDateString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `วันที่ ${day} ${thaiMonths[date.getMonth()]} ${year + 543}`;
}
const EnglishDateString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `Date: ${day}/${englishMonths[date.getMonth()]}/${year}`;
}

export { DayString, ThaiDayString, DateString, ThaiDateString, EnglishDateString, thaiDays, englishDays };
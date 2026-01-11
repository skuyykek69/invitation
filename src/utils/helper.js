export const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

export const generateRandomColor = () => {
    const avoidColors = ['#000000', '#ffffff', '#f0f0f0', '#f5f5f5', '#fafafa'];

    let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    while (avoidColors.includes(color)) {
        color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

    return color;
}

export const renderElement = (data, element, listItem) => {
    element.innerHTML = '';
    data.map((data) => element.innerHTML += listItem(data));
}

export const addClassElement = (element, newClass) => {
    element.classList.add(newClass);
}

export const removeClassElement = (element, currentClass) => {
    element.classList.remove(currentClass);
}

/**
 * formattedDate
 * Input: date (can be Date object, ISO string, "YYYY-MM-DD HH:mm", "DD/MM/YYYY" etc.)
 * Output: { days, hours, minutes, shortDate }
 * - days/hours/minutes are numeric (0 or positive)
 * - shortDate is string in format "D/M/YY" (used when days >= 1)
 * If parsing fails, returns days/hours/minutes as NaN and shortDate empty.
 */
export const formattedDate = (date) => {
    if (!date && date !== 0) {
        return { days: NaN, hours: NaN, minutes: NaN, shortDate: '' };
    }

    let parsed;

    // If already a Date object
    if (date instanceof Date) {
        parsed = date;
    } else if (typeof date === 'number') {
        parsed = new Date(date);
    } else if (typeof date === 'string') {
        const s = date.trim();

        // Try direct parsing first (handles ISO strings)
        parsed = new Date(s);

        // If invalid, try replacing space with 'T' and append 'Z' (common "YYYY-MM-DD HH:mm" case)
        if (isNaN(parsed)) {
            const t1 = s.replace(' ', 'T');
            parsed = new Date(t1 + (t1.indexOf('T') !== -1 && !/[zZ]$/.test(t1) && !/[\+\-]\d{2}:?\d{2}$/.test(t1) ? 'Z' : ''));
        }

        // If still invalid, try to parse common dd/mm/yyyy or d/m/yy formats
        if (isNaN(parsed)) {
            const dm = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?/);
            if (dm) {
                let day = dm[1].padStart(2, '0');
                let month = dm[2].padStart(2, '0');
                let year = dm[3];
                if (year.length === 2) year = '20' + year;
                const hour = (dm[4] || '00').padStart(2, '0');
                const minute = (dm[5] || '00').padStart(2, '0');
                // construct ISO in UTC to avoid timezone ambiguity
                parsed = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
            }
        }

        // If still invalid, try pattern YYYY/MM/DD or YYYY.MM.DD
        if (isNaN(parsed)) {
            const ymd = s.match(/^(\d{4})[\/\.\-](\d{1,2})[\/\.\-](\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
            if (ymd) {
                const year = ymd[1];
                const month = ymd[2].padStart(2, '0');
                const day = ymd[3].padStart(2, '0');
                const hour = (ymd[4] || '00').padStart(2, '0');
                const minute = (ymd[5] || '00').padStart(2, '0');
                parsed = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
            }
        }
    } else {
        // unknown type
        parsed = new Date(String(date));
    }

    if (!parsed || isNaN(parsed.getTime())) {
        return { days: NaN, hours: NaN, minutes: NaN, shortDate: '' };
    }

    const now = new Date();
    const diffInMs = Math.abs(now - parsed);

    const msInMinute = 60 * 1000;
    const msInHour = 60 * msInMinute;
    const msInDay = 24 * msInHour;

    const days = Math.floor(diffInMs / msInDay);
    const hours = Math.floor((diffInMs % msInDay) / msInHour);
    const minutes = Math.floor((diffInMs % msInHour) / msInMinute);

    // shortDate formatted as D/M/YY (no leading zeros)
    const d = parsed.getUTCDate();
    const m = parsed.getUTCMonth() + 1;
    const yy = String(parsed.getUTCFullYear()).slice(-2);
    const shortDate = `${d}/${m}/${yy}`;

    return { days, hours, minutes, shortDate };
}

export const formattedName = (name) => {
    return name.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const getCurrentDateTime = () => {
    const now = new Date();
    let year = now.getFullYear();
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const monthMapping = {
    'Januari': 1,
    'Februari': 2,
    'Maret': 3,
    'April': 4,
    'Mei': 5,
    'Juni': 6,
    'Juli': 7,
    'Agustus': 8,
    'September': 9,
    'Oktober': 10,
    'November': 11,
    'Desember': 12
};

export const monthNameToNumber = (monthName) => {
    return monthMapping[monthName] || 'di awali huruf besar!';
}

export const getQueryParameter = (parameterName) => {
    const url = window.location.href;
    const queryString = url.split('?')[1]?.split('#')[0];
    if (!queryString) {
        return null;
    }
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName);
}

export const getDiffInDays = (startDateInMs, endDateInMs) => {
    var days = Math.floor((endDateInMs - startDateInMs) / 1000 / 60 / 60 / 24)
    if (days < 0) {
        return 0
    }
    return days
}

export const dateFormatList = [
    "DD/MM/YYYY",
    "MM/YYYY",
    "DD/MM/YY",
    "DD-MM-YYYY",
    "DD-MM-YY",
]

export const dateFormat = "DD-MM-YYYY"

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

export const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
]
export const MONTHS_NUM = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
]

export function relativeTime(UNIXtime) {
    const now = new Date()
    const date = new Date(UNIXtime)
    const diffInMilliseconds = now - new Date(UNIXtime )

    const seconds = Math.floor(diffInMilliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 5) {
        return "just now"
    } else if (seconds < 60) {
        return seconds + " seconds ago"
    } else if (minutes === 1) {
        return "1 minute ago"
    } else if (minutes < 60) {
        return minutes + " minutes ago"
    } else if (hours === 1) {
        return "1 hour ago"
    } else if (hours < 24) {
        return hours + " hours ago"
    } else if (days === 1) {
        return "yesterday"
    } else if (days === 2) {
        return "2 days ago"
    } else if (days <= 7) {
        return days + " days ago"
    } else if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    ) {
        return "today"
    } else {
        // Return the date itself in a specified format (adjust format as needed)
        const options = { year: "numeric", month: "long", day: "numeric" }
        return date.toLocaleDateString(undefined, options)
    }
}

export function getDateInWordsFormat(dateObj) {
    if (dateObj.getDate() < 10) {
        return (
            MONTHS_SHORT[dateObj.getMonth()] +
            " " +
            "0" +
            dateObj.getDate() +
            ", " +
            dateObj.getFullYear()
        )
    }
    return (
        MONTHS_SHORT[dateObj.getMonth()] +
        " " +
        dateObj.getDate() +
        ", " +
        dateObj.getFullYear()
    )
}
export function getDateInWordsResumeFormat(dateObj) {
    if (dateObj.getDate() < 10) {
        return (
            "0" +
            dateObj.getDate() +
            "-" +
            MONTHS_SHORT[dateObj.getMonth()] +
            "-" +
            dateObj.getFullYear()
        )
    }
    return (
        MONTHS_SHORT[dateObj.getMonth()] +
        " " +
        dateObj.getDate() +
        ", " +
        dateObj.getFullYear()
    )
}

export function getDateInFullWordsFormat(dateObj) {
    if (dateObj.getDate() < 10) {
        return (
            MONTHS[dateObj.getMonth()] +
            " " +
            "0" +
            dateObj.getDate() +
            ", " +
            dateObj.getFullYear()
        )
    }
    return (
        MONTHS[dateObj.getMonth()] +
        " " +
        dateObj.getDate() +
        ", " +
        dateObj.getFullYear()
    )
}
export function getDateForAnalyticsFormat(dateObj) {
    if (dateObj.getDate() < 10) {
        return (
            "0" +
            dateObj.getDate() +
            "/" +
            MONTHS_NUM[dateObj.getMonth()] +
            "/" +
            dateObj.getFullYear()
        )
    }
    return (
        dateObj.getDate() +
        "/" +
        MONTHS_NUM[dateObj.getMonth()] +
        "/" +
        dateObj.getFullYear()
    )
}

export function getDateForDatePickerFormat(dateObj) {
    if (dateObj.getDate() < 10) {
        return (
            "0" +
            dateObj.getDate() +
            "/" +
            MONTHS_NUM[dateObj.getMonth()] +
            "/" +
            dateObj.getFullYear()
        )
    }
    return (
        dateObj.getDate() +
        "/" +
        MONTHS_NUM[dateObj.getMonth()] +
        "/" +
        dateObj.getFullYear()
    )
}

export function gettimenow(orgDate) {
    if (orgDate instanceof Date && isFinite(orgDate)) {
        var timehr = orgDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
        return timehr
    } else return ""
}

export function convertDateStrToDateObj(dateStr) {
    return null
}

export function getdatetime(orgDate) {
    if (orgDate instanceof Date && isFinite(orgDate)) {
        var date = getDateInWordsFormat(orgDate)
        var time = gettimenow(orgDate)
        return date + " " + time
    } else return ""
}

export const getDaysArray = function (start, end) {
    for (
        var arr = [], dt = new Date(start);
        dt <= new Date(end);
        dt.setDate(dt.getDate() + 1)
    ) {
        arr.push(getDateForAnalyticsFormat(new Date(dt)))
    }
    return arr
}

export const setStartTime = (orgDate) => {
    if (orgDate instanceof Date && isFinite(orgDate)) {
        return new Date(
            orgDate.getFullYear(),
            orgDate.getMonth(),
            orgDate.getDate(),
            0,
            0,
            0,
            0
        ).getTime()
    } else {
        return null
    }
}

export const setEndTime = (orgDate) => {
    if (orgDate instanceof Date && isFinite(orgDate)) {
        return new Date(
            orgDate.getFullYear(),
            orgDate.getMonth(),
            orgDate.getDate(),
            23,
            59,
            59,
            0
        ).getTime()
    } else {
        return null
    }
}

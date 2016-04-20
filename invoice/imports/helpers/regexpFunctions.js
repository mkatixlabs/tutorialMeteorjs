
export default function isANumber(value) {
    let isANumber = false
    const onlyNumber = new RegExp("^[0-9]+$")
    if (value.match(onlyNumber) !== null) {
        isANumber = true
    }
    return isANumber
} 
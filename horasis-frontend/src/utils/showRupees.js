import { currencyList } from "./fields/fields"

export const showRupees = (rupee, curr = "INR") => {
    var symbol = currencyList.find((val) => val.code === curr).symbol
    var code = currencyList.find((val) => val.code === curr).code
    if (code === symbol) {
        return symbol + " " + rupee
    }
    return symbol + rupee
}
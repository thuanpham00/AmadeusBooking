import axios, { AxiosError } from "axios"
import { airlines, airportCodes } from "src/constant/flightSearch"
import { AirportCodeItem, countryItem } from "src/types/flight.type"

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError<T>(error)
}

export const getNameFromEmail = (email: string) => {
  if (email) {
    const result = email.split("@")
    return result[0]
  }
  return null
}

export const getCodeAirport = (code: string) => {
  if (code) {
    const result = code.split(" - ")
    return result[1]
  }
  return null
}
// Wed Jun 05 2024 00:00:00 GMT+0700 (Indochina Time)
export const convertToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear().toString()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}

// 2024-07-01T14:20:00
export const getHourFromAPI = (hours: string) => {
  if (hours) {
    const result = hours.split("T")
    return result[1].substring(0, 5)
  }
  return null
}

export function getDateFromAPI(date: string) {
  if (date) {
    const res = date.split("T")[0]
    return res
  }
  return null
}

export const getDurationFromAPI = (duration: string) => {
  if (duration) {
    const timePart = duration.split("T")[1] // "5H5M"
    let hours = 0,
      minutes = 0

    if (timePart.includes("H")) {
      hours = parseInt(timePart.split("H")[0], 10)
      if (timePart.includes("M")) {
        minutes = parseInt(timePart.split("H")[1].split("M")[0], 10)
      }
    } else if (timePart.includes("M")) {
      minutes = parseInt(timePart.split("M")[0], 10)
    }

    return `${hours} giờ ${minutes} phút`
  }
  return "" // Trả về chuỗi rỗng nếu duration không tồn tại
}
// PT2h5m
// 2h5m || 2h11m
// hours 2
// minute

// lấy hãng hàng không
export const getAirlinesCode = (aircraft: { [code: string]: string }, code: string) => {
  const carriedCode = aircraft[code]
  return carriedCode
}

export const getPrice = (price: string) => {
  if (price) {
    const res = price.split(".")[0]
    return res
  }
  return null
}

// 123456
export const exchangePrice = (price: string) => {
  const array = (getPrice(price) as string).split("").reverse()
  let n = array.length
  for (let i = 3; i < n; i += 4) {
    array.splice(i, 0, ",") // chèn vô
    n++
  }
  if (array[array.length - 1] === ",") {
    array.pop()
  }

  // split tách chuỗi
  // join nối chuỗi
  return array.reverse().join("")
}

export const getCountryAirport = (code: string) => {
  if (code) {
    const res = airportCodes.find((item) => item.code === code) // tìm được phần tử đầu tiên thì trả về true

    if (res) {
      return res.country + " - " + res.code
    }
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCountry(list: AirportCodeItem[] | countryItem[], code: string) {
  if (code) {
    const res = list.find((item) => item.code === code)
    if (res) {
      return res.country
    }
  }
  return null
}

export function changeTravelerType(type: string) {
  if (type === "ADULT") {
    return "Người lớn"
  } else if (type === "CHILD") return "Trẻ em"
  else if (type === "HELD_INFANT") return "Em bé"
}

export function getAirlines(code: string) {
  if (code) {
    const res = airlines.find((item) => item.code === code)
    if (res) {
      return res.name
    }
  }
  return null
}

export function changeLanguageTraveller(name: string) {
  if (name === "ADULT") {
    return "Người lớn"
  }
}

export function formatCurrency(current: number) {
  return new Intl.NumberFormat("de-DE").format(current)
}

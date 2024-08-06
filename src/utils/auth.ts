import { ResponseFlightPrice } from "src/types/flight.type"

export const setAccessTokenToLS = (accessToken: string) => {
  return localStorage.setItem("accessToken", accessToken)
}

export const getAccessTokenToLS = () => {
  return localStorage.getItem("accessToken") || ""
}

export const setProfileToLS = (profile: string) => {
  return localStorage.setItem("profile", profile)
}

export const getProfileToLS = () => {
  return localStorage.getItem("profile") || ""
}

export const clearLS = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("profile")
}

// cart
export const setCartToLS = (cartItem: ResponseFlightPrice[]) => {
  return localStorage.setItem("listCart", JSON.stringify(cartItem))
}

export const getCartToLS = () => {
  const res = localStorage.getItem("listCart") as string
  return res ? JSON.parse(res) : []
}

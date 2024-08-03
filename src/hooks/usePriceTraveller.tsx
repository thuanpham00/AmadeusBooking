/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react"

import { formatCurrency } from "src/utils/utils"

export default function usePriceTraveller(data: any, type: string) {
  const priceTraveller = useMemo(() => {
    const priceDetail = { total: "0", base: "0", fee: "0" }
    if (data) {
      {
        const res = data.data.flightOffers[0].travelerPricings.find(
          (item: any) => item.travelerType === type
        )
        if (res) {
          priceDetail.total = formatCurrency(Number(res.price.total))
          priceDetail.base = formatCurrency(Number(res.price.base))
          priceDetail.fee = formatCurrency(Number(res.price.total) - Number(res.price.base))
        }
      }
    }
    return priceDetail
  }, [data, type])
  return priceTraveller
}

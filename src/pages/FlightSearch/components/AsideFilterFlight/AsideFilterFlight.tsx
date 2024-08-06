/* eslint-disable @typescript-eslint/no-unused-vars */
import { omit } from "lodash"
import { useState } from "react"
import { createSearchParams, useNavigate } from "react-router-dom"
import Button from "src/components/Button"
import { path } from "src/constant/path"
import { QueryParamsConfig } from "src/hooks/useQueryConfig"
import logoAirLine_1 from "src/img/Flight/logoAirline/logo-1.webp"
import logoAirLine_2 from "src/img/Flight/logoAirline/logo-2.webp"
import logoAirLine_3 from "src/img/Flight/logoAirline/logo-3.webp"
import logoAirLine_4 from "src/img/Flight/logoAirline/logo-4.webp"
import logoAirLine_5 from "src/img/Flight/logoAirline/logo-5.webp"
import logoAirLine_6 from "src/img/Flight/logoAirline/logo-6.webp"

interface Props {
  queryConfig: QueryParamsConfig
}

export default function AsideFilterFlight({ queryConfig }: Props) {
  // nhận vào props -> cập nhật ...queryConfig -> fetch lại api -> render list mới
  const navigate = useNavigate()

  // xử lý nonStop
  const [nonStop, setNonStop] = useState((queryConfig.nonStop === "true" ? true : false) || false)
  const handleNonStop = () => {
    setNonStop((prev) => {
      const newValue = !prev
      navigate({
        pathname: path.flightSearch,
        search: createSearchParams({ ...queryConfig, nonStop: String(newValue) }).toString()
      })
      return newValue
    })
  }

  // xử lý giá tối đa
  const [maxPrice, setMaxPrice] = useState(Number(queryConfig.maxPrice) || 30000000)
  const [showPrice, setShowPrice] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = Number(event.target.value)
    setMaxPrice(price)
  }

  const showPriceRange = () => {
    setShowPrice(true)
  }

  const hidePriceRange = () => {
    setShowPrice(false)
  }

  const handleMaxPrice = () => {
    navigate({
      pathname: path.flightSearch,
      search: createSearchParams({ ...queryConfig, maxPrice: String(maxPrice) }).toString()
    })
  }

  // xử lý hãng hàng không
  const [selectAirlines, setSelectAirlines] = useState(queryConfig.includedAirlineCodes || "")
  const handleSelectAirlines = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.id
    setSelectAirlines((prev) => {
      // tách chuỗi từ dấu ,
      const currentAirlines = prev ? prev.split(",") : [] // mảng
      let airlineList: string[]
      // kiểm tra nếu có giá trị đó trong mảng tách
      if (currentAirlines.includes(value)) {
        airlineList = currentAirlines.filter((airlines) => airlines !== value)
      } else {
        airlineList = [...currentAirlines, value]
      }
      const config =
        airlineList.length === 0
          ? omit({ ...queryConfig }, ["includedAirlineCodes"])
          : { ...queryConfig, includedAirlineCodes: airlineList.join(",") }

      navigate({
        pathname: path.flightSearch,
        search: createSearchParams(config).toString()
      })

      return airlineList.join(",")
    })
  }

  const findSelect = (idAirLines: string): boolean => {
    const list = selectAirlines.split(",")
    return list.includes(idAirLines)
  }

  // xử lý xóa filter
  const handleDeleteFilter = () => {
    navigate({
      pathname: path.flightSearch,
      search: createSearchParams(
        omit({ ...queryConfig }, ["includedAirlineCodes", "maxPrice", "nonStop"])
      ).toString()
    })
    setNonStop(false)
    setMaxPrice(30000000)
    setSelectAirlines("")
  }

  return (
    <div className="bg-[#fff] shadow-md px-4 rounded">
      <div className="pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-lg text-textColor font-semibold">Bộ lọc phổ biến</div>

          <button
            onClick={handleDeleteFilter}
            type="button"
            className="text-base text-textColor hover:underline hover:text-gray-500"
          >
            Xóa bộ lọc
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="nonStop"
            className="w-4 h-4"
            checked={nonStop === true}
            onChange={handleNonStop}
          />
          <label htmlFor="nonStop" className="text-base text-textColor font-medium">
            Bay trực tiếp
          </label>
        </div>
      </div>

      <div className="py-4">
        <div className="text-left text-lg text-textColor font-semibold">Chọn hãng hàng không</div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="VN"
            className="w-4 h-4"
            checked={findSelect("VN")}
            onChange={handleSelectAirlines}
          />
          <label
            htmlFor="VN"
            className="text-base text-textColor font-normal flex items-center gap-2"
          >
            <img src={logoAirLine_1} alt="logo-1" className="w-6 h-6 object-contain" />
            Vietnam Airlines
          </label>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="VJ"
            className="w-4 h-4"
            checked={findSelect("VJ")}
            onChange={handleSelectAirlines}
          />
          <label
            htmlFor="VJ"
            className="text-base text-textColor font-normal flex items-center gap-2"
          >
            <img src={logoAirLine_2} alt="logo-1" className="w-5 h-5 object-contain" />
            VietJet Air
          </label>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="NH"
            className="w-4 h-4"
            checked={findSelect("NH")}
            onChange={handleSelectAirlines}
          />
          <label
            htmlFor="NH"
            className="text-base text-textColor font-normal flex items-center gap-2"
          >
            <img src={logoAirLine_3} alt="logo-1" className="w-5 h-5 object-contain" />
            All Nippon Airways
          </label>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="CX"
            className="w-4 h-4"
            checked={findSelect("CX")}
            onChange={handleSelectAirlines}
          />
          <label
            htmlFor="CX"
            className="text-base text-textColor font-normal flex items-center gap-2"
          >
            <img src={logoAirLine_4} alt="logo-1" className="w-5 h-5 object-contain" />
            Cathay Pacific
          </label>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="CZ"
            className="w-4 h-4"
            checked={findSelect("CZ")}
            onChange={handleSelectAirlines}
          />
          <label
            htmlFor="CZ"
            className="text-base text-textColor font-normal flex items-center gap-2"
          >
            <img src={logoAirLine_5} alt="logo-1" className="w-5 h-5 object-contain" />
            China southern airlines
          </label>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="SQ"
            className="w-4 h-4"
            checked={findSelect("SQ")}
            onChange={handleSelectAirlines}
          />
          <label
            htmlFor="SQ"
            className="text-base text-textColor font-normal flex items-center gap-2"
          >
            <img src={logoAirLine_6} alt="logo-1" className="w-5 h-5 object-contain" />
            Singapore Airlines
          </label>
        </div>
      </div>

      <div className="py-4">
        <div className="text-left text-lg text-textColor font-semibold">Giá chuyến bay</div>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-full relative">
            <input
              className="w-full"
              id="priceRange"
              type="range"
              min="1000000"
              max="100000000"
              step="1000000"
              value={maxPrice}
              onChange={handleChange}
              onMouseEnter={showPriceRange}
              onMouseLeave={hidePriceRange}
            />
            <div
              className="absolute -top-7"
              style={{
                left: `${
                  queryConfig.maxPrice
                    ? ((Number(queryConfig.maxPrice) - 1000000) / (100000000 - 500000)) * 100
                    : ((maxPrice - 1000000) / (100000000 - 1000000)) * 100
                }%`
              }}
            >
              {showPrice && (
                <div className="bg-white border border-gray-300 px-1 py-1 rounded shadow-lg text-sm">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                  }).format(maxPrice)}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-base">500.000đ</span>
              <span className="text-base">100.000.000đ</span>
            </div>
          </div>
        </div>

        <Button nameButton="Áp dụng" onClick={handleMaxPrice} />
      </div>
    </div>
  )
}

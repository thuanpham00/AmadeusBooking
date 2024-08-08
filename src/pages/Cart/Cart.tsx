import { useContext, useState } from "react"
import { Helmet } from "react-helmet-async"
import { AppContext } from "src/context/useContext"
import {
  formatCurrency,
  getCountryAirport,
  getDateFromAPI,
  getDurationFromAPI,
  getHourFromAPI
} from "src/utils/utils"
import iconFlightRed from "../../img/Flight/iconFlightRed.webp"
import Button from "src/components/Button"
import { useNavigate } from "react-router-dom"
import { path } from "src/constant/path"
import { ResponseFlightPrice } from "src/types/flight.type"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "src/components/ui/alert-dialog"

export default function Cart() {
  const navigate = useNavigate()
  const { listCart } = useContext(AppContext)
  const [checked, setChecked] = useState<string>("")
  const [flightPrice, setFlightPrice] = useState<ResponseFlightPrice>()

  // xử lý back page
  const handleBackPage = () => {
    navigate(-1)
  }
  const handleCheckedItem = (index: string) => {
    const findItem = listCart.find((item, indexArr) => {
      if (String(indexArr) === index) {
        setFlightPrice(item)
        return String(indexArr) === index
      }
    })
    if (findItem) {
      setChecked(index)
    }
  }

  const handleNavigatePage = () => {
    navigate(path.flightOrder)
    localStorage.setItem("flightPriceData", JSON.stringify(flightPrice))
  }

  const handleDeleteItemCart = (index: number) => {
    return listCart.slice(index)
  }

  return (
    <div>
      <Helmet>
        <title>Giò hàng</title>
        <meta name="description" content="Giỏ hàng chuyến bay - Booking." />
      </Helmet>

      <div className="container">
        <div className="mt-2 grid grid-cols-12 gap-4">
          <div className="col-span-12 order-1 md:col-span-8 md:order-1">
            <div className="p-4 border border-gray-300 bg-[#fff] shadow-lg rounded flex items-center gap-2">
              <button aria-label="iconBack" onClick={handleBackPage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
              </button>
              <h1 className="text-xl text-textColor font-medium">
                Giỏ hàng của Quý khách ({listCart.length})
              </h1>
            </div>

            <div className="mt-4">
              {listCart.map((cartItem, index) => (
                <div key={index}>
                  <div className="p-4 border border-gray-300 bg-white rounded-lg mb-2">
                    <div className="flex items-center justify-between">
                      <span className="p-2 bg-[#edf0f9] text-xs rounded-md">
                        {cartItem.data.flightOffers[0].type === "flight-offer"
                          ? "Chuyến bay"
                          : "Khác"}
                      </span>

                      <AlertDialog>
                        <AlertDialogTrigger aria-label="buttonDelete">
                          <button className="text-sm hover:underline duration-200 flex items-center justify-center gap-1 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                            Xóa
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="p-4 w-[400px] max-h-[150px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base text-center font-medium">
                              Quý khách có chắc chắn là muốn loại bỏ cái này khỏi giỏ hàng không??
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="w-full">
                            <AlertDialogCancel className="w-[50%] border-blueColor border">
                              Không, quay lại
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="w-[50%] bg-blueColor"
                              onClick={() => handleDeleteItemCart(index)}
                            >
                              Có, loại bỏ nó
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="mt-2">
                      {cartItem.data.flightOffers[0].itineraries.map((item, index2) => (
                        <div
                          key={index2}
                          className="pt-4 pb-2 border-b border-b-gray-300 first:pt-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-base font-medium">
                              {getCountryAirport(item.segments[0].departure.iataCode)}
                            </div>
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                                />
                              </svg>
                            </div>
                            <div className="text-base font-medium">
                              {getCountryAirport(
                                item.segments[item.segments.length - 1].arrival.iataCode
                              )}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <img src={iconFlightRed} alt="icon" className="w-6 h-6" />
                            <span>{getDateFromAPI(item.segments[0].departure.at)}</span>
                            <div className="text-base font-medium text-textColor">
                              {getHourFromAPI(item.segments[0].departure.at)}
                            </div>
                            <div className="w-4 h-[1px] bg-textColor"></div>
                            <div className="text-base font-medium text-textColor">
                              {getHourFromAPI(item.segments[item.segments.length - 1].arrival.at)}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-1 pb-2">
                            <span className="block text-gray-500 text-xs font-medium">
                              {
                                cartItem.data.flightOffers[0].travelerPricings[0]
                                  .fareDetailsBySegment[0].cabin
                              }
                            </span>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <span className="text-gray-500 text-sm">
                              {item.segments.length === 1 && (
                                <div>{getDurationFromAPI(item.segments[0].duration)}</div>
                              )}

                              {item.segments.length !== 1 && (
                                <div>
                                  {(() => {
                                    const durationHour1 = getDurationFromAPI(
                                      item.segments[0].duration
                                    ).split(" giờ ")[0]
                                    const durationHour2 = getDurationFromAPI(
                                      item.segments[item.segments.length - 1].duration
                                    ).split(" giờ ")[0]

                                    const durationMinute1 = getDurationFromAPI(
                                      item.segments[0].duration
                                    )
                                      .split(" giờ ")[1]
                                      .split(" phút")[0]

                                    const durationMinute2 = getDurationFromAPI(
                                      item.segments[item.segments.length - 1].duration
                                    )
                                      .split(" giờ ")[1]
                                      .split(" phút")[0]

                                    let hours = Number(durationHour1) + Number(durationHour2)
                                    let minute = Number(durationMinute1) + Number(durationMinute2)
                                    if (minute >= 60) {
                                      minute = minute % 60
                                      hours = hours + 1
                                    }
                                    return (
                                      <div>
                                        {hours} giờ {minute} phút
                                      </div>
                                    )
                                  })()}
                                </div>
                              )}
                            </span>
                            <div>
                              {item.segments[0].numberOfStops === 0 &&
                              item.segments.length === 1 ? (
                                <div className="flex items-center gap-2 text-center text-gray-500 text-sm">
                                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                  <span>Bay trực tiếp</span>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked === String(index)}
                            onChange={() => handleCheckedItem(String(index))}
                          />
                          <label htmlFor="traveler">
                            {cartItem.data.flightOffers[0].travelerPricings.length} x Hành khách
                          </label>
                        </div>
                        <div className="text-right">
                          <div className="text-base lg:text-lg font-semibold">
                            {formatCurrency(Number(cartItem.data.flightOffers[0].price.total))}đ
                          </div>
                          <span className="text-sm text-gray-500">Bao gồm thuế và phí</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 order-2 md:col-span-4 md:order-2">
            <div className="sticky left-0 top-2">
              <div className="bg-[#fff] border border-gray-300 p-4 shadow-md rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg">Tổng giá</div>
                    <div className="text-sm text-gray-500">1 món hàng, bao gồm thuế và phí</div>
                  </div>
                  <div className="text-base lg:text-xl font-medium text-red-500">
                    {flightPrice
                      ? formatCurrency(Number(flightPrice?.data.flightOffers[0].price.total))
                      : "0"}{" "}
                    đ
                  </div>
                </div>
                <Button
                  onClick={handleNavigatePage}
                  nameButton="Tiếp tục"
                  className="rounded-full mt-4 py-2 bg-blueColor w-full text-whiteColor text-base hover:bg-blueColor/80 duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { AppContext } from "src/context/useContext"
import {
  getCountryAirport,
  getDateFromAPI,
  getDurationFromAPI,
  getHourFromAPI
} from "src/utils/utils"
import iconFlightRed from "../../img/Flight/iconFlightRed.webp"

export default function Cart() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const navigate = useNavigate()
  const { listCart } = useContext(AppContext)

  return (
    <div>
      <Helmet>
        <title>Giò hàng</title>
        <meta name="description" content="Giỏ hàng chuyến bay - Booking." />
      </Helmet>

      <div className="w-full">
        <div className="container">
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 order-2 md:col-span-8 md:order-1">
              <div className="p-4 border border-gray-300 bg-[#fff] shadow-md rounded">
                <h1 className="text-xl text-textColor font-medium">
                  Giỏ hàng của Quý khách ({listCart.length})
                </h1>
              </div>

              <div className="mt-4">
                {listCart.map((cartItem, index) => (
                  <div key={index}>
                    <div className="p-4 border border-gray-300 bg-white rounded-md mb-4">
                      <div className="flex items-center justify-between">
                        <span className="p-2 bg-[#edf0f9] text-xs rounded-md">
                          {cartItem.data.flightOffers[0].type === "flight-offer"
                            ? "Chuyến bay"
                            : "Khác"}
                        </span>
                        <button
                          aria-label="deleteItemCart"
                          className="text-sm hover:underline duration-200 flex items-center justify-center gap-1 text-gray-500"
                        >
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
                      </div>

                      <div className="mt-2">
                        {cartItem.data.flightOffers[0].itineraries.map((item, index2) => (
                          <div
                            key={index2}
                            className="py-4 border-b border-b-gray-300 last:border-b-0 first:pt-0"
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
                            <div className="mt-1 flex items-center gap-1">
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
                              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                              <div className="text-center text-gray-500 text-sm">
                                {item.segments[0].numberOfStops === 0 && item.segments.length === 1
                                  ? "Bay trực tiếp"
                                  : ""}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 order-1 md:col-span-4 md:order-2">
              <div className="sticky left-0 top-2">
                <div className="bg-[#fff] border border-gray-300 p-4 shadow-md rounded">thuan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import { countries, countryCodePhone } from "src/constant/flightSearch"
import {
  CountryListCodeNumber,
  FlightCreateOrder,
  ResponseFlightPrice,
  TravellerType
} from "src/types/flight.type"
import { produce } from "immer"
import {
  formatCurrency,
  getAirlines,
  getCountry,
  getDateFromAPI,
  getDurationFromAPI,
  getHourFromAPI
} from "src/utils/utils"
import iconFlight from "src/img/Flight/iconFlightRed.webp"
import checkInBaggage from "src/img/FlightOrder/checkin_baggage_icon.webp"
import avatar1 from "src/img/FlightOrder/avatar1.webp"
import avatar2 from "src/img/FlightOrder/avatar2.webp"
import icon2 from "src/img/FlightOrder/imp-info.webp"
import { useNavigate } from "react-router-dom"
import FormProfile from "./Components/FormProfile"
import Button from "src/components/Button"
import { useMutation } from "@tanstack/react-query"
import { flightApi } from "src/apis/flight.api"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import schema, { schemaType } from "src/utils/rules"
import Input from "src/components/Input"
import InputSearchV2 from "./Components/InputSearchV2"
import CodeNumberList from "./Components/CodeNumberList"
import useScrollHeader from "src/hooks/useScrollHeader"
import { path } from "src/constant/path"
import usePriceTraveller from "src/hooks/usePriceTraveller"

export type FormData = Pick<
  schemaType,
  "codeNumber" | "numberPhone" | "email" | "userName2" | "lastName2"
>
export type InputName = "codeNumber"
const schemaFormData = schema.pick(["codeNumber", "numberPhone", "email", "userName2", "lastName2"])
const FetchDataListNational = () => Promise.resolve(countryCodePhone)

export default function FlightOrder() {
  const navigate = useNavigate()
  // xử lý header
  const { showHeader } = useScrollHeader(200)
  // xử lý form
  const [currentAdult, setCurrentAdult] = useState<number>(0)
  const [currentChild, setCurrentChild] = useState<number>(0)
  const [currentInfant, setCurrentInfant] = useState<number>(0)
  const [checkState, setCheckState] = useState<boolean[]>(Array(currentAdult).fill(true)) // khởi tạo 1 mảng trạng thái toàn true
  const inputRef = useRef<HTMLInputElement>(null)
  const [codeNumberList, setCodeNumberList] = useState<CountryListCodeNumber>([])
  const [codeNumber, setCodeNumber] = useState("")
  const [showListCodeNumber, setShowListCodeNumber] = useState<boolean>(false)

  useEffect(() => {
    FetchDataListNational().then((res) => {
      setCodeNumberList(res)
    })
  }, [])

  const filterCodeNumber = useMemo(
    () =>
      codeNumberList.filter((item) => item.name.toLowerCase().includes(codeNumber.toLowerCase())),
    [codeNumberList, codeNumber]
  )

  // xử lý back page
  const handleBackPage = () => {
    navigate(-1)
  }

  const dataLS = localStorage.getItem("flightPriceData") as string
  const data = JSON.parse(dataLS) as ResponseFlightPrice

  const quantityOfTraveller = useMemo(() => {
    const count = { adult: 0, child: 0, infant: 0 }
    if (data) {
      data.data.flightOffers[0].travelerPricings.map((item) => {
        if (item.travelerType === "ADULT") {
          count.adult++
        } else if (item.travelerType === "CHILD") {
          count.child++
        } else if (item.travelerType === "HELD_INFANT") {
          count.infant++
        }
      })
    }
    return count
  }, [data])

  const priceAdult = usePriceTraveller(data, "ADULT")
  const priceChild = usePriceTraveller(data, "CHILD")
  const priceInfant = usePriceTraveller(data, "HELD_INFANT")
  const priceTotal = useMemo(() => {
    return data.data.flightOffers[0].travelerPricings.reduce(
      (result, current) => result + Number(current.price.total),
      0
    )
  }, [data])

  // cái này hay
  const handleCheckTraveller =
    (type: string, index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "adult") {
        setCheckState(
          produce((draft) => {
            draft[index] = event.target.checked // đại diện checked previous
          })
        )
      } else if (type === "child") {
        setCheckState(
          produce((draft) => {
            draft[index] = event.target.checked // đại diện checked previous
          })
        )
      } else if (type === "infant") {
        setCheckState(
          produce((draft) => {
            draft[index] = event.target.checked // đại diện checked previous
          })
        )
      }
    }

  const handleAddTraveller = (type: string) => () => {
    if (type === "adult") {
      if (currentAdult < quantityOfTraveller.adult) {
        setCurrentAdult((prev) => prev + 1)
      }
    } else if (type === "child") {
      if (currentChild < quantityOfTraveller.child) {
        setCurrentChild((prev) => prev + 1)
      }
    } else if (type === "infant") {
      if (currentInfant < quantityOfTraveller.infant) {
        setCurrentInfant((prev) => prev + 1)
      }
    }
  }

  // xử lý form
  const [travellers, setTravellers] = useState<TravellerType[]>([])

  const addTraveller = (newTravellers: TravellerType) => {
    setTravellers((prev) => [...prev, newTravellers])
  }

  const handleItemClick = (inputName: InputName, value: string) => {
    setValue(inputName, value as string)
    setCodeNumber(value as string)
    setShowListCodeNumber(false)
  }

  const flightCreateOrderMutation = useMutation({
    mutationFn: (body: FlightCreateOrder) => {
      return flightApi.flightCreateOrder(body)
    }
  })

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schemaFormData)
  })

  const onSubmit = handleSubmit((dataForm) => {
    if (travellers.length === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin")
    } else {
      const loadingToastId = toast.loading("Vui lòng chờ trong giây lát!!!")
      const createOrder: FlightCreateOrder = {
        data: {
          type: "flight-order",
          flightOffers: [data.data.flightOffers[0]],
          travelers: travellers.map((item, index) => ({ ...item, id: index + 1 })),
          remarks: {
            // ghi chú
            general: [
              {
                subType: "GENERAL_MISCELLANEOUS",
                text: "ONLINE BOOKING FROM INCREIBLE VIAJES"
              }
            ]
          },
          ticketingAgreement: {
            // tùy chọn của thỏa thuận vé và thời gian trì hoãn
            option: "DELAY_TO_CANCEL",
            delay: "6D"
          },
          // Thông tin liên hệ:
          contacts: [
            {
              addresseeName: {
                firstName: dataForm.userName2,
                lastName: dataForm.lastName2
              },
              companyName: "INCREIBLE VIAJES",
              purpose: "STANDARD",
              phones: [
                {
                  deviceType: "MOBILE",
                  countryCallingCode: dataForm.codeNumber,
                  number: dataForm.numberPhone
                }
              ],
              emailAddress: dataForm.email,
              address: {
                lines: ["Calle Prado, 16"],
                postalCode: "28014",
                cityName: "HCM",
                countryCode: "VN"
              }
            }
          ]
        }
      }
      flightCreateOrderMutation.mutate(createOrder, {
        onSuccess: () => {
          toast.dismiss(loadingToastId)
          toast.success("Lưu thông tin thành công!")
          navigate(path.flightPayment)
        }
      })
    }
  })

  useEffect(() => {
    if (flightCreateOrderMutation.data?.data) {
      localStorage.setItem("detailPaymentData", JSON.stringify(flightCreateOrderMutation.data.data))
    }
  }, [flightCreateOrderMutation.data?.data])

  return (
    <div>
      <Helmet>
        <title>Đặt vé chuyến bay</title>
        <meta name="description" content="Đặt vé chuyến bay - Booking." />
      </Helmet>

      <div className="relative z-10">
        <div
          className={`w-full bg-blueColor ${showHeader ? "fixed top-0 left-1/2 -translate-x-1/2 shadow-xl" : "absolute top-0 left-1/2 -translate-x-1/2"} z-50 transition-all ease-linear duration-1000`}
        >
          <div className="container">
            <div className="py-4 px-1 grid grid-cols-12 items-center">
              <div className="col-span-12 md:col-span-5">
                <div className="flex items-center gap-2">
                  <button aria-label="iconBack" onClick={handleBackPage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                      />
                    </svg>
                  </button>
                  <h1 className="text-xl text-whiteColor font-semibold">Hoàn tất đặt vé của bạn</h1>
                </div>
              </div>
              <div className="hidden col-span-7 items-center md:flex flex-col">
                <div className="w-[80%] flex items-center justify-between">
                  <div>
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                      1
                    </div>
                  </div>

                  <div className="w-60 h-1 bg-gray-400"></div>

                  <div>
                    <div className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">
                      2
                    </div>
                  </div>

                  <div className="w-60 h-1 bg-gray-400"></div>

                  <div>
                    <div className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className="text-white text-sm">Thông tin hành khách</div>
                  <div className="text-white text-sm">Chi tiết thanh toán</div>
                  <div className="text-white text-sm">Đã xác nhận đặt vé!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full absolute top-20 left-1/2 -translate-x-1/2">
          <div className="container">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 order-2 md:col-span-8 md:order-1">
                {data.data.flightOffers[0].itineraries.map((item, index) => (
                  <div
                    key={index}
                    className="relative p-4 mb-4 bg-white last:mb-0 shadow-md rounded-lg border border-gray-300 shadow"
                  >
                    <div className="flex items-center justify-between flex-wrap">
                      <div className="flex items-center gap-1">
                        <h2 className="text-base md:text-xl text-textColor font-semibold">
                          {item.segments[0].departure.iataCode},{" "}
                          {getCountry(
                            countries,
                            data.dictionaries.locations[item.segments[0].departure.iataCode]
                              .countryCode
                          )}
                        </h2>
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                          </svg>
                        </div>
                        <h2 className="text-base md:text-xl text-textColor font-semibold">
                          {item.segments[item.segments.length - 1].arrival.iataCode},{" "}
                          {getCountry(
                            countries,
                            data.dictionaries.locations[
                              item.segments[item.segments.length - 1].arrival.iataCode
                            ].countryCode
                          )}
                        </h2>
                      </div>
                      <div className="text-white p-1 bg-red-600 text-xs font-normal">
                        KHÔNG HOÀN TIỀN
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="p-1 text-sm text-textColor font-medium bg-[#ffedd1]">
                        {getDateFromAPI(item.segments[0].departure.at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-gray-500 text-sm">
                          {item.segments.length === 1 ? <div>Non Stop</div> : <div>1 Stop</div>}
                        </div>
                        <div className="w-1 h-1 bg-textColor rounded-full"></div>
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
                      </div>
                    </div>

                    <div className="bg-green-600 w-1 h-16 absolute left-0 top-4"></div>

                    {item.segments.map((detail, indexDetail) => (
                      <div key={indexDetail} className="mt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={iconFlight} alt="iconFlight" className="w-8 h-8" />
                            <h3 className="text-sm font-normal">
                              {getAirlines(detail.carrierCode)}
                            </h3>
                            <span className="text-sm text-gray-500">{detail.carrierCode}</span>
                            <span className="text-sm text-gray-500">{detail.number}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {
                              data.data.flightOffers[0].travelerPricings[0].fareDetailsBySegment[0]
                                .cabin
                            }
                          </div>
                        </div>

                        <div className="relative mt-2 p-2 md:p-4 bg-[#f4f4f4]">
                          <div className="flex items-center pb-4 md:pb-2 gap-4">
                            <div className="h-[100px] md:h-[80px] flex flex-col justify-between">
                              <span className="block text-base font-medium">
                                {getHourFromAPI(detail.departure.at)}
                              </span>

                              <span className="block text-base font-medium">
                                {getHourFromAPI(detail.arrival.at)}
                              </span>
                            </div>

                            <div className="relative h-[80px] md:h-[60px] flex flex-col justify-between">
                              <div className="border border-gray-500 bg-white w-3 h-3 rounded-full"></div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-8 bg-gray-500"></div>
                              <div className="border border-gray-500 bg-white w-3 h-3 rounded-full"></div>
                            </div>

                            <div className="h-[100px] md:h-[80px] flex flex-col justify-between">
                              <div className="text-base font-medium">
                                {detail.departure.iataCode}
                                {" - "}
                                {getCountry(
                                  countries,
                                  data.dictionaries.locations[detail.departure.iataCode].countryCode
                                )}
                                , Nhà ga khởi hành: {detail.departure.terminal}
                              </div>
                              <span className="text-sm">{getDurationFromAPI(detail.duration)}</span>
                              <div className="text-base font-medium">
                                {detail.arrival.iataCode}
                                {" - "}
                                {getCountry(
                                  countries,
                                  data.dictionaries.locations[detail.arrival.iataCode].countryCode
                                )}
                                , Nhà ga khởi hành: {detail.arrival.terminal}
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-t-gray-300 flex items-center">
                            <img src={checkInBaggage} alt="checkIn" className="w-10 h-8" />
                            <span className="text-sm text-textColor font-semibold">
                              Check-In Hành lý:
                            </span>
                            <span className="ml-2 text-sm text-textColor">
                              {
                                data.data.flightOffers[0].travelerPricings[0]
                                  .fareDetailsBySegment[0].includedCheckedBags.weight
                              }
                              {
                                data.data.flightOffers[0].travelerPricings[0]
                                  .fareDetailsBySegment[0].includedCheckedBags.weightUnit
                              }{" "}
                              / Người lớn
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="my-4">
                  <h2 className="text-lg text-textColor font-semibold my-2">
                    Thông tin hành khách
                  </h2>

                  {data.data.flightOffers[0].travelerPricings.find(
                    (item) => item.travelerType === "ADULT"
                  ) && (
                    <div className="my-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={avatar2} alt="avatar" />
                          <span className="text-base text-textColor font-medium">
                            Người lớn (12 tuổi trở lên)
                          </span>
                        </div>
                        <div>
                          <span className="text-base text-textColor font-medium">
                            {currentAdult}
                          </span>
                          <span className="text-base text-textColor font-medium">
                            /{quantityOfTraveller.adult}
                          </span>
                          <span className="ml-1 text-base text-gray-500">Thêm</span>
                        </div>
                      </div>

                      {currentAdult === quantityOfTraveller.adult && (
                        <div className="text-xs text-red-500 p-2 pb-0">
                          Bạn đã chọn tối đa vé cho Người lớn
                        </div>
                      )}

                      <div className="mt-2">
                        {currentAdult === 0 ? (
                          <div className="p-4 bg-white shadow-md border-b border-b-gray-300">
                            <span className="text-sm text-gray-500">
                              Bạn chưa thêm bất kỳ người lớn nào vào danh sách
                            </span>
                          </div>
                        ) : (
                          Array(currentAdult)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={index}
                                className="w-full gap-2 relative shadow bg-white border-b border-b-gray-300 p-6 rounded mb-2"
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4"
                                  checked={checkState[index] || false}
                                  onChange={handleCheckTraveller("adult", index)}
                                />
                                <label htmlFor={String(index)} className="absolute left-12">
                                  Người lớn {index + 1}
                                </label>
                                <div className="FormProfile">
                                  <FormProfile addOnTraveller={addTraveller} />
                                </div>
                              </div>
                            ))
                        )}
                      </div>

                      <div className="mt-2 p-4 bg-white">
                        <button
                          type="button"
                          onClick={handleAddTraveller("adult")}
                          className="text-sm text-blue-500 uppercase flex items-center gap-2"
                        >
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
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Thêm thông tin hành khách (người lớn) mới
                        </button>
                      </div>
                    </div>
                  )}

                  {data.data.flightOffers[0].travelerPricings.find(
                    (item) => item.travelerType === "CHILD"
                  ) && (
                    <div className="my-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={avatar1} alt="avatar" />
                          <span className="text-base text-textColor font-medium">
                            Trẻ em (dưới 12 tuổi)
                          </span>
                        </div>
                        <div>
                          <span className="text-base text-textColor font-medium">
                            {currentChild}
                          </span>
                          <span className="text-base text-textColor font-medium">
                            /{quantityOfTraveller.child}
                          </span>
                          <span className="ml-1 text-base text-gray-500">Thêm</span>
                        </div>
                      </div>

                      {currentChild === quantityOfTraveller.child && (
                        <div className="text-xs text-red-500 p-2 pb-0">
                          Bạn đã chọn tối đa vé cho Trẻ em
                        </div>
                      )}

                      <div className="mt-2">
                        {currentChild === 0 ? (
                          <div className="p-4 bg-white shadow-md border-b border-b-gray-300">
                            <span className="text-sm text-gray-500">
                              Bạn chưa thêm bất kỳ trẻ em nào vào danh sách
                            </span>
                          </div>
                        ) : (
                          Array(currentChild)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={index}
                                className="w-full gap-2 relative shadow bg-white border-b border-b-gray-300 p-6 rounded mb-2"
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4"
                                  id={String(index)}
                                  checked={checkState[index]}
                                  onChange={handleCheckTraveller("child", index)}
                                />
                                <label htmlFor={String(index)} className="absolute left-12">
                                  Trẻ em {index + 1}
                                </label>
                                <div className="FormProfile">
                                  <FormProfile addOnTraveller={addTraveller} />
                                </div>
                              </div>
                            ))
                        )}
                      </div>

                      <div className="mt-2 p-4 bg-white">
                        <button
                          type="button"
                          onClick={handleAddTraveller("child")}
                          className="text-sm text-blue-500 uppercase flex items-center gap-2"
                        >
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
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Thêm thông tin hành khách (trẻ em) mới
                        </button>
                      </div>
                    </div>
                  )}

                  {data.data.flightOffers[0].travelerPricings.find(
                    (item) => item.travelerType === "HELD_INFANT"
                  ) && (
                    <div className="my-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={avatar2} alt="avatar" />
                          <span className="text-base text-textColor font-medium">
                            Em bé (dưới 2 tuổi)
                          </span>
                        </div>
                        <div>
                          <span className="text-base text-textColor font-medium">
                            {currentInfant}
                          </span>
                          <span className="text-base text-textColor font-medium">
                            /{quantityOfTraveller.infant}
                          </span>
                          <span className="ml-1 text-base text-gray-500">Thêm</span>
                        </div>
                      </div>

                      {currentInfant === quantityOfTraveller.infant && (
                        <div className="text-xs text-red-500 p-2 pb-0">
                          Bạn đã chọn tối đa vé cho Em bé
                        </div>
                      )}

                      <div className="mt-2">
                        {currentInfant === 0 ? (
                          <div className="p-4 bg-white shadow-md border-b border-b-gray-300">
                            <span className="text-sm text-gray-500">
                              Bạn chưa thêm bất kỳ người lớn nào vào danh sách
                            </span>
                          </div>
                        ) : (
                          Array(currentInfant)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={index}
                                className="w-full gap-2 relative shadow bg-white border-b border-b-gray-300 p-6 rounded mb-2"
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4"
                                  id={String(index)}
                                  checked={checkState[index]}
                                  onChange={handleCheckTraveller("infant", index)}
                                />
                                <label htmlFor={String(index)} className="absolute left-12">
                                  Em bé {index + 1}
                                </label>
                                <div className="FormProfile">
                                  <FormProfile addOnTraveller={addTraveller} />
                                </div>
                              </div>
                            ))
                        )}
                      </div>

                      <div className="mt-2 p-4 bg-white">
                        <button
                          type="button"
                          onClick={handleAddTraveller("infant")}
                          className="text-sm text-blue-500 uppercase flex items-center gap-2"
                        >
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
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Thêm thông tin hành khách (em bé) mới
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-lg text-textColor font-semibold my-2">Thông tin liên hệ</h2>
                    <form onSubmit={onSubmit} className="bg-white shadow-xl">
                      <div className="py-3 border-b border-b-gray-300">
                        <span className="px-4 text-base font-medium block">
                          Thông tin liên hệ (nhận vé/phiếu thanh toán)
                        </span>
                        <span className="px-4 text-sm block text-gray-500">
                          Vé Điện tử của quý khách sẽ được gửi đến đây
                        </span>
                      </div>
                      <div className="p-4 grid grid-cols-6 items-center gap-2 flex-wrap">
                        <div className="col-span-6 md:col-span-3">
                          <span className="mb-[2px] text-sm block">
                            Tên Đệm & Tên (vd: Minh Thuan) <span className="text-red-500">*</span>
                          </span>
                          <Input
                            className="flex flex-col items-start"
                            classNameInput="w-full p-2 outline-none bg-transparent border font-normal focus:border-blueColor bg-white rounded border border-gray-400 text-base"
                            type="text"
                            autoComplete="on"
                            placeholder="Tên"
                            name="userName2"
                            register={register}
                            messageError={errors.userName2?.message}
                          />
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          <span className="mb-[2px] text-sm block">
                            Họ (vd: Pham) <span className="text-red-500">*</span>
                          </span>
                          <Input
                            className="flex flex-col items-start"
                            classNameInput="w-full p-2 outline-none bg-transparent border font-normal focus:border-blueColor bg-white rounded border border-gray-400 text-base"
                            type="text"
                            autoComplete="on"
                            placeholder="Họ"
                            name="lastName2"
                            register={register}
                            messageError={errors.lastName2?.message}
                          />
                        </div>
                        <div className="col-span-6 md:col-span-3 flex">
                          <div className="w-[40%]">
                            <span className="mb-[2px] text-sm block">Mã quốc gia</span>
                            <InputSearchV2
                              autoComplete="on"
                              placeholder="+84"
                              classNameList="z-20 absolute top-10 left-0 h-[200px] bg-whiteColor overflow-y-auto overflow-x-hidden rounded-sm shadow-sm transition-all duration-1000 ease-linear"
                              classNameBlock="relative flex items-center"
                              classNameInput="w-full p-2 outline-none bg-white text-base flex-grow truncate font-normal focus:border-blueColor text-textColor rounded-tl rounded-bl border border-gray-400"
                              ref={inputRef}
                              value={codeNumber}
                              showList={showListCodeNumber}
                              handleChangeValue={(event) => setCodeNumber(event.target.value)}
                              handleFocus={() => setShowListCodeNumber(true)}
                              register={register}
                              name="codeNumber"
                              error={errors.codeNumber?.message}
                            >
                              <CodeNumberList
                                listAirport={filterCodeNumber}
                                handleItemClick={handleItemClick}
                                inputName="codeNumber"
                              />
                            </InputSearchV2>
                          </div>
                          <div className="w-[60%]">
                            <span className="mb-[2px] text-sm block">Số điện thoại</span>
                            <Input
                              className="flex flex-col items-start"
                              classNameInput="w-full p-2 outline-none bg-transparent border font-normal focus:border-blueColor bg-white rounded-tr rounded-br border text-base border-gray-400"
                              type="text"
                              autoComplete="on"
                              placeholder="Số điện thoại"
                              name="numberPhone"
                              register={register}
                              messageError={errors.numberPhone?.message}
                            />
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          <span className="mb-[2px] text-sm block">Email</span>
                          <Input
                            className="flex flex-col items-start"
                            classNameInput="w-full p-2 outline-none bg-transparent border font-normal focus:border-blueColor bg-white rounded border border-gray-400 text-base"
                            type="text"
                            autoComplete="on"
                            placeholder="Email"
                            name="email"
                            register={register}
                            messageError={errors.email?.message}
                          />
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Button
                          type="submit"
                          disable={flightCreateOrderMutation.isPending}
                          classNameWrapper="flex justify-end relative"
                          nameButton="Tiếp tục"
                          className="py-3 bg-blueColor px-12 text-whiteColor text-base rounded-sm hover:bg-blueColor/80 duration-200 "
                          classNameLoading="absolute top-2 right-[14%]"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-span-12 order-1 md:col-span-4 md:order-2">
                <div className="sticky left-0 top-20 ">
                  <div className="bg-[#fff] p-4 shadow-md rounded-lg">
                    <span className="text-base mb-4 block font-medium">Phân tích giá</span>
                    {/* nó phải có type này trong data mới hiện giá
                  hàm find nó trả về phần tử đầu tiên tìm thấy */}
                    {data.data.flightOffers[0].travelerPricings.find(
                      (item) => item.travelerType === "ADULT"
                    ) && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Người lớn</span>
                          <div className="flex gap-1 text-sm font-medium">
                            <span>
                              {priceAdult?.total}
                              {" đ"}
                            </span>
                            <span>x</span>
                            <span>{quantityOfTraveller.adult}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="text-sm font-normal">Giá gốc</span>
                          <span className="font-normal text-sm mb-1 block">
                            {priceAdult?.base}
                            {" đ"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="text-sm font-normal">Thuế và phí</span>
                          <span className="font-normal text-sm mb-1 block">
                            {priceAdult?.fee}
                            {" đ"}
                          </span>
                        </div>
                      </div>
                    )}

                    {data.data.flightOffers[0].travelerPricings.find(
                      (item) => item.travelerType === "CHILD"
                    ) && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Trẻ em</span>
                          <div className="flex gap-1 text-sm font-medium">
                            <span>
                              {priceChild?.total}
                              {" đ"}
                            </span>
                            <span>x</span>
                            <span>{quantityOfTraveller.adult}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="text-sm font-normal">Giá gốc</span>
                          <span className="font-normal text-sm mb-1 block">
                            {priceChild?.base}
                            {" đ"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="text-sm font-normal">Thuế và phí</span>
                          <span className="font-normal text-sm mb-1 block">
                            {priceChild?.fee}
                            {" đ"}
                          </span>
                        </div>
                      </div>
                    )}

                    {data.data.flightOffers[0].travelerPricings.find(
                      (item) => item.travelerType === "HELD_INFANT"
                    ) && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Em bé</span>
                          <div className="flex gap-1 text-sm font-medium">
                            <span>
                              {priceInfant?.total}
                              {" đ"}
                            </span>
                            <span>x</span>
                            <span>{quantityOfTraveller.adult}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="text-sm font-normal">Giá gốc</span>
                          <span className="font-normal text-sm mb-1 block">
                            {priceInfant?.base}
                            {" đ"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="text-sm font-normal">Thuế và phí</span>
                          <span className="font-normal text-sm mb-1 block">
                            {priceInfant?.fee}
                            {" đ"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 border-t border-t-gray-300 py-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Giảm giá</span>
                      <span className="text-sm font-medium">0đ</span>
                    </div>
                    <div className="mt-2 border-t border-t-gray-300 py-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Phí xử lý</span>
                      <span className="text-sm font-medium text-[#32a923] uppercase">miễn phí</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base block font-medium">Tổng cộng</span>
                      <span className="text-xl font-medium text-red-600">
                        {formatCurrency(priceTotal)}
                        {" đ"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 bg-[#fff] p-4 shadow-md rounded-lg">
                    <div className="overflow-y-auto h-[200px]">
                      <h2 className="text-base text-textColor font-semibold">Điều kiện đặt chỗ</h2>
                      <div>
                        <div className="mt-3 flex items-center gap-2">
                          <img src={icon2} alt="icon" className="w-5 h-5" />
                          <h3 className="text-sm text-textColor font-semibold">
                            {
                              data.data.flightOffers[0].itineraries[0].segments[0].departure
                                .iataCode
                            }
                            {"-"}
                            {
                              data.data.flightOffers[0].itineraries[0].segments[
                                data.data.flightOffers[0].itineraries[0].segments.length - 1
                              ].arrival.iataCode
                            }
                            : Yêu cầu Visa quá cảnh
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 max-w-[350px]">
                            Vui lòng kiểm tra các yêu cầu về Quá cảnh/Visa trước khi bạn lên kế
                            hoạch cho chuyến đi của mình.
                          </span>
                        </div>
                      </div>

                      {data.data.flightOffers[0].itineraries.length > 1 && (
                        <div className="mt-3">
                          <div className="mt-2 flex items-center gap-2">
                            <img src={icon2} alt="icon" className="w-5 h-5" />
                            <h3 className="text-sm text-textColor font-semibold">
                              {
                                data.data.flightOffers[0].itineraries[
                                  data.data.flightOffers[0].itineraries.length - 1
                                ].segments[0].departure.iataCode
                              }
                              {"-"}
                              {
                                data.data.flightOffers[0].itineraries[
                                  data.data.flightOffers[0].itineraries.length - 1
                                ].segments[
                                  data.data.flightOffers[0].itineraries[0].segments.length - 1
                                ].arrival.iataCode
                              }
                              : Yêu cầu Visa quá cảnh
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mt-2 ml-2">
                            <div className="h-1 w-1 rounded-full bg-textColor"></div>
                            <span className="text-sm text-gray-600 max-w-[350px]">
                              Vui lòng kiểm tra các yêu cầu về Quá cảnh/Visa trước khi bạn lên kế
                              hoạch cho chuyến đi của mình.
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <img src={icon2} alt="icon" className="w-5 h-5" />
                          <h3 className="text-base text-textColor font-semibold">
                            Chính sách vắng mặt
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Nếu hành khách không bắt đầu hành trình tiếp theo, toàn bộ mã đặt chỗ
                            (PNR) sẽ bị hủy tự động bởi hãng hàng không. Booking. không thể kiểm
                            soát hoặc cung cấp đặt chỗ thay thế trong trường hợp này. Hình phạt hủy
                            chuyến sẽ áp dụng theo quy định của hãng hàng không.
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mt-2 flex items-center gap-2">
                          <img src={icon2} alt="icon" className="w-5 h-5" />
                          <h3 className="text-base text-textColor font-semibold">
                            Vui lòng ghi chú
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Hành khách đi bằng visa du lịch/thăm thân cần vé khứ hồi đã xác nhận.
                          </span>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Mang theo bằng chứng chỗ ở và đủ tiền chi trả ở nước đến.
                          </span>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Tuân thủ quy định kích thước hành lý của hãng hàng không, nếu không sẽ
                            phải trả thêm phí hoặc bị từ chối lên máy bay.
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mt-2 flex items-center gap-2">
                          <img src={icon2} alt="icon" className="w-5 h-5" />
                          <h3 className="text-base text-textColor font-semibold">Yêu cầu Visa</h3>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Hộ chiếu còn hạn ít nhất 6 tháng từ ngày khởi hành.
                          </span>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Xuất trình bản sao cứng của visa nước ngoài tại quầy nhập cảnh.
                          </span>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Booking. không chịu trách nhiệm về thông tin visa. Kiểm tra chi tiết
                            trước khi đặt vé.
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mt-2 flex items-center gap-2">
                          <img src={icon2} alt="icon" className="w-5 h-5" />
                          <h3 className="text-base text-textColor font-semibold">
                            Lưu ý về nguyên tắc
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="h-1 w-1 rounded-full bg-textColor"></div>
                          <span className="text-sm text-gray-600 w-full  max-w-[900px]">
                            Du khách tự chịu trách nhiệm đảm bảo đủ điều kiện nhập cảnh/quá cảnh.
                            Kiểm tra quy định du lịch trước khi đặt vé và bắt đầu hành trình.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

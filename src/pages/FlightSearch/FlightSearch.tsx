/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from "react-helmet-async"
import iconFlight from "../../img/svg/flight-svgrepo-com.svg"
import { Button as ButtonShadcn } from "src/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "src/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/popover"
import { useEffect, useMemo, useRef, useState } from "react"
import { airportCodes, travelClassList, typeFlightList } from "src/constant/flightSearch"
import {
  ResponseFlightList,
  AirportCodeList,
  FlightOfferParamsConfig
} from "src/types/flight.type.ts"
import { Controller, useForm } from "react-hook-form"
import Button from "src/components/Button/Button.tsx"
import { convertToYYYYMMDD, getCodeAirport, getCountry } from "src/utils/utils.ts"
import InputSearch from "src/components/InputSearch/InputSearch"
import QuantityController from "src/components/QuantityController"
import SelectDate from "src/components/SelectDate"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { flightApi } from "src/apis/flight.api"
import FlightItem from "./components/FlightItem"
import { InputAirport, InputController, schemaFormData } from "../Flight/Flight"
import useQueryConfig from "src/hooks/useQueryConfig"
import { createSearchParams, Link, useLocation, useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { schemaType } from "src/utils/rules"
import { path } from "src/constant/path"
import { omit } from "lodash"
import AsideFilterFlight from "./components/AsideFilterFlight"
import Pagination from "src/components/Pagination"
import banner from "src/img/Flight/ticker-banner-flight.webp"
import banner2 from "src/img/Flight/air-ticket-booking.webp"
import banner3 from "src/img/Flight/travel-design-template.webp"
import backGround from "src/img/FlightOrder/banner.webp"
import useScrollHeader from "src/hooks/useScrollHeader"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "src/components/ui/sheet"

const fetchDataAirport = () => Promise.resolve(airportCodes) // khởi tạo 1 promise

export type FormData = Pick<
  schemaType,
  | "originLocationCode"
  | "destinationLocationCode"
  | "departureDate"
  | "returnDate"
  | "travelClass"
  | "adults"
  | "children"
  | "infants"
  | "flightType"
>

/**
 * Flow hoạt động giữa Flight & FlightSearch
 * Flight submitForm đi -> navigate tới FlightSearch kèm (các parameter)
 * - sau đó dùng useSearchParams lấy các parameter trên Url xuống truyền vô queryConfig (gồm các params)
 * - truyền các params vào defaultValue (giá trị mặc định cho Form)
 * - tiếp tục useEffect 1 lần các state đã lưu ra input
 * - truyền queryConfig vào api để fetch
 *
 * Thao tác thực hiện navigate -> cập nhật ...queryConfig -> fetch lại api -> render ra list mới
 */

// flow: Tìm chuyến bay ở Flight -> navigate tới FlightSearch (render list chuyến bay) -> chọn chuyến bay thích hợp (item of list chuyến bay) -> navigate tới FlightCreateOrder

export default function FlightSearch() {
  // xử lý header
  const { showHeader } = useScrollHeader(200)
  // xử lý form
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [airportCodeList, setAirportCodeList] = useState<AirportCodeList>([])
  const [showListAirport, setShowListAirport] = useState<boolean>(false)
  const [showListAirport2, setShowListAirport2] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputRef2 = useRef<HTMLInputElement>(null)

  // quản lý state lưu trữ của form
  const [searchText, setSearchText] = useState<string>("") // mã airport xuất phát
  const [searchText2, setSearchText2] = useState<string>("") // mã airport đích
  const [date, setDate] = useState<Date | null>(null) // ngày đi
  const [date2, setDate2] = useState<Date | null>(null) // ngày về
  const [travelClass, setTravelClass] = useState<string>("") // hạng vé
  const [numberAdults, setNumberAdults] = useState<number>(0) // HK người lớn
  const [numberChildren, setNumberChildren] = useState<number>(0) // HK trẻ em
  const [numberInfants, setNumberInfants] = useState<number>(0) // HK em bé

  const [flightType, setFlightType] = useState("oneWay")
  const [showPassenger, setShowPassenger] = useState(0)
  const location = useLocation()
  const { state } = location

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      adults: Number(queryConfig.adults),
      children: Number(queryConfig.children),
      infants: Number(queryConfig.infants),
      originLocationCode: queryConfig.originLocationCode,
      destinationLocationCode: queryConfig.destinationLocationCode,
      travelClass: queryConfig.travelClass,
      departureDate: queryConfig.departureDate,
      returnDate: queryConfig.returnDate
    },
    resolver: yupResolver(schemaFormData)
  })

  useEffect(() => {
    if (state) {
      setSearchText(state.originLocationCode)
      setSearchText2(state.destinationLocationCode)
      setDate(state.departureDate)
      setDate2(state.returnDate)
      setTravelClass(state.travelClass)
      setNumberAdults(Number(state.adults))
      setNumberChildren(Number(state.children))
      setNumberInfants(Number(state.infants))
      setFlightType(state.flightType as string)
      setShowPassenger(Number(state.adults) + Number(state.children) + Number(state.infants))
    }
  }, [state])

  useEffect(() => {
    fetchDataAirport().then((res) => {
      setAirportCodeList(res)
    })
  }, [])

  useEffect(() => {
    const clickOutHideListAirport = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        // nơi được click nằm ngoài vùng phần tử
        setShowListAirport(false)
      }
      if (inputRef2.current && !inputRef2.current.contains(event.target as Node)) {
        setShowListAirport2(false)
      }
    }

    document.addEventListener("mousedown", clickOutHideListAirport)

    return () => document.removeEventListener("mousedown", clickOutHideListAirport)
  }, [])

  //`useCallback()`: khi cta không muốn function của cta được khởi tạo lại mỗi lần component chúng ta re-render - nếu có thay đổi nó mới chạy lại - re-render
  //`useMemo()`: tương tự, khi chúng ta muốn một biến không bị làm mới lại mỗi lần component re-render. - nếu có thay đổi nó mới chạy lại - re-render
  const filterAirportCodeList_1 = useMemo(
    () =>
      airportCodeList.filter((item) =>
        item.country.toLowerCase().includes(searchText.toLowerCase())
      ),
    [searchText, airportCodeList]
  )

  const filterAirportCodeList_2 = useMemo(
    () =>
      airportCodeList.filter((item) =>
        item.country.toLowerCase().includes(searchText2.toLowerCase())
      ),
    [searchText2, airportCodeList]
  ) // lọc các item dựa vào searchText (input)
  // includes: hàm check bao gồm

  const handleItemClick = (inputName: InputAirport, value: string) => {
    setValue(inputName, getCodeAirport(value) as string) // đảm bảo giá trị của input được quản lý bởi react-hook-form // // cập nhật giá trị của một trường dữ liệu
    if (inputName === "originLocationCode") {
      setSearchText(getCodeAirport(value) as string) // nếu dùng mỗi thằng này thì nó ko dc quản lý bởi useForm // luôn ""
      setShowListAirport(false)
    } else if (inputName === "destinationLocationCode") {
      setSearchText2(getCodeAirport(value) as string)
      setShowListAirport2(false)
    }
  }

  const handleChangeQuantity = (nameQuantity: InputController) => (value: number) => {
    setValue(nameQuantity, value) // đảm bảo giá trị của input được quản lý bởi react-hook-form // // cập nhật giá trị của một trường dữ liệu
    if (nameQuantity === "adults") {
      setNumberAdults(value)
    } else if (nameQuantity === "children") {
      setNumberChildren(value)
    } else if (nameQuantity === "infants") {
      setNumberInfants(value)
    }
  }

  useEffect(() => {
    setShowPassenger(numberChildren + numberInfants + numberAdults)
  }, [numberChildren, numberInfants, numberAdults])

  const exchangeTwoValues = () => {
    setSearchText(searchText2)
    setSearchText2(searchText)
    setValue("originLocationCode", searchText2)
    setValue("destinationLocationCode", searchText) // cập nhật trường dữ liệu trước khi submit form
    // chỗ này type button // thực hiện click
  }

  const flightOffersSearchQuery = useQuery({
    queryKey: ["flightSearchList", queryConfig],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 30000) // hết 10s mà chưa fetch ra api nó tự động hủy // kiểu tự động
      return flightApi.flightOfferSearchGet(
        queryConfig as FlightOfferParamsConfig,
        controller.signal
      )
    },
    retry: 1, // số lần fetch lại khi thất bại
    placeholderData: keepPreviousData, // giữ data cũ
    staleTime: 5 * 60 * 1000 // dưới 5 phút không refetch
  })

  const flightList = flightOffersSearchQuery?.data?.data as ResponseFlightList

  // xử lý navigate form
  const handleSubmitSearch = handleSubmit((data) => {
    // nếu chuyến bay roundTrip -> có returnDate
    // ngược lại oneWay -> không có returnDate -> loại bỏ đi (omit)
    // do clone lại tất cả ...queryConfig nên nó sẽ dính input cũ trước đó (returnDate) cần dùng omit loại đi -> submit
    const config =
      flightType === "roundTrip"
        ? {
            ...queryConfig,
            originLocationCode: data.originLocationCode,
            destinationLocationCode: data.destinationLocationCode,
            departureDate: data.departureDate,
            returnDate: data.returnDate as string,
            adults: String(data.adults),
            children: String(data.children),
            infants: String(data.infants),
            travelClass: data.travelClass
          }
        : omit(
            {
              ...queryConfig,
              originLocationCode: data.originLocationCode,
              destinationLocationCode: data.destinationLocationCode,
              departureDate: data.departureDate,
              adults: String(data.adults),
              children: String(data.children),
              infants: String(data.infants),
              travelClass: data.travelClass
            },
            ["returnDate"]
          )

    navigate({
      pathname: path.flightSearch,
      search: createSearchParams(config).toString()
    }) // navigate đi -> cập nhật ...queryConfig -> fetch lại api -> render ra list mới
  })

  const [currentPage, setCurrentPage] = useState(1)
  const totalItem = 10
  const startIndex = (currentPage - 1) * totalItem
  const endIndex = startIndex + totalItem
  const currentList = flightList?.data.slice(startIndex, endIndex)

  const handleChangePage = (numberPage: number) => {
    setCurrentPage(numberPage)
  }

  return (
    <div>
      <Helmet>
        <title>Tìm kiếm chuyến bay</title>
        <meta name="description" content="Tìm kiếm chuyến bay - Booking." />
      </Helmet>

      <div
        className="relative z-10 h-[650px]"
        style={{
          backgroundImage: `url(${backGround})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
      >
        <div
          className={`w-full bg-whiteColor ${showHeader ? "md:fixed md:top-0 md:left-1/2 md:-translate-x-1/2 shadow-xl" : "md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2"} z-50 transition-all ease-linear duration-1000`}
        >
          <div className="container">
            <form
              autoComplete="off"
              onSubmit={handleSubmitSearch}
              noValidate
              className="grid grid-cols-6 lg:grid-cols-12 items-center gap-2 flex-wrap py-2"
            >
              {/* loại chuyến bay */}
              <div className="col-span-6 md:col-span-1 lg:col-span-1 px-2 py-[14px] bg-gray-300 rounded-md relative">
                <Popover open={open2} onOpenChange={setOpen2}>
                  <PopoverTrigger asChild>
                    <ButtonShadcn
                      variant="outline"
                      role="combobox"
                      aria-expanded={open2}
                      aria-label="FlightType"
                      className="flex justify-center bg-transparent border-none shadow-none text-base text-center truncate w-full hover:bg-transparent"
                    >
                      {flightType
                        ? typeFlightList.find((item) => item.value === flightType)?.text
                        : "Loại bay"}
                    </ButtonShadcn>
                  </PopoverTrigger>
                  <PopoverContent className="w-[100px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {typeFlightList.map((item, index) => (
                            <Controller
                              key={index}
                              control={control}
                              name="flightType" // tên trường dữ liệu
                              render={({ field }) => (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue) // quản lý và cập nhật trường dữ liệu
                                    setOpen2(false)
                                    setFlightType(currentValue)
                                  }}
                                >
                                  {item.text}
                                </CommandItem>
                              )}
                            />
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="col-span-6 md:col-span-3 lg:col-span-4">
                <div className="grid grid-cols-4 relative items-center gap-2">
                  {/* điểm xuất phát */}
                  <InputSearch
                    placeholder="Bay từ"
                    classNameList={`z-50 absolute top-16 left-0 w-full ${showListAirport ? "h-[300px]" : "h-0"} bg-whiteColor overflow-y-auto overflow-x-auto rounded-sm shadow-sm transition-all duration-200 ease-linear`}
                    classNameBlock="py-2 px-2 rounded-md flex items-center bg-gray-300 text-textColor"
                    classNameError="py-2 px-3 border border-red-500 bg-red-100 rounded-md flex items-center"
                    classNameInput="px-2 outline-none bg-transparent text-xl flex-grow font-semibold w-[120px] truncate"
                    ref={inputRef}
                    filterList={filterAirportCodeList_1}
                    value={searchText}
                    showList={showListAirport}
                    handleItemClick={handleItemClick}
                    inputName="originLocationCode"
                    handleChangeValue={(event) => setSearchText(event.target.value)}
                    handleFocus={() => setShowListAirport(true)}
                    register={register}
                    name="originLocationCode"
                    error={errors.originLocationCode?.message}
                    desc="Từ"
                    classNameDesc="pl-2 text-textColor"
                  >
                    <img src={iconFlight} alt="icon flight" className="w-10 h-10 flex-shrink-0" />
                  </InputSearch>
                  {/* điểm đến */}
                  <InputSearch
                    placeholder="Bay đến"
                    classNameList={`z-50 absolute top-16 left-0 w-full ${showListAirport2 ? "h-[300px]" : "h-0"} bg-whiteColor overflow-y-auto overflow-x-auto rounded-sm shadow-sm transition-all duration-200 ease-linear`}
                    classNameBlock="py-2 px-2 rounded-md flex items-center bg-gray-300 text-textColor"
                    classNameError="py-2 px-3 border border-red-500 bg-red-100 rounded-md flex items-center"
                    classNameInput="px-2 outline-none bg-transparent text-xl flex-grow font-semibold w-[120px] truncate"
                    ref={inputRef2}
                    filterList={filterAirportCodeList_2}
                    value={searchText2}
                    showList={showListAirport2}
                    handleItemClick={handleItemClick}
                    inputName="destinationLocationCode"
                    handleChangeValue={(event) => setSearchText2(event.target.value)}
                    handleFocus={() => setShowListAirport2(true)}
                    register={register}
                    name="destinationLocationCode"
                    error={errors.destinationLocationCode?.message}
                    desc="Đến"
                    classNameDesc="pl-2 text-textColor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a4 3 4 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </InputSearch>

                  {/* đổi 2 giá trị với nhau */}
                  <button
                    aria-label="buttonChangeValue"
                    type="button"
                    onClick={exchangeTwoValues}
                    className="z-20 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-blueColor border-2 border-blueColor bg-blue-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="col-span-6 md:col-span-2 lg:col-span-3">
                <div className="flex justify-between items-center gap-2">
                  {/* Khứ hồi hoặc 1 chiều */}
                  <div className="w-full flex items-center gap-2">
                    {/* date ngày đi*/}
                    <div className={flightType === "roundTrip" ? "w-[50%]" : "w-[100%]"}>
                      <SelectDate
                        text="Ngày đi"
                        control={control}
                        setDate={setDate}
                        date={date}
                        name="departureDate"
                        errors={errors.departureDate?.message as string}
                        convertToYYYYMMDD={convertToYYYYMMDD}
                        className="py-[14px] bg-gray-300 rounded-md flex items-center w-full justify-center"
                        classNameError="py-[14px] border border-red-500 bg-red-100 rounded-md flex items-center w-full justify-center"
                      />
                    </div>

                    {/* date ngày về */}
                    <div className={flightType === "roundTrip" ? "w-[50%]" : "hidden w-[0%]"}>
                      <SelectDate
                        text="Ngày về"
                        control={control}
                        setDate={setDate2}
                        date={date2}
                        name="returnDate"
                        errors={errors.returnDate?.message as string}
                        convertToYYYYMMDD={convertToYYYYMMDD}
                        className="py-[14px] bg-gray-300 rounded-md flex items-center w-full justify-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-6 md:col-span-3 lg:col-span-3">
                <div className="flex gap-2">
                  {/* hành khách */}
                  <div
                    className={`w-[50%] rounded-md flex items-center justify-center ${showPassenger === 0 ? "border-red-500 bg-red-100 border" : "bg-gray-300"}`}
                  >
                    <Popover>
                      <PopoverTrigger>
                        <div className="w-full flex flex-col items-center">
                          <div className="flex items-center cursor-pointer">
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
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                              />
                            </svg>

                            <input
                              aria-label="Traveler"
                              type="text"
                              className="w-[30px] py-1 outline-none bg-transparent text-base text-center"
                              value={showPassenger}
                              readOnly
                            />

                            <span className="text-base text-textColor font-semibold">Khách</span>

                            {showPassenger === 0 && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="red"
                                className="ml-1 h-5 w-5 flex-shrink-0"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="p-1 text-textColor text-sm mb-2 bg-[#fedda7]">
                          <strong className="text-red-500">Lưu ý: </strong>Số lượng vé em bé sơ sinh
                          không được vượt quá số lượng vé người lớn.
                        </div>
                        <div>
                          <QuantityController
                            nameQuantity="Người lớn (12 tuổi trở lên)"
                            value={numberAdults}
                            onValueInput={handleChangeQuantity("adults")}
                            onIncrease={handleChangeQuantity("adults")}
                            onDecrease={handleChangeQuantity("adults")}
                            register={register} // đăng ký trường dữ liệu để quản lý
                            name="adults"
                          />
                        </div>
                        <div className="mt-2">
                          <QuantityController
                            nameQuantity="Trẻ em (Từ 2 - 12 tuổi)"
                            value={numberChildren}
                            onValueInput={handleChangeQuantity("children")}
                            onIncrease={handleChangeQuantity("children")}
                            onDecrease={handleChangeQuantity("children")}
                            register={register} // đăng ký trường dữ liệu để quản lý
                            name="children"
                          />
                        </div>
                        <div className="mt-2">
                          <QuantityController
                            nameQuantity="Em bé (Dưới 2 tuổi)"
                            value={numberInfants}
                            onValueInput={handleChangeQuantity("infants")}
                            onIncrease={handleChangeQuantity("infants")}
                            onDecrease={handleChangeQuantity("infants")}
                            register={register} // đăng ký trường dữ liệu để quản lý
                            name="infants"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* hạng vé */}
                  <div
                    className={`w-[50%] py-[14px] rounded-md relative ${errors.travelClass?.message ? "bg-red-100 border-red-500 border" : "bg-gray-300"}`}
                  >
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <ButtonShadcn
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          aria-label="TravelClass"
                          className="flex justify-center items-center bg-transparent border-none shadow-none text-sm hover:bg-transparent w-full truncate"
                        >
                          {travelClass
                            ? travelClassList.find((item) => item.value === travelClass)?.value
                            : "Chọn hạng vé"}
                          {errors.travelClass?.message && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="red"
                              className="ml-1 h-6 w-6 flex-shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                              />
                            </svg>
                          )}
                        </ButtonShadcn>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {travelClassList.map((item, index) => (
                                <Controller
                                  key={index}
                                  control={control}
                                  name="travelClass" // tên trường dữ liệu
                                  render={({ field }) => (
                                    <CommandItem
                                      key={item.value}
                                      value={item.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue) // quản lý và cập nhật trường dữ liệu
                                        setOpen(false)
                                        setTravelClass(currentValue)
                                      }}
                                    >
                                      {item.value}
                                    </CommandItem>
                                  )}
                                />
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="col-span-6 md:col-span-3 lg:col-span-1">
                <Button
                  disable={flightOffersSearchQuery.isPending}
                  classNameWrapper="w-full flex-1 relative"
                  type="submit"
                  nameButton="Tìm kiếm"
                  className="px-8 py-[20px] lg:py-[8px] bg-blueColor w-full text-whiteColor text-base rounded-md hover:bg-blueColor/80 duration-200 font-semibold border-blueColor"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="z-30 w-full absolute top-[410px] md:top-32 lg:top-16 left-1/2 -translate-x-1/2">
          <div className="container">
            {/* không load thì isPending */}
            {!flightOffersSearchQuery.isFetching && (
              <div>
                {currentList?.length > 0 && (
                  <div className="py-8 grid grid-cols-12 gap-4">
                    <div className="hidden lg:block lg:col-span-3">
                      <AsideFilterFlight queryConfig={queryConfig} />

                      <div className="my-6 w-full">
                        <img src={banner} alt="banner" className="w-full h-full object-cover" />
                      </div>
                      <div className="my-6 w-full">
                        <img src={banner2} alt="banner" className="w-full h-full object-cover" />
                      </div>
                      <div className="my-6 w-full">
                        <img src={banner3} alt="banner" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-9">
                      <div className="flex items-center gap-2 lg:gap-0 mb-2">
                        <Sheet>
                          <SheetTrigger>
                            <div className="md:block lg:hidden p-2 bg-blueColor rounded-xl">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="white"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                                />
                              </svg>
                            </div>
                          </SheetTrigger>
                          <SheetContent className="p-0" side="left">
                            <SheetHeader>
                              <SheetTitle className="mt-10">
                                <AsideFilterFlight queryConfig={queryConfig} />
                              </SheetTitle>
                            </SheetHeader>
                          </SheetContent>
                        </Sheet>

                        <h1 className="text-lg lg:text-2xl text-textColor font-semibold ">
                          Chuyến bay từ
                          {"  "}
                          {getCountry(airportCodes, searchText)}
                          {" - "}
                          {searchText} đến
                          {"  "}
                          {getCountry(airportCodes, searchText2)}
                          {" - "}
                          {searchText2}
                        </h1>
                      </div>

                      {currentList.map((item) => (
                        <div key={item.id}>
                          <FlightItem item={item} list={flightList} />
                        </div>
                      ))}

                      <div className="my-4">
                        <Pagination
                          totalOfPage={totalItem}
                          totalAllPage={flightList.data.length}
                          currentPage={currentPage}
                          onChangePage={handleChangePage}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentList?.length === 0 && (
                  <div className="py-8 my-16 text-center flex flex-col items-center">
                    <span className="text-2xl text-textColor font-semibold">
                      Không tìm thấy chuyến bay. Quý khách vui lòng lựa chọn lại!!!
                    </span>
                    <Link
                      to={path.flight}
                      className="mt-4 shadow flex items-center justify-center w-[120px] px-3 py-4 bg-blueColor text-whiteColor duration-200 hover:bg-blueColor/80"
                    >
                      Thử lại
                    </Link>
                  </div>
                )}
              </div>
            )}

            {flightOffersSearchQuery.isFetching && (
              <div
                role="status"
                className="py-8 flex items-center justify-center animate-pulse mx-auto"
              >
                <button
                  disabled
                  type="button"
                  className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 rounded-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-5 h-5 me-3 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Đang tìm chuyến bay...
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

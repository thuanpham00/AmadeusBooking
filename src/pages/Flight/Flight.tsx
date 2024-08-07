import { Helmet } from "react-helmet-async"
import bg1 from "../../img/Flight/bg1.webp"
import coVN from "../../img/lauguage/coVN.webp"
import coMy from "../../img/lauguage/coMy.webp"
import banner1 from "../../img/Flight/banner1.webp"
import banner2 from "../../img/Flight/banner2.webp"
import banner3 from "../../img/Flight/banner3.webp"
import logo from "../../img/favicon/FaviconFlight.webp"
import paymentImg from "../../img/Home/payment/pm1.jpg"
import hotel from "../../img/svg/hotel-1-svgrepo-com.svg"
import iconFlight from "../../img/svg/flight-svgrepo-com.svg"
import ticketBanner from "src/img/Flight/air-ticket-offer.webp"
import ticketBanner2 from "src/img/Flight/air-ticket-offer_2.webp"
import bannerFlight from "src/img/Flight/vja330-1685604407424.webp"
import bannerFlight2 from "src/img/Flight/thumb-website-Vi-VNPAY-1280x720.webp"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import schema, { schemaType } from "src/utils/rules"
import { airportCodes, bannerAirLineList, travelClassList } from "src/constant/flightSearch"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { convertToYYYYMMDD, getNameFromEmail } from "src/utils/utils"
import { AirportCodeList } from "src/types/flight.type"
import InputSearch from "src/components/InputSearch"
import SelectDate from "src/components/SelectDate"
import { Popover as PopoverShadcn, PopoverContent, PopoverTrigger } from "src/components/ui/popover"
import QuantityController from "src/components/QuantityController"
import { Button as ButtonShadcn } from "src/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "src/components/ui/command"
import Button from "src/components/Button"
import { createSearchParams, Link, useNavigate } from "react-router-dom"
import { AppContext } from "src/context/useContext"
import { clearLS } from "src/utils/auth"
import Popover from "src/components/Popover"
import { path } from "src/constant/path"
import useQueryConfig from "src/hooks/useQueryConfig"
import Skeleton from "src/components/Skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "src/components/ui/sheet"
import useFormHandler from "src/hooks/useFormHandler"

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
>

export const schemaFormData = schema.pick([
  "originLocationCode",
  "destinationLocationCode",
  "departureDate",
  "returnDate",
  "travelClass",
  "adults"
])

export type InputAirport = "originLocationCode" | "destinationLocationCode"
export type InputController = "adults" | "children" | "infants"
const fetchDataAirport = () => Promise.resolve(airportCodes) // khởi tạo 1 promise

// Dùng thêm state cục bộ để quản lý dữ liệu input kết hợp với useForm sử dụng setValue để quản lý dữ liệu trước khi submit đi
// nếu không dùng state cục bộ thì không thể truyền props xuống các component con
// vì thường các trường dữ liệu của input chỉ quản lý trong component đó (validate...) submit đi

// onClick vào ô input thì nó re-render vì
// nó thực hiện onClick={handleFocus} và handleFocus nhân vào 1 hàm xử lý set state lại dẫn đến component re-render

// component chỉ re-render khi props hoặc state thay đổi

export default function Flight() {
  const { isAuthenticated, setIsAuthenticated, isProfile, setIsProfile, listCart } =
    useContext(AppContext)

  // xử lý loading
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])

  // xử lý header
  const handleLogOut = () => {
    clearLS()
    setIsAuthenticated(false)
    setIsProfile(null)
  }

  // xử lý form
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schemaFormData)
  })

  const [open, setOpen] = useState(false)
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
  // nâng cao
  const { filterList: filterAirportCodeList_1, handleItemClick } = useFormHandler(
    airportCodeList,
    searchText,
    setValue,
    setSearchText,
    setShowListAirport
  )

  const { filterList: filterAirportCodeList_2, handleItemClick: handleItemClick2 } = useFormHandler(
    airportCodeList,
    searchText2,
    setValue,
    setSearchText2,
    setShowListAirport2
  )

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
    setShowPassenger(numberAdults + numberChildren + numberInfants)
  }, [numberAdults, numberChildren, numberInfants])

  const exchangeTwoValues = () => {
    setSearchText(searchText2)
    setSearchText2(searchText)
    setValue("originLocationCode", searchText2)
    setValue("destinationLocationCode", searchText) // cập nhật trường dữ liệu trước khi submit form
    // chỗ này type button // thực hiện click
  }

  const createConfig = (data: FormData) => {
    const baseConfig = {
      ...queryConfig,
      originLocationCode: data.originLocationCode,
      destinationLocationCode: data.destinationLocationCode,
      departureDate: data.departureDate,
      adults: String(data.adults),
      children: String(data.children),
      infants: String(data.infants),
      travelClass: data.travelClass
    }
    if (data.returnDate) {
      return {
        ...baseConfig,
        returnDate: data.returnDate
      }
    }
    return baseConfig
  }

  const handleSubmitSearch = handleSubmit((data) => {
    // truyền các data mà form quản lý vào biến này để submit gọi api

    const config = createConfig(data)
    const state = {
      ...config,
      flightType,
      returnDate: data.returnDate || null
    }
    navigate(
      {
        pathname: path.flightSearch,
        search: createSearchParams(config).toString()
      },
      {
        state
      }
    )
  })

  return (
    // khắc phục lệch layout
    <div className="h-[3180px] md:h-[2600px] bg-[#fff]">
      {loading ? (
        <Skeleton className="flex flex-col justify-center items-center absolute left-1/2 top-[10%] -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <Fragment>
          <Helmet>
            <title>Chuyến bay</title>
            <meta name="description" content="Chuyến bay - Booking." />
          </Helmet>

          <div className="w-full h-[600px]">
            <div
              className=" w-full h-full"
              style={{
                backgroundImage: `url(${bg1})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
              }}
            >
              <div className="bg-transparent py-3">
                <div className="container">
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="hidden md:block w-10 h-10">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xl text-whiteColor font-semibold">Booking.</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Popover
                        className="sticky top-0 left-0 z-30"
                        renderPopover={
                          <div className="shadow-lg flex flex-col">
                            <button className="text-sm flex items-center gap-2 text-left min-w-[120px] p-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200 border border-gray-300">
                              <img
                                src={coVN}
                                alt="Cờ Việt Nam"
                                className="h-6 w-6 object-contain"
                              />
                              Vietnamese
                            </button>

                            <button className="text-sm flex items-center gap-2 text-left min-w-[120px] p-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200">
                              <img src={coMy} alt="Cờ Mỹ" className="h-6 w-6 object-contain" />
                              English
                            </button>
                          </div>
                        }
                      >
                        <div className="hidden md:flex gap-1 items-center px-2 text-whiteColor rounded-sm text-sm duration-200 hover:text-gray-300">
                          <img src={coVN} alt="Cờ Việt Nam" className="h-5 w-5 object-contain" />
                          Ngôn ngữ
                        </div>
                      </Popover>

                      <Link to={path.cart} className="relative">
                        <span className="absolute left-4 -top-2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px]">
                          {listCart.length}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                          />
                        </svg>
                      </Link>

                      <div className="block md:hidden">
                        <Sheet>
                          <SheetTrigger>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="white"
                              className="mt-1 h-8 w-8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                              />
                            </svg>
                          </SheetTrigger>
                          <SheetContent className="p-0">
                            <SheetHeader>
                              <SheetTitle className="mt-10">
                                {isAuthenticated && (
                                  <div className="py-[2px] px-3 rounded-sm duration-200 hover:bg-[#ddd]/20 flex items-center gap-1 text-textColor font-medium text-base">
                                    Xin chào, {getNameFromEmail(isProfile as string)}
                                  </div>
                                )}
                                {!isAuthenticated && (
                                  <div className="px-3 w-full flex items-center gap-1">
                                    <Link
                                      to={path.register}
                                      className="w-[50%] py-2 px-3 duration-200 hover:text-[#ddd]/80 rounded-sm text-sm text-textColor border border-gray-300"
                                    >
                                      Đăng ký
                                    </Link>
                                    <Link
                                      to={path.login}
                                      className="w-[50%] py-2 px-3 border-2 border-blueColor bg-blueColor duration-200 hover:bg-blueColor/80 hover:border-blueColor/80 rounded-sm text-sm text-whiteColor hover:text-[#ddd]/80 "
                                    >
                                      Đăng nhập
                                    </Link>
                                  </div>
                                )}
                              </SheetTitle>
                              <div className="w-full h-[1px] bg-gray-300"></div>
                            </SheetHeader>
                          </SheetContent>
                        </Sheet>
                      </div>

                      {isAuthenticated && (
                        <Popover
                          className="sticky top-0 left-0 z-30"
                          renderPopover={
                            <div className="shadow-lg flex flex-col">
                              <button className="text-sm text-left min-w-[120px] px-4 py-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200 border border-gray-300">
                                Tài khoản của tôi
                              </button>

                              <button
                                onClick={handleLogOut}
                                className="text-sm text-left min-w-[120px] px-4 py-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200 flex items-center gap-2 border border-gray-300 border-t-0"
                              >
                                Đăng xuất
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
                                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                                  />
                                </svg>
                              </button>
                            </div>
                          }
                        >
                          <div className="hidden py-[6px] px-3 border-2 rounded-sm duration-200 hover:bg-[#ddd]/20 md:flex items-center gap-1 text-whiteColor font-medium text-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>

                            {getNameFromEmail(isProfile as string)}
                          </div>
                        </Popover>
                      )}

                      {!isAuthenticated && (
                        <div className="hidden md:flex items-center gap-1">
                          <Link
                            to={path.register}
                            className="py-2 px-3 duration-200 hover:text-[#ddd]/80 rounded-sm text-sm text-whiteColor"
                          >
                            Đăng ký
                          </Link>
                          <Link
                            to={path.login}
                            className="py-2 px-3 border-2 border-blueColor bg-blueColor duration-200 hover:bg-blueColor/80 hover:border-blueColor/80 rounded-sm text-sm text-whiteColor hover:text-[#ddd]/80 "
                          >
                            Đăng nhập
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <h1 className="hidden md:block text-whiteColor md:text-2xl lg:text-4xl font-semibold text-center my-2 lg:my-8">
                    Từ Đông Nam Á Đến Thế Giới, Trong Tầm Tay Bạn.
                  </h1>

                  <div className="mt-8 md:mt-0 relative z-20 mx-auto w-full md:w-[55%]">
                    <div className="py-4 px-8 bg-whiteColor rounded-lg shadow-lg">
                      <nav className="flex items-center gap-4">
                        <Link to={path.flight} className="flex flex-col items-center">
                          <div className="w-8 h-8">
                            <img src={iconFlight} alt="icon" className="w-full h-full" />
                          </div>
                          <span className="mt-1 text-sm font-semibold text-blueColor">
                            Chuyến bay
                          </span>
                        </Link>
                        <Link to={path.flight} className="flex flex-col items-center">
                          <div className="w-8 h-8">
                            <img src={hotel} alt="icon" className="w-full h-full" />
                          </div>
                          <span className="mt-1 text-sm font-normal text-textColor">Khách sạn</span>
                        </Link>
                      </nav>
                    </div>
                  </div>

                  <div className="mt-4 md:-mt-8 mx-auto w-full md:w-[90%]">
                    <form
                      autoComplete="off"
                      onSubmit={handleSubmitSearch}
                      noValidate
                      className="p-4 md:p-8 md:pt-12 bg-whiteColor rounded-lg shadow-md"
                    >
                      {/* loại chuyến bay */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="flight"
                            id="oneWay"
                            checked={flightType === "oneWay"}
                            onChange={(event) => setFlightType(event.target.id)}
                            className="w-5 h-5"
                          />
                          <label
                            htmlFor="oneWay"
                            className="text-base text-textColor font-semibold"
                          >
                            Một chiều
                          </label>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="flight"
                            id="roundTrip"
                            checked={flightType === "roundTrip"}
                            onChange={(event) => setFlightType(event.target.id)}
                            className="w-5 h-5"
                          />
                          <label
                            htmlFor="roundTrip"
                            className="text-base text-textColor font-semibold"
                          >
                            Khứ hồi
                          </label>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-4 relative gap-2 flex-wrap">
                        {/* điểm xuất phát */}
                        <InputSearch
                          placeholder="Bay từ"
                          classNameList={`z-20 absolute top-20 left-0 w-full ${showListAirport ? "h-[300px]" : "h-0"} bg-whiteColor overflow-y-auto overflow-x-hidden rounded-sm shadow-sm transition-all duration-200 ease-linear`}
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
                        >
                          <img
                            src={iconFlight}
                            alt="icon flight"
                            className="w-10 h-10 flex-shrink-0"
                          />
                        </InputSearch>
                        {/* điểm đến */}

                        <InputSearch
                          placeholder="Bay đến"
                          classNameList={`z-20 absolute top-20 left-0 w-full ${showListAirport2 ? "h-[300px]" : "h-0"} bg-whiteColor overflow-y-auto overflow-x-hidden rounded-sm shadow-sm transition-all duration-200 ease-linear`}
                          ref={inputRef2}
                          filterList={filterAirportCodeList_2}
                          value={searchText2}
                          showList={showListAirport2}
                          handleItemClick={handleItemClick2}
                          inputName="destinationLocationCode"
                          handleChangeValue={(event) => setSearchText2(event.target.value)}
                          handleFocus={() => setShowListAirport2(true)}
                          register={register}
                          name="destinationLocationCode"
                          error={errors.destinationLocationCode?.message}
                          desc="Đến"
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
                          className="z-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-blueColor border-2 border-blueColor bg-blue-100"
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

                      <div className="mt-2 md:mt-4 grid grid-cols-4 items-center gap-2 md:gap-x-2 md:gap-y-4">
                        <div className="col-span-4 lg:col-span-2">
                          <div className="flex items-center justify-between gap-2">
                            {/* Khứ hồi hoặc 1 chiều */}
                            <div
                              className={
                                flightType === "roundTrip"
                                  ? "w-[70%] flex justify-start gap-1 md:gap-2"
                                  : "w-[70%] flex justify-start"
                              }
                            >
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
                                />
                              </div>

                              {/* date ngày về */}
                              <div
                                className={flightType === "roundTrip" ? "w-[50%]" : "hidden w-[0%]"}
                              >
                                <SelectDate
                                  text="Ngày về"
                                  control={control}
                                  setDate={setDate2}
                                  date={date2}
                                  name="returnDate"
                                  errors={errors.returnDate?.message as string}
                                  convertToYYYYMMDD={convertToYYYYMMDD}
                                />
                              </div>
                            </div>

                            {/* hành khách */}
                            <div
                              className={`w-[30%] py-3 border-2 rounded-md flex items-center justify-center ${errors.adults?.message ? "border-red-500 bg-red-100" : "border-gray-300"}`}
                            >
                              <PopoverShadcn>
                                <PopoverTrigger>
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
                                      className="w-[25px] py-1 outline-none bg-transparent text-base text-center"
                                      value={showPassenger}
                                      readOnly
                                    />

                                    <span className="text-base text-textColor font-semibold">
                                      Khách
                                    </span>

                                    {errors.adults?.message && (
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
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <div className="p-1 text-textColor text-sm mb-2 bg-[#fedda7]">
                                    <strong className="text-red-500">Lưu ý: </strong>Số lượng vé em
                                    bé sơ sinh không được vượt quá số lượng vé người lớn.
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
                              </PopoverShadcn>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-4 lg:col-span-2">
                          <div className="flex items-center justify-between gap-2">
                            {/* hạng vé */}
                            <div
                              className={`w-[50%] px-8 py-[10px] border-2 rounded-md relative> ${errors.travelClass?.message ? "border-red-500 bg-red-100" : "border-gray-300"}`}
                            >
                              <PopoverShadcn open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                  <ButtonShadcn
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    aria-label="TravelClass"
                                    className="w-full flex justify-center bg-transparent border-none shadow-none text-base text-center hover:bg-transparent"
                                  >
                                    {travelClass
                                      ? travelClassList.find((item) => item.value === travelClass)
                                          ?.value
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
                              </PopoverShadcn>
                            </div>

                            <Button
                              // disable={flightOffersSearchMutation.isPending}
                              classNameWrapper="w-[50%] relative"
                              type="submit"
                              nameButton="Tìm kiếm"
                              className="px-8 py-4 border-2 border-blueColor bg-blueColor w-full text-whiteColor text-base rounded-md hover:border-2 hover:bg-blueColor/80 duration-200 font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="mt-8 px-8 hidden md:grid grid-cols-3 items-center justify-between gap-4">
              <div className="col-span-1 border border-gray-200 rounded-md shadow-lg p-4">
                <div className="flex items-center gap-4">
                  <img src={banner3} alt="" className="flex-shrink-0 w-14 h-14" />
                  <div className="flex-grow">
                    <h2 className="text-base lg:text-lg text-textColor font-semibold">
                      Điểm đến tốt nhất?
                    </h2>
                    <span className="block md:text-xs lg:text-sm text-blueColor">
                      Khám phá những điểm đến tuyệt vời nhất với chúng tôi.
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-1 border border-gray-200 rounded-md shadow-lg p-4">
                <div className="flex items-center gap-4">
                  <img src={banner2} alt="" className="flex-shrink-0 w-14 h-14" />
                  <div className="flex-grow">
                    <h2 className="text-base lg:text-lg text-textColor font-semibold">
                      Đa dạng ngôn ngữ trên trang web
                    </h2>
                    <span className="block md:text-xs lg:text-sm text-blueColor">
                      Thay đổi ngôn ngữ
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-1 border border-gray-200 rounded-md shadow-lg p-4">
                <div className="flex items-center gap-4">
                  <img src={banner1} alt="" className="flex-shrink-0 w-14 h-14" />
                  <div className="flex-grow">
                    <h2 className="text-base lg:text-lg text-textColor font-semibold">Booking.</h2>
                    <span className="block md:text-xs lg:text-sm text-blueColor">
                      Hoàn tất việc đăng ký trên web của bạn khi Booking. với các bước dễ dàng
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 items-center flex-wrap gap-4">
              <div className="col-span-2 md:col-span-1 h-[450px]">
                <img src={ticketBanner} alt="banner" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 md:col-span-1 h-[450px]">
                <img src={ticketBanner2} alt="banner" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="mt-8 pb-8 relative">
              <div className="w-full h-[400px]">
                <img
                  src={bannerFlight}
                  alt="bannerFlight"
                  className="w-full h-full object-cover brightness-50 rounded-sm"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-white p-4 rounded-sm shadow-sm">
                <h3 className="text-lg lg:text-2xl text-center font-semibold text-textColor">
                  Đối tác hàng không
                </h3>
                <div className="mt-0 md:mt-4 grid grid-cols-8 items-center gap-2 flex-wrap">
                  {bannerAirLineList.map((item, index) => (
                    <div key={index}>
                      <div className="col-span-1">
                        <img
                          src={item}
                          alt={item}
                          className="w-10 h-10 md:w-10 md:h-8 lg:w-16 lg:h-18 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-0 mt:py-8 relative">
              <div className="w-full h-[400px]">
                <img
                  src={bannerFlight2}
                  alt="bannerFlight"
                  className="w-full h-full object-cover brightness-50 rounded-sm"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-white p-4 rounded-sm shadow-sm">
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-lg lg:text-2xl font-semibold text-textColor">
                    Đối tác thanh toán
                  </h3>
                  <div className="md:w-20 md:h-20 lg:w-32 lg:h-32">
                    <img src={paymentImg} alt="payment" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  )
}

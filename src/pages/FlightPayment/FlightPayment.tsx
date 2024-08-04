import { useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import usePriceTraveller from "src/hooks/usePriceTraveller"
import useScrollHeader from "src/hooks/useScrollHeader"
import { ResponseFlightOrder } from "src/types/flight.type"
import { formatCurrency } from "src/utils/utils"
import icon2 from "src/img/FlightOrder/imp-info.webp"
import vnpay from "../../img/Flight/vnpay.jpg"
import Button from "src/components/Button"
import axios from "axios"

export default function FlightPayment() {
  const { showHeader } = useScrollHeader(200)
  const navigate = useNavigate()
  const handleBackPage = () => {
    navigate(-1)
  }

  const dataLS = localStorage.getItem("detailPayment") as string
  const data = JSON.parse(dataLS) as ResponseFlightOrder

  const priceAdult = usePriceTraveller(data, "ADULT")
  const priceChild = usePriceTraveller(data, "CHILD")
  const priceInfant = usePriceTraveller(data, "HELD_INFANT")
  const priceTotal = useMemo(() => {
    return data.data.flightOffers[0].travelerPricings.reduce(
      (result, current) => result + Number(current.price.total),
      0
    )
  }, [data])
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

  const handleSubmitPayment = async () => {
    try {
      const response = await axios.post("http://localhost:3000/create_payment_url", {
        amount: 100000, // số tiền
        orderDescription: "Thanh toán đơn hàng", // mô tả đơn hàng
        orderType: "billpayment", // loại đơn hàng
        language: "vn" // ngôn ngữ
      })

      window.location.href = response.data.url
    } catch (error) {
      console.error("Error creating payment URL:", error)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Thanh toán chuyến bay</title>
        <meta name="description" content="Thanh toán chuyến bay - Booking." />
      </Helmet>

      <div className="relative z-10">
        <div
          className={`w-full bg-blueColor ${showHeader ? "fixed top-0 left-1/2 -translate-x-1/2" : "absolute top-0 left-1/2 -translate-x-1/2"} z-50 transition-all ease-linear duration-1000`}
        >
          <div className="container">
            <div className="py-4 px-1 grid grid-cols-12 items-center">
              <div className="col-span-4">
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
                  <h1 className="text-xl text-whiteColor font-semibold">
                    Hoàn tất đặt chỗ của bạn
                  </h1>
                </div>
              </div>
              <div className="col-span-5 col-start-8 items-center flex flex-col">
                <div className="w-[80%] flex items-center justify-between">
                  <div>
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                      1
                    </div>
                  </div>

                  <div className="w-52 h-1 bg-blue-500"></div>

                  <div>
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                      2
                    </div>
                  </div>

                  <div className="w-52 h-1 bg-gray-400"></div>

                  <div>
                    <div className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">
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

        <div className="w-full absolute md:top-46 lg:top-20 left-1/2 -translate-x-1/2">
          <div className="container">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <div className="p-4 bg-[#fff] shadow-md rounded-md">
                  <span className="text-sm text-textColor font-medium">Chi tiết liên lạc</span>
                  <div className="mt-2 flex items-start gap-2">
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
                    <div>
                      <span className="text-base font-medium">
                        {data.data.contacts[0].addresseeName.firstName}
                      </span>
                      <span className="block text-sm font-normal text-gray-500">
                        {data.data.contacts[0].emailAddress}
                      </span>
                      <span className="block text-sm font-normal text-gray-500">
                        +{data.data.contacts[0].phones[0].countryCallingCode}{" "}
                        {data.data.contacts[0].phones[0].number}
                      </span>
                    </div>
                  </div>

                  <span className="mt-2 block text-sm text-textColor font-medium">
                    Thông tin hành khách
                  </span>
                  <div className="mt-2">
                    {data.data.travelers.map((traveller, index) => (
                      <div key={index} className="mb-1 flex items-start gap-2">
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

                        <div>
                          <span className="text-sm font-normal">
                            {traveller.name.lastName} {traveller.name.firstName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <svg
                      width="1em"
                      height="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="blue"
                      className="w-6 h-6"
                    >
                      <path d="M2.491 16.534C1.073 13.051.671 8.823 1.266 3.855a2 2 0 0 1 1.508-1.704l8.5-2.093a2 2 0 0 1 .954 0l8.551 2.094a2 2 0 0 1 1.509 1.696c.617 4.966.227 9.196-1.188 12.685-1.501 3.7-4.464 6.158-8.8 7.333a2 2 0 0 1-1.052-.001c-4.303-1.18-7.252-3.637-8.757-7.331zm7.452-6.992v-.878c0-.935.758-1.694 1.694-1.694h.583c.936 0 1.694.759 1.694 1.694v.878H9.943zm5.971.338V8.664A3.694 3.694 0 0 0 12.22 4.97h-.583a3.694 3.694 0 0 0-3.694 3.694v1.07A2 2 0 0 0 6.8 11.542v4.357a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4.357c0-.692-.352-1.302-.886-1.662zM8.8 11.542h6v4.357h-6v-4.357zm3 2.428a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                    </svg>
                    <span className="text-sm text-blue-500 font-medium">Thanh toán an toàn</span>
                  </div>

                  <span className="mt-1 block text-sm text-textColor font-medium">
                    Tất cả thông tin thẻ đều được mã hóa hoàn toàn, an toàn và được bảo vệ.
                  </span>
                </div>

                <div className="flex justify-between p-4 bg-blue-200">
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={true} />
                    <div>
                      <span className="text-sm text-blueColor">THANH TOÁN ĐIỆN TỬ</span>
                      <span className="block text-xs text-blueColor">
                        (Có thể áp dụng phí xử lý)
                      </span>
                    </div>
                  </div>
                  <img src={vnpay} alt="vnpay" className="w-28 h-16" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm max-w-[650px] w-full">
                    Bằng cách bấm vào nút nộp đơn đặt chỗ này, tôi đồng ý với{" "}
                    <span className="text-blueColor font-medium">Điều Khoản sử dụng</span> và{" "}
                    <span className="text-blueColor font-medium">Chính Sách Bảo Mật</span> của
                    Booking.
                  </div>
                  <Button
                    onClick={handleSubmitPayment}
                    nameButton="Thanh toán ngay"
                    className="p-4 bg-blueColor w-full text-whiteColor text-base rounded-sm hover:bg-blueColor/80 duration-200 flex items-center justify-center"
                  >
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="col-span-4">
                <div className="sticky left-0 top-20 ">
                  <div className="bg-[#fff] p-4 shadow-md rounded-lg">
                    <span className="text-base mb-4 block font-medium">Phân tích giá</span>

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
                      <span className="text-sm font-medium text-[#32a923] capitalize">
                        miễn phí
                      </span>
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

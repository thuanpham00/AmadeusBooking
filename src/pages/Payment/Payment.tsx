import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { path } from "src/constant/path"
import useQueryParam from "src/hooks/useQueryParam"
import useScrollHeader from "src/hooks/useScrollHeader"
import { formatCurrency } from "src/utils/utils"

export default function Payment() {
  const { showHeader } = useScrollHeader(200)
  const paramsUrl = useQueryParam()

  useEffect(() => {
    toast.success("Đặt vé thành công!")
  }, [])

  return (
    <div>
      <Helmet>
        <title>Đặt vé thành công</title>
        <meta name="description" content="Thanh toán chuyến bay - Booking." />
      </Helmet>

      <div className="relative z-10">
        <div
          className={`w-full bg-blueColor ${showHeader ? "fixed top-0 left-1/2 -translate-x-1/2" : "absolute top-0 left-1/2 -translate-x-1/2"} z-50 transition-all ease-linear duration-1000`}
        >
          <div className="container">
            <div className="py-4 px-1 grid grid-cols-12 items-center">
              <div className="col-span-12 md:col-span-5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl text-whiteColor font-semibold">
                    Đã hoàn tất đặt vé của bạn
                  </h1>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="h-4 w-4"
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
              <div className="hidden col-span-6 col-start-7 items-center md:flex flex-col">
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

                  <div className="w-52 h-1 bg-blue-500"></div>

                  <div>
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
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

        <div className="w-full absolute top-20 md:top-32 lg:top-20 left-1/2 -translate-x-1/2">
          <div className="container">
            <div className="flex items-center justify-center">
              <div className="mt-4 w-[400px] flex flex-col items-center justify-center pt-8 pb-8 px-8 shadow-lg border border-gray-300 bg-white rounded-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#2fc867"
                    className="h-16 w-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <h2 className="my-2 text-base text-textColor font-medium">Thanh toán thành công</h2>
                <div className="text-center font-semibold text-xl text-blueColor">
                  -
                  {formatCurrency(
                    Number(paramsUrl.vnp_Amount.slice(0, paramsUrl.vnp_Amount.length - 2))
                  )}
                  đ
                </div>
                <span className="text-gray-500">{paramsUrl.vnp_PayDate}</span>

                <div className="my-8 bg-gray-300 w-full h-[1px]"></div>

                <div className="w-full">
                  <div className="text-base flex items-center justify-between mb-1">
                    <span className="text-gray-500">Mã giao dịch:</span>
                    <span className="text-textColor">{paramsUrl.vnp_TxnRef}</span>
                  </div>
                  <div className="text-base flex items-center justify-between mb-1">
                    <span className="text-gray-500">Loại giao dịch:</span>
                    <span className="text-textColor">{paramsUrl.vnp_CardType}</span>
                  </div>
                  <div className="text-base flex items-center justify-between mb-1">
                    <span className="text-gray-500">Ngân hàng giao dịch:</span>
                    <span className="text-textColor">{paramsUrl.vnp_BankCode}</span>
                  </div>
                  <div className="text-base flex items-center justify-between mb-1">
                    <span className="text-gray-500">Diễn giải:</span>
                    <span className="text-textColor">{paramsUrl.vnp_OrderInfo}</span>
                  </div>
                  <div className="text-base flex items-center justify-between mb-1">
                    <span className="text-textColor font-medium">Tổng số tiền (đ):</span>
                    <span className="text-blueColor font-semibold">
                      {formatCurrency(
                        Number(paramsUrl.vnp_Amount.slice(0, paramsUrl.vnp_Amount.length - 2))
                      )}
                      đ
                    </span>
                  </div>
                </div>

                <Link
                  to={path.flight}
                  className="mt-4 w-full bg-blueColor p-2 text-center text-white rounded-full hover:opacity-75 duration-200 flex items-center justify-center gap-2"
                >
                  Trở về
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
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

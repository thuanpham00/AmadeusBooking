import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full absolute bottom-0 bg-[#022d5c] py-8">
      <div className="container">
        <div className="flex items-center justify-between pb-4 border-b text-whiteColor border-b-[#4e6c8d]">
          <h2 className="font-semibold text-xl">Booking</h2>
          <div className="flex items-center gap-8">
            <span className="font-semibold text-xl">Kết nối với chúng tôi</span>
            <div className="flex gap-2">
              <Link
                to="https://www.facebook.com/domaybatduoctao912"
                target="_blank"
                aria-label="Facebook"
                className="w-7 h-7 bg-whiteColor rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#000"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="https://www.instagram.com/minthuan_/"
                target="_blank"
                aria-label="Instagram"
                className="w-7 h-7 bg-whiteColor rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="py-4 grid grid-cols-4 md:grid-cols-12 gap-4 flex-wrap border-b border-b-[#4e6c8d]">
          <div className="col-span-2 md:col-span-3">
            <h3 className="text-sm hover:underline duration-200 cursor-pointer text-whiteColor">
              ĐƯỜNG DẪN NHANH
            </h3>
            <ul className="mt-4">
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Hãng hàng không nổi tiếng
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Đường bay phổ biến
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Các điểm đến hàng đầu ở Hoa Kỳ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Các điểm đến quốc tế hàng đầu
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Thư mục trang web
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Giữ liên lạc
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h3 className="text-sm hover:underline duration-200 cursor-pointer text-whiteColor">
              BOOKING
            </h3>
            <ul className="mt-4">
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Chuyến bay giá rẻ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Khách sạn giá rẻ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Cho thuê ô tô
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Gói kỳ nghỉ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Du lịch theo nhóm
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Tiết kiệm và kiếm $
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h3 className="text-sm hover:underline duration-200 cursor-pointer text-whiteColor">
              CÔNG CỤ DU LỊCH
            </h3>
            <ul className="mt-4">
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Thẻ quà tặng
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Kiểm tra đặt chỗ của tôi
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Hỗ trợ khách hàng
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Đăng ký trực tuyến
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Phí hành lý hàng không
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Kiểm tra tình trạng chuyến bay
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Blog du lịch
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Hướng dẫn viên địa phương
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h3 className="text-sm hover:underline duration-200 cursor-pointer text-whiteColor">
              GIỚI THIỆU
            </h3>
            <ul className="mt-4">
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Phòng báo chí
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Nghề nghiệp
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Chương trình liên kết
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Lời chứng thực của khách hàng
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Quảng cáo với chúng tôi
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="font-normal text-sm hover:underline duration-200 cursor-pointer text-whiteColor/80"
                >
                  Bản tin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-whiteColor">Phạm Minh Thuận</span>
          <span className="text-whiteColor">phamminhthuan912@gmail.com</span>
        </div>
      </div>
    </footer>
  )
}

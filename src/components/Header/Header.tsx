import { Link } from "react-router-dom"
import { path } from "src/constant/path"
import hotel from "../../img/svg/hotel-1-svgrepo-com.svg"
import logo from "../../img/favicon/FaviconFlight.webp"
import coVN from "../../img/lauguage/coVN.webp"
import coMy from "../../img/lauguage/coMy.webp"
import iconFlight from "../../img/svg/flight-svgrepo-com.svg"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "src/context/useContext"
import Popover from "../Popover"
import { getNameToEmail } from "src/utils/utils"
import { clearLS } from "src/utils/auth"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "../ui/navigation-menu"

export default function Header() {
  const { isAuthenticated, isProfile, setIsAuthenticated, setIsProfile } = useContext(AppContext)

  const handleLogOut = () => {
    clearLS()
    setIsAuthenticated(false)
    setIsProfile(null)
  }
  const [showHeader, setShowHeader] = useState(false)
  const [scrollWindow, setScrollWindow] = useState(0)

  const handleScrollWindow = () => {
    const currentScrollY = window.scrollY
    setScrollWindow(currentScrollY)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScrollWindow)

    return () => window.removeEventListener("scroll", handleScrollWindow)
  }, [])

  // nếu scrollWindow có thay đổi thì nó tham chiếu tới chạy lại hàm này
  useEffect(() => {
    if (scrollWindow > 100) {
      setShowHeader(true)
    } else {
      setShowHeader(false)
    }
  }, [scrollWindow])

  return (
    <header
      className={`sticky top-0 left-0 z-40 bg-whiteColor duration-100 transition-all ease-linear transform shadow-lg ${showHeader ? "h-auto opacity-100 p-4" : "h-0 opacity-0"}`}
    >
      <div className="container">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <Link to={path.home} className="flex items-center">
              <div className="w-10 h-10">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-xl text-textColor font-semibold">Booking.</div>
            </Link>
            <nav className="ml-8 flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Link
                        to={path.flight}
                        className="flex items-center text-textColor duration-200 hover:text-gray-500"
                      >
                        <img src={iconFlight} alt="icon" className="w-5 h-5" />
                        <span className="text-base font-semibold hover:underline block">
                          Chuyến bay
                        </span>
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>
                        <div className="bg-whiteColor rounded-sm shadow-lg border border-gray-300">
                          <Link
                            to={path.flightSearch}
                            className="block py-3 px-2 min-w-[170px] bg-whiteColor hover:bg-gray-300 duration-200"
                          >
                            Tìm kiếm chuyến bay
                          </Link>
                          <Link
                            to={path.flightManage}
                            className="block py-3 px-2 min-w-[170px] bg-whiteColor hover:bg-gray-300 duration-200"
                          >
                            Quản lý đặt chỗ
                          </Link>
                          <div className="py-3 px-2 min-w-[170px] bg-whiteColor hover:bg-gray-300 duration-200">
                            Lựa chọn chỗ ngồi
                          </div>
                          <div className="py-3 px-2 min-w-[170px] bg-whiteColor hover:bg-gray-300 duration-200">
                            Giá vé có thương hiệu
                          </div>
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Link
                        to={path.flightSearch}
                        className="flex items-center text-textColor duration-200 hover:text-gray-500"
                      >
                        <img src={hotel} alt="icon hotel" className="w-4 h-4 mr-1" />
                        <span className="text-base font-semibold hover:underline block">
                          Khánh sạn
                        </span>
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>thuan</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Popover
              className="sticky top-0 left-0 z-30"
              renderPopover={
                <div className="shadow-lg rounded flex flex-col border border-gray-300">
                  <button className="text-sm flex items-center gap-2 text-left min-w-[120px] p-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200 border border-gray-300">
                    <img src={coVN} alt="Cờ Việt Nam" className="h-6 w-6 object-contain" />
                    Vietnamese
                  </button>

                  <button className="text-sm flex items-center gap-2 text-left min-w-[120px] p-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200">
                    <img src={coMy} alt="Cờ Mỹ" className="h-6 w-6 object-contain" />
                    English
                  </button>
                </div>
              }
            >
              <div className="flex gap-1 items-center p-2 duration-200 hover:text-gray-500 text-textColor rounded-sm text-sm">
                <img src={coVN} alt="Cờ Việt Nam" className="h-5 w-5 object-contain" />
                Ngôn ngữ
              </div>
            </Popover>

            {isAuthenticated && (
              <Popover
                className="sticky top-0 left-0 z-30"
                renderPopover={
                  <div className="shadow-lg rounded flex flex-col border border-gray-300">
                    <button className="text-sm text-left min-w-[120px] px-4 py-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200 border-b border-gray-300">
                      Tài khoản của tôi
                    </button>

                    <button
                      onClick={handleLogOut}
                      className="text-sm text-left min-w-[120px] px-4 py-3 bg-[#edf2f4] text-textColor hover:bg-gray-300 duration-200 flex items-center gap-2"
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
                <div className="py-[6px] px-3 border-2 border-textColor rounded-sm duration-200 hover:bg-[#ddd]/80 flex items-center gap-1 text-textColor font-semibold text-sm">
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

                  {getNameToEmail(isProfile as string)}
                </div>
              </Popover>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link
                  to={path.register}
                  className="py-2 px-3 border-2 border-blueColor duration-200 hover:bg-[#ddd]/80 rounded-sm text-sm"
                >
                  Register
                </Link>
                <Link
                  to={path.login}
                  className="py-2 px-3 border-2 border-blueColor bg-blueColor text-whiteColor duration-200 hover:bg-blueColor/80 hover:border-blueColor/80 rounded-sm text-sm"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

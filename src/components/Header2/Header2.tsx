import { Link } from "react-router-dom"
import { path } from "src/constant/path"
import logo from "../../img/favicon/FaviconFlight.webp"
import coVN from "../../img/lauguage/coVN.webp"
import coMy from "../../img/lauguage/coMy.webp"
import { useContext } from "react"
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

export default function Header2() {
  const { isAuthenticated, isProfile, setIsAuthenticated, setIsProfile } = useContext(AppContext)

  const handleLogOut = () => {
    clearLS()
    setIsAuthenticated(false)
    setIsProfile(null)
  }

  return (
    <header className="bg-whiteColor py-2">
      <div className="container">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <Link to={path.home} className="flex items-center">
              <div className="hidden md:block w-14 h-14">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-xl text-textColor font-semibold">Booking.</div>
            </Link>

            <nav className="ml-8 hidden md:flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Link
                        to={path.flight}
                        className="flex items-center text-textColor duration-200 hover:text-gray-500"
                      >
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
                            to={path.flightOrder}
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
              className="sticky top-0 left-0"
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
              <div className="hidden md:flex gap-1 items-center p-2 duration-200 text-textColor rounded-sm text-sm hover:text-gray-500">
                <img src={coVN} alt="Cờ Việt Nam" className="h-5 w-5 object-contain" />
                Ngôn ngữ
              </div>
            </Popover>

            <Link to="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
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
                    stroke="black"
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
                          Xin chào, {getNameToEmail(isProfile as string)}
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
                <div className="hidden py-[6px] px-3 border-2 border-textColor rounded-sm duration-200 hover:bg-[#ddd]/80 md:flex items-center gap-1 text-textColor font-semibold text-sm">
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
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={path.register}
                  className="py-2 px-3 border-2 border-blueColor duration-200 hover:bg-[#ddd]/80 rounded-sm text-sm"
                >
                  Đăng ký
                </Link>
                <Link
                  to={path.login}
                  className="py-2 px-3 border-2 border-blueColor bg-blueColor text-whiteColor duration-200 hover:bg-blueColor/80 hover:border-blueColor/80 rounded-sm text-sm"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

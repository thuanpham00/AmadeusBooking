import { Suspense, lazy, useContext } from "react"
import { Navigate, Outlet, useRoutes } from "react-router-dom"
import { path } from "src/constant/path"
import { AppContext } from "src/context/useContext"
import MainLayout from "src/layouts/MainLayout"
import MainLayout2 from "src/layouts/MainLayout2"
import RegisterLayout from "src/layouts/RegisterLayout"

/**
 * Khi url thay đổi thì các component nào dùng các hook như
 * useRoutes, useParams, useSearchParams,...
 * sẽ bị re-render
 * ví dụ component `App` dưới đây bị re-render khi mà url thay đổi
 * vì dùng `useRouterElement` (đây là custom hook của `useRoutes`)
 */

const Login = lazy(() => import("src/pages/Login"))
const Register = lazy(() => import("src/pages/Register"))
const Flight = lazy(() => import("src/pages/Flight"))
const FlightSearch = lazy(() => import("src/pages/FlightSearch"))
const FlightOrder = lazy(() => import("src/pages/FlightOrder"))
const FlightPayment = lazy(() => import("src/pages/FlightPayment"))

function ProtectedRouter() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRouter() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouterElement() {
  // nhập url theo path có thể điều hướng trang
  // component <Suspenses></Suspenses> - dùng kĩ thuật Lazy load - lướt tới đâu load tới đó
  const routerElement = useRoutes([
    {
      path: "",
      element: <MainLayout />, // sử dụng chung // fix re-render
      children: [
        // trang chuyến bay sẽ là trang mặc định nên gắn 2 route cùng 1 layout
        {
          path: path.home,
          element: (
            <Suspense>
              <Flight />
            </Suspense>
          )
        },
        {
          path: path.flight,
          element: (
            <Suspense>
              <Flight />
            </Suspense>
          )
        }
      ]
    },
    {
      path: "",
      element: <ProtectedRouter />,
      children: [
        {
          path: "",
          // sử dụng <Outlet/> bên trong component <MainLayout2/> để truyền component con vào
          element: <MainLayout2 />, // sử dụng chung // fix re-render
          children: [
            {
              path: path.flightSearch,
              element: (
                <Suspense>
                  <FlightSearch />
                </Suspense>
              )
            },
            {
              path: path.flightOrder,
              element: (
                <Suspense>
                  <FlightOrder />
                </Suspense>
              )
            },
            {
              path: path.flightPayment,
              element: (
                <Suspense>
                  <FlightPayment />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: "",
      element: <RejectedRouter />,
      children: [
        {
          path: "",
          // sử dụng <Outlet/> bên trong component <RegisterLayout/> để truyền component con vào
          element: <RegisterLayout />, // sử dụng chung // fix re-render
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    }
  ])
  return routerElement
}

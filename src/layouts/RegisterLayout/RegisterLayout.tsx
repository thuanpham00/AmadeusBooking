import { Outlet } from "react-router-dom"
import bg1 from "../../img/bgLogin/bg-1.jpg"
import bg2 from "../../img/bgLogin/bg-2.jpg"
import bg3 from "../../img/bgLogin/bg-3.jpg"
import bg4 from "../../img/bgLogin/bg-4.jpg"
import bg5 from "../../img/bgLogin/bg-5.jpg"
import bg6 from "../../img/bgLogin/bg-6.png"
import "react-slideshow-image/dist/styles.css"
import ChangeAutoBg from "src/components/ChangeAutoBg"
import { memo } from "react"

const backgroundList = [bg1, bg2, bg3, bg4, bg5, bg6]

function RegisterLayoutInner() {
  return (
    <div>
      <ChangeAutoBg
        className="w-screen h-screen transition-all duration-1000 ease-linear"
        listImg={backgroundList}
        indexEnd={5}
      />
      <Outlet />
      {/* truyền component con vào bởi Outlet */}
    </div>
  )
}

const RegisterLayout = memo(RegisterLayoutInner) // chặn component re-render khi không cần thiết

export default RegisterLayout

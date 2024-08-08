import { createContext, useState } from "react"
import { ResponseFlightPrice } from "src/types/flight.type"
import { getAccessTokenToLS, getCartToLS, getProfileToLS } from "src/utils/auth"

interface Props {
  children: React.ReactNode
}

type initialStateType = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isProfile: string | null
  setIsProfile: React.Dispatch<React.SetStateAction<string | null>>
  listCart: ResponseFlightPrice[]
  setListCart: React.Dispatch<React.SetStateAction<ResponseFlightPrice[]>>
}

const initialState: initialStateType = {
  isAuthenticated: Boolean(getAccessTokenToLS()), // nếu có accessToken thì true // còn không có thì false
  setIsAuthenticated: () => null,
  isProfile: getProfileToLS(),
  setIsProfile: () => null,
  listCart: getCartToLS(),
  setListCart: () => null
}
// state management
export const AppContext = createContext<initialStateType>(initialState)

export default function AppProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated)
  const [isProfile, setIsProfile] = useState(initialState.isProfile)
  const [listCart, setListCart] = useState(initialState.listCart)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isProfile,
        setIsProfile,
        listCart,
        setListCart
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

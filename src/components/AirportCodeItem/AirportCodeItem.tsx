import { AirportCodeItem as AirportCodeItemType } from "src/types/flight.type"
import iconFlight2 from "src/img/svg/flight-airplane-svgrepo-com.svg"
import { InputAirport } from "src/pages/Flight/Flight"

interface Props {
  item: AirportCodeItemType
  inputName: InputAirport
  handleItemClick: (inputName: InputAirport, value: string) => void
}

export default function AirportCodeItem({ item, handleItemClick, inputName }: Props) {
  const handleChangeInput = () => {
    handleItemClick(inputName, `${item.country} - ${item.code}`)
  }

  return (
    <button
      onClick={handleChangeInput}
      className="w-full border-b border-b-gray-300 py-3 px-2 flex items-center justify-between gap-2 cursor-pointer bg-whiteColor hover:bg-gray-300 duration-200"
    >
      <div className="text-xs lg:text-sm flex items-center gap-2">
        <img src={iconFlight2} alt="icon" className="hidden lg:block h-4 w-4" />
        <span className="block truncate">{item.airport}</span>
        <span className="block text-blue-600 truncate max-w-[200px]">- {item.country}</span>
      </div>
      <span className="text-sm block w-[30px] text-left">{item.code}</span>
    </button>
  )
}

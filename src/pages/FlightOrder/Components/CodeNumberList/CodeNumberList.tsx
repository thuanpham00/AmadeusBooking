import { CountryListCodeNumber } from "src/types/flight.type"
import { InputName } from "../../FlightOrder"

interface Props {
  listAirport: CountryListCodeNumber
  inputName: InputName
  handleItemClick: (inputName: InputName, value: string) => void
}

export default function CodeNumberList({ inputName, listAirport, handleItemClick }: Props) {
  const handleChangeInput = (code: string) => {
    handleItemClick(inputName, code)
  }

  return listAirport.map((item) => {
    const row = []
    row.push(
      <div key={item.code}>
        <button
          onClick={() => handleChangeInput(item.code)}
          className="w-full border-b border-b-gray-300 py-3 px-2 flex items-center justify-between gap-2 cursor-pointer bg-whiteColor hover:bg-gray-300 duration-200"
        >
          <div className="text-sm flex items-center gap-2">
            <span className="block truncate">{item.name}</span>
            <span className="block text-textColor truncate">- {item.code}</span>
          </div>
        </button>
      </div>
    )
    return row
  })
}

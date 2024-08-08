/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react"
import { UseFormSetValue } from "react-hook-form"
import { InputAirport } from "src/pages/Flight/Flight"
import { getCodeAirport } from "src/utils/utils"

export default function useFormHandler(
  list: any,
  inputSearch: string,
  setValue?: UseFormSetValue<any>,
  setStateInput?: (value: React.SetStateAction<string>) => void,
  setShowList?: (value: React.SetStateAction<boolean>) => void
) {
  const handleItemClick = (inputName: InputAirport, value: string) => {
    if (setValue) {
      setValue(inputName, getCodeAirport(value) as string) // đảm bảo giá trị của input được quản lý bởi react-hook-form // // cập nhật giá trị của một trường dữ liệu
    }
    if (inputName === "originLocationCode") {
      if (setStateInput && setShowList) {
        setStateInput(value) // nếu dùng mỗi thằng này thì nó ko dc quản lý bởi useForm // luôn ""
        setShowList(false)
      }
    } else if (inputName === "destinationLocationCode") {
      if (setStateInput && setShowList) {
        setStateInput(value) // nếu dùng mỗi thằng này thì nó ko dc quản lý bởi useForm // luôn ""
        setShowList(false)
      }
    }
  }

  const filterList = useMemo(
    () =>
      list.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(inputSearch.toLowerCase()) ||
          item.country?.toLowerCase().includes(inputSearch.toLowerCase())
      ),
    [list, inputSearch]
  )
  return { filterList, handleItemClick }
}

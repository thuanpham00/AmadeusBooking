/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormSetValue } from "react-hook-form"

export default function useValidateInput(setValue: UseFormSetValue<any>) {
  const handleChangeValueForm =
    (nameInput: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueInput = event.target.value.toUpperCase()
      if (
        nameInput === "userName2" ||
        nameInput === "lastName2" ||
        nameInput === "userName" ||
        nameInput === "lastName"
      ) {
        // chỉ nhập kí tự chữ
        // thay thế các kí tự không phải kí tự chữ bằng ""
        const valueInput2 = valueInput.replace(/[^a-zA-Z\s]/g, "")
        setValue(nameInput, valueInput2)
      } else if (
        nameInput === "numberPhone" ||
        nameInput === "monthBirth" ||
        nameInput === "yearBirth" ||
        nameInput === "monthBirth"
      ) {
        // Sử dụng regex để chỉ cho phép nhập số
        // thay thế các kí tự không phải kí tự số bằng ""
        const valueInput2 = valueInput.replace(/[^0-9]/g, "")
        setValue(nameInput, valueInput2)
      }
    }
  return { handleChangeValueForm }
}

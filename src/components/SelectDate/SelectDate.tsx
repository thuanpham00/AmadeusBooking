import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/popover"
import { Button as ButtonShadcn } from "src/components/ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Controller } from "react-hook-form"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  setDate: (date: Date) => void
  date: Date | null | string
  convertToYYYYMMDD: (date: Date) => string
  errors: string
  name: string
  text: string
  className?: string
  classNameError?: string
}

export default function SelectDate({
  control,
  setDate,
  date,
  convertToYYYYMMDD,
  errors,
  name,
  text,
  className = "py-[10px] px-2 border-2 border-gray-300 rounded-md flex items-center justify-center",
  classNameError = "py-[10px] px-2 border-2 border-red-500 bg-red-100 rounded-md flex items-center justify-center"
}: Props) {
  return (
    <div className={errors ? classNameError : className}>
      <Popover>
        <PopoverTrigger asChild>
          <ButtonShadcn
            variant={"outline"}
            className="bg-transparent hover:bg-transparent text-left border-none shadow-none text-base flex gap-1"
          >
            <CalendarIcon className="h-4 w-4" />
            {date ? format(date, "yyyy-MM-dd") : <span>{text}</span>}
            {errors && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="h-5 w-5 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            )}
          </ButtonShadcn>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Controller
            control={control}
            name={name} // tên trường dữ liệu
            render={({ field }) => (
              <div ref={field.ref}>
                <Calendar
                  mode="single"
                  selected={date as Date}
                  onSelect={(date) => {
                    setDate(date as Date)
                    field.onChange(convertToYYYYMMDD(date as Date)) // cập nhật trường dữ liệu
                  }}
                  initialFocus
                />
              </div>
            )}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

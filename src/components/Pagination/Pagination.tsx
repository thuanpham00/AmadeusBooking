interface Props {
  totalOfPage: number
  totalAllPage: number
  currentPage: number
  onChangePage: (numberPage: number) => void
}

export default function Pagination({
  totalOfPage,
  totalAllPage,
  currentPage,
  onChangePage
}: Props) {
  const totalPage = Math.ceil(totalAllPage / totalOfPage) // 25 / 5 = 5 page

  const handleChangePage = (index: number) => {
    const numberPage = index + 1

    onChangePage && onChangePage(numberPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="pt-5">
      <div className="flex items-center justify-center gap-4">
        <button className="bg-gray-500 p-2 text-whiteColor hover:opacity-50 duration-200">
          Trước
        </button>
        {Array(totalPage)
          .fill(0)
          .map((_, index) => {
            return (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => handleChangePage(index)}
                  className={`py-2 px-3 text-whiteColor hover:opacity-50 duration-200 ${currentPage === index + 1 ? "bg-blueColor" : "bg-gray-500"}`}
                >
                  {index + 1}
                </button>
              </div>
            )
          })}
        <button
          onClick={() => handleChangePage(currentPage + 1)}
          className="bg-gray-500 p-2 text-whiteColor hover:opacity-50 duration-200"
        >
          Sau
        </button>
      </div>
    </div>
  )
}

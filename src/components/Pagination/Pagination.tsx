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

  const listPage = Array(totalPage)
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
    })

  return (
    <div className="pt-5">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleChangePage(currentPage - 2)}
          className="bg-gray-300 p-2 text-textColor hover:opacity-50 duration-200"
        >
          Trước
        </button>
        {listPage}
        <button
          onClick={() => handleChangePage(currentPage)}
          className="bg-gray-300 p-2 text-textColor hover:opacity-50 duration-200"
        >
          Sau
        </button>
      </div>
    </div>
  )
}

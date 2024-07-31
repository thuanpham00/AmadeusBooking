export type FlightOfferParamsConfig = {
  originLocationCode?: string // mã sân bay xuất phát
  destinationLocationCode?: string // mã sân bay đích
  departureDate?: string // ngày khởi hành mong muốn
  returnDate?: string // ngày trở về
  adults?: number // người lớn // 12 tuổi trở lên
  children?: number // trẻ em // 2 - 12 tuổi
  infants?: number // em bé // dưới 2 tuổi
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST" // hạng ghế
  currencyCode?: string // mã tiền tệ
  max?: number // số lượng chuyến bay cần lấy
  nonStop?: boolean // chuyến bay trực tiếp
  maxPrice?: number // Giới hạn giá tối đa cho các kết quả chuyến bay.
  includedAirlineCodes?: string // các mã hãng hàng không mà bạn muốn bao gồm trong kết quả tìm kiếm chuyến bay.
  // excludedAirlineCodes?: string // các mã hãng hàng không mà bạn muốn loại trừ khỏi kết quả tìm kiếm chuyến bay.
}

export type FlightPricingParams = {
  data: {
    type: string // "flight-offers-pricing"
    flightOffers: {
      type: string // "flight-offer"
      id: string
      source: string // e.g., "GDS"
      instantTicketingRequired: boolean
      nonHomogeneous: boolean
      oneWay: boolean
      lastTicketingDate: string // e.g., "2020-08-04"
      numberOfBookableSeats: number
      itineraries: {
        duration: string // e.g., "PT32H15M"
        segments: {
          departure: {
            iataCode: string // e.g., "SYD"
            terminal: string // e.g., "1"
            at: string // e.g., "2021-02-01T19:15:00"
          }
          arrival: {
            iataCode: string // e.g., "SIN"
            terminal: string // e.g., "1"
            at: string // e.g., "2021-02-02T00:30:00"
          }
          carrierCode: string // e.g., "TR"
          number: string // e.g., "13"
          aircraft: {
            code: string // e.g., "789"
          }
          operating: {
            carrierCode: string // e.g., "TR"
          }
          duration: string // e.g., "PT8H15M"
          id: string
          numberOfStops: number
          blacklistedInEU: boolean
        }[]
      }[]
      price: {
        currency: string // e.g., "EUR"
        total: string // e.g., "546.70"
        base: string // e.g., "334.00"
        fees: {
          amount: string // e.g., "0.00"
          type: string // e.g., "SUPPLIER"
        }[]
        grandTotal: string // e.g., "546.70"
      }
      pricingOptions: {
        fareType: string[] // e.g., ["PUBLISHED"]
        includedCheckedBagsOnly: boolean
      }
      validatingAirlineCodes: string[] // e.g., ["HR"]
      travelerPricings: {
        travelerId: string
        fareOption: string // e.g., "STANDARD"
        travelerType: string // e.g., "ADULT"
        price: {
          currency: string // e.g., "EUR"
          total: string // e.g., "546.70"
          base: string // e.g., "334.00"
        }
        fareDetailsBySegment: {
          segmentId: string
          cabin: string // e.g., "ECONOMY"
          fareBasis: string // e.g., "O2TR24"
          class: string // e.g., "O"
          includedCheckedBags: {
            weight: number // e.g., 20
            weightUnit: string // e.g., "KG"
          }
        }[]
      }[]
    }[]
  }
}

export type TravellerType = {
  // id: string // ID của hành khách.
  dateOfBirth: string // Ngày sinh của hành khách theo định dạng ngày tháng năm (YYYY-MM-DD).
  name: {
    firstName: string // Tên của hành khách.
    lastName: string // Họ của hành khách.
  }
  gender: string // Giới tính của hành khách. // "MALE" | "FEMALE"
  contact?: {
    emailAddress: string // Địa chỉ email của hành khách.
    phones: [
      {
        deviceType: "MOBILE" | "LANDLINE" // Loại thiết bị của số điện thoại (di động hoặc cố định).
        countryCallingCode: string // Mã quốc gia gọi quốc tế.
        number: string // Số điện thoại của hành khách.
      }
    ]
  }
  //  Danh sách các tài liệu của hành khách
  documents: [DocumentType]
}

type DocumentType = {
  //  Danh sách các tài liệu của hành khách
  documentType: "PASSPORT" | "ID_CARD" // Loại giấy tờ tùy thân (hộ chiếu hoặc chứng minh thư).
  birthPlace?: string // Nơi sinh của hành khách.
  issuanceLocation?: string // Nơi cấp giấy tờ.
  issuanceDate?: string // Ngày cấp giấy tờ.
  number?: string // Số giấy tờ.
  expiryDate?: string // Ngày hết hạn (tuỳ chọn).
  issuanceCountry?: string // Quốc gia cấp (tuỳ chọn).
  validityCountry?: string //  Quốc gia hiệu lực (tuỳ chọn).
  nationality?: string // Quốc tịch (tuỳ chọn).
  holder: boolean //  Xác định người giữ tài liệu.
} //  Danh sách các tài liệu của hành khách

export type FlightCreateOrder = {
  data: {
    type: "flight-order"
    flightOffers: ResponseFlightPriceItem[]
    travelers: //  Danh sách các hành khách:
    TravellerType[]

    remarks: {
      general: [
        {
          subType: string //  Loại phụ của ghi chú.
          text: string // Văn bản của ghi chú.
        }
      ]
    }
    ticketingAgreement: {
      option: string // Tuỳ chọn của thoả thuận vé.
      delay: string // Thời gian trì hoãn.
    }
    contacts: [
      // Thông tin liên hệ:
      {
        addresseeName: {
          firstName: string
          lastName: string
        }
        companyName: string // Tên công ty.
        purpose: string // Mục đích.
        phones: {
          deviceType: "LANDLINE" | "MOBILE" // : Loại thiết bị ('LANDLINE' hoặc 'MOBILE').
          countryCallingCode: string //  Mã gọi quốc gia.
          number: string // Số điện thoại.
        }[]
        emailAddress: string //  Địa chỉ email.
        address: {
          lines: Array<string> //  Các dòng địa chỉ.
          postalCode: string // Mã bưu điện.
          cityName: string //  Tên thành phố.
          countryCode: string // Mã quốc gia.
        }
      }
    ]
  }
}

export type countryItem = {
  code: string
  country: string
}

export type AirportCodeItem = {
  code: string
  airport: string
  country: string
}
export type AirportCodeList = AirportCodeItem[]

// response của flight offer search
export type ResponseFlightItem = {
  // Thông tin chung về chuyến bay
  type: string // Loại đối tượng (e.g., "flight-offer")
  id: string // ID duy nhất của chuyến bay
  source: string // Nguồn của dữ liệu
  instantTicketingRequired: boolean // Có yêu cầu phát hành vé ngay lập tức không
  nonHomogeneous: boolean // Có không đồng nhất không (e.g., nhiều hạng ghế)
  oneWay: boolean // Là chuyến bay một chiều không
  lastTicketingDate: string // Ngày cuối cùng có thể đặt vé
  numberOfBookableSeats: number // Số lượng chỗ ngồi có thể đặt

  // Thông tin chi tiết về hành trình
  // 1 chuyến bay sẽ có nhiều hành trình, quá cảnh
  itineraries: [
    {
      duration: string // Tổng thời gian của hành trình
      segments: [
        {
          departure: {
            iataCode: string // Mã IATA của sân bay khởi hành
            terminal: string // Nhà ga khởi hành
            at: string // Thời gian khởi hành
          }
          arrival: {
            iataCode: string // Mã IATA của sân bay đến
            terminal: string // Nhà ga đến
            at: string // Thời gian đến
          }
          carrierCode: string // Mã hãng hàng không
          number: string // Số hiệu chuyến bay
          aircraft: {
            code: string // Mã máy bay
          }
          operating: {
            carrierCode: string // Mã hãng hàng không vận hành
          }
          duration: string // Thời gian bay của đoạn này
          id: string // ID của đoạn bay
          numberOfStops: number // Số lần dừng
          blacklistedInEU: boolean // Có bị cấm bay trong EU không
        }
      ]
    }
  ]

  // Thông tin giá cả của chuyến bay
  price: {
    currency: string // Loại tiền tệ
    total: string // Tổng giá
    base: string // Giá cơ bản
    fees: {
      amount: string // Số tiền của phí
      type: string // Loại phí
    }[]
    grandTotal: string // Tổng giá bao gồm tất cả các phí
  }

  // Tùy chọn giá vé
  pricingOptions: {
    fareType: string[] // Loại giá vé (e.g., "PUBLISHED")
    includedCheckedBagsOnly: boolean // Chỉ bao gồm hành lý ký gửi
  }

  // Mã hãng hàng không xác nhận vé
  validatingAirlineCodes: string[]

  // Giá vé cho từng hành khách
  travelerPricings: [
    {
      travelerId: string // ID của hành khách
      fareOption: string // Tùy chọn giá vé
      travelerType: string // Loại hành khách (e.g., "ADULT")
      price: {
        currency: string // Loại tiền tệ
        total: string // Tổng giá
        base: string // Giá cơ bản
      }
      fareDetailsBySegment: [
        {
          segmentId: string // ID của đoạn bay
          cabin: string // Hạng ghế (e.g., "ECONOMY")
          fareBasis: string // Cơ sở giá vé
          class: string // Lớp (e.g., "E")
          includedCheckedBags: {
            weight: number // Trọng lượng hành lý ký gửi
            weightUnit: string // Đơn vị trọng lượng (e.g., "KG")
          }
        }
      ]
    }
  ]
}
export type ResponseFlightList = {
  // Metadata của phản hồi
  meta: {
    // Tổng số kết quả trả về
    count: number
    // Các liên kết liên quan
    links: {
      self: string // URL của request
    }
  }

  // Dữ liệu chính của các chuyến bay
  data: ResponseFlightItem[]

  // Từ điển chứa thông tin bổ sung
  dictionaries: {
    locations: {
      [code: string]: {
        cityCode: string // Mã thành phố
        countryCode: string // Mã quốc gia
      }
    }
    aircraft: {
      [code: string]: string // Loại máy bay
    }
    currencies: {
      [code: string]: string // Loại tiền tệ
    }
    carriers: {
      [code: string]: string // Hãng hàng không
    }
  }
}

// response của flight offer price
export type ResponseFlightPrice = {
  data: {
    type: string // Loại dữ liệu, ví dụ "flight-offers-pricing"
    flightOffers: ResponseFlightPriceItem[]
  }
  dictionaries: {
    locations: {
      [key: string]: {
        cityCode: string
        countryCode: string
      }
    }
  }
}
export type ResponseFlightPriceItem = {
  type: string // Loại đề xuất, ví dụ "flight-offer"
  id: string // ID của đề xuất chuyến bay
  source: string // Nguồn dữ liệu, ví dụ "GDS"
  instantTicketingRequired: boolean // Xác định xem vé có cần xuất ngay không
  nonHomogeneous: boolean // Xác định xem các dịch vụ có khác nhau không
  lastTicketingDate: string // Ngày cuối cùng để xuất vé
  itineraries: [
    {
      segments: [
        {
          departure: {
            iataCode: string // Mã IATA của sân bay khởi hành
            at: string // Thời gian khởi hành
            terminal?: string // Nhà ga (tuỳ chọn)
          }
          arrival: {
            iataCode: string // Mã IATA của sân bay đến
            at: string // Thời gian đến
            terminal?: string // Nhà ga (tuỳ chọn)
          }
          carrierCode: string // Mã hãng hàng không
          number: string // Số hiệu chuyến bay
          aircraft: {
            code: string // Mã máy bay
          }
          operating: {
            carrierCode: string // Mã hãng hàng không vận hành
          }
          id: string // ID của đoạn bay
          numberOfStops: number // Số lượng điểm dừng
          duration: string // Thời gian bay, ví dụ "PT8H40M"
        }
      ]
    }
  ]
  price: {
    currency: string // Loại tiền tệ
    total: string // Tổng giá vé
    base: string // Giá vé cơ bản
    fees: [
      {
        amount: string // Số tiền phí
        type: string // Loại phí, ví dụ "SUPPLIER", "TICKETING", "FORM_OF_PAYMENT"
      }
    ]
    grandTotal: string // Tổng giá trị cuối cùng
    billingCurrency: string // Loại tiền tệ thanh toán
  }
  pricingOptions: {
    fareType: string[] // Các loại giá vé, ví dụ ["PUBLISHED"]
    includedCheckedBagsOnly: boolean // Xác định chỉ bao gồm hành lý ký gửi
  }
  validatingAirlineCodes: string[] // Danh sách mã hãng hàng không xác thực vé
  travelerPricings: [
    {
      travelerId: string // ID của hành khách
      fareOption: string // Tùy chọn giá vé, ví dụ "STANDARD"
      travelerType: string // Loại hành khách, ví dụ "ADULT", "CHILD"
      price: {
        currency: string // Loại tiền tệ
        total: string // Tổng giá vé
        base: string // Giá vé cơ bản
        taxes: {
          amount: string // Số tiền thuế
          code: string // Mã thuế
        }[]
      }
      fareDetailsBySegment: {
        segmentId: string // ID của đoạn bay
        cabin: string // Hạng vé, ví dụ "BUSINESS", "ECONOMY"
        fareBasis: string // Cơ sở giá vé
        class: string // Hạng dịch vụ
        includedCheckedBags: {
          weightUnit?: string
          weight?: string
          quantity: number // Số lượng hành lý ký gửi
        }
      }[]
    }
  ]
  paymentCardRequired: false
}

export type countTravelerType = {
  adult: number
  child: number
  infant: number
}

export type CountryItemCodeNumber = {
  code: string
  name: string
}

export type CountryListCodeNumber = CountryItemCodeNumber[]

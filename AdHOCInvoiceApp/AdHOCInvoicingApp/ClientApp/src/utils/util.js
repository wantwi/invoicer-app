// const NHIL_LEVY = 0.025
// const GETFUND_LEVY = 0.025
// const COVID_LEVY = 0.01
// const CST_LEVY = 0.05
// const TOUR_LEVY = 0.01
// const VAT_LEVY = 0.15

// covidRate: 0;
// cstRate: 0;
// cstWithVat: 1.03;
// getfundRate: 0;
// nhilRate: 0;
// regularLeviesWithVat: 1.03;
// tourismRate: 0;
// trsmWithVat: 1.03;
// vatRate: 3;

export const getPayableAmount = (item, discount = 0, vatScheme) => {
  const { covidRate, cstRate, cstWithVat, getfundRate, nhilRate, regularLeviesWithVat, tourismRate, trsmWithVat, vatRate } = vatScheme

  // covidRate
  console.log({ getPayableAmountBefore: item, vatScheme });
  const NHIL_LEVY = nhilRate / 100
  const GETFUND_LEVY = getfundRate / 100
  const COVID_LEVY = covidRate / 100
  const CST_LEVY = cstRate / 100
  const TOUR_LEVY = tourismRate / 100
  const VAT_LEVY = vatRate / 100

  const { isTaxable } = item
  //   let csttourism = 0
  //   if (item?.otherLevies === "NON") {
  //     csttourism = 0
  //   } else if (item?.otherLevies === "CST") {
  //     csttourism = CST_LEVY * item?.price * item?.quantity
  //   } else if (item?.otherLevies === "TRSM") {
  //     csttourism = TOUR_LEVY * item?.price * item?.quantity
  //   }

  // console.log({ getPayableAmount: item })
  let obj = {}
  let vatableAmt = 0
  let vat = 0
  let totalPayable = 0
  let isINC = false
  let cstTaxableAmount = 0
  let csttourism = 0
  if (!isTaxable) {
    // let netPrice = item.quantity * item.price

    // console.log({ nonTaxable: item, discount: discount })


    if (item?.discountType === 'general') {
      if (item?.discountTypeName === "RATE") {

        totalPayable = +item.quantity * (+item.price - +item?.discount)

      } else {
        totalPayable = +item.quantity * (+item.price - +item?.discount)
      }

    } else {
      totalPayable = +item.quantity * +item.price
    }

    // totalPayable = parseInt(item.quantity) * item.price

    // console.log({ totalPayable, number: +item.quantity });



    return (obj = {
      isINC: false,
      taxable: false,
      discount: Number(discount),
      itemCode: item.itemCode,
      itemName: item.itemName,
      quantity: Number(item.quantity),
      price: Number(item.price),
      taxableAmount: Number(item.quantity) * Number(item.price),
      nhil: 0,
      getf: 0,
      covid: 0,
      otherLevies: item?.otherLevies,
      vatItemId: item.vatItemId,
      vatableAmt,
      vat,
      totalPayable,
      isTaxable: false,
    })
  } else {
    // console.log({ Taxable: item, discount: discount })
    if (!item?.isTaxInclusive) {
      //calculating itme with tax exclusive price

      //   totalPayable = 0
      let netPrice = 0

      if (item?.discountType === 'general') {
        netPrice = item.quantity * (item.price - +item?.discount)
      } else {
        netPrice = item.quantity * item.price
      }


      const nhil = NHIL_LEVY * netPrice
      const getf = GETFUND_LEVY * netPrice
      const covid = COVID_LEVY * netPrice


      if (item?.otherLevies === "NON") {
        // console.log({ lavyType: item?.otherLevies, discount })
        vatableAmt = netPrice + nhil + getf + covid
        vat = VAT_LEVY * vatableAmt
        totalPayable = vat + vatableAmt - discount
      } else if (item?.otherLevies === "CST") {
        // console.log({ lavyType: item?.otherLevies, discount })
        csttourism = CST_LEVY * netPrice
        vatableAmt = netPrice + nhil + getf + covid + csttourism
        vat = VAT_LEVY * vatableAmt


        if (item?.discountType === 'general') {
          // netPrice = item.quantity * (item.price - +item?.discount)
          totalPayable = vat + vatableAmt - discount - +item?.discount
        } else {
          totalPayable = vat + vatableAmt - discount
        }

        // console.log({ csttourism, vatableAmt, vat, totalPayable })
        // return
      } else if (item?.otherLevies === "TRSM") {
        // console.log({ lavyType: item?.otherLevies, discount })
        csttourism = TOUR_LEVY * netPrice
        vatableAmt = netPrice + nhil + getf + covid
        vat = VAT_LEVY * vatableAmt

        totalPayable = vatableAmt + vat + csttourism - discount
      } else {
        // console.log({ lavyType: item?.otherLevies, discount })
        vatableAmt = netPrice + nhil + getf + covid
        vat = VAT_LEVY * vatableAmt
        totalPayable = vat + vatableAmt
      }

      return (obj = {
        isINC: false,
        isTaxInclusive: false,
        taxable: isTaxable,
        discount: Number(discount),
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: Number(item.quantity),
        price: Number(item.price),
        taxableAmount: netPrice,
        nhil,
        getf,
        covid,
        otherLevies: csttourism,
        vatItemId: item.vatItemId,
        vatableAmt,
        vat,
        totalPayable,
        isTaxable,
      })


    } else if (item?.isTaxInclusive) {
      isINC = true
      let exclusivePrice = 0
      if (item?.otherLevies === "CST") {
        exclusivePrice =
          item?.price /
          ((1 + NHIL_LEVY + COVID_LEVY + CST_LEVY + GETFUND_LEVY) *
            (1 + VAT_LEVY))
      } else if (item?.otherLevies === "TRSM") {

        const trsmWithVat = (((nhilRate + getfundRate + covidRate + 100) / 100 * (vatRate / 100)) + (nhilRate + getfundRate + covidRate + tourismRate + 100) / 100);
        exclusivePrice = item?.price / trsmWithVat

      } else {
        exclusivePrice = item?.price / ((1 + NHIL_LEVY + COVID_LEVY + GETFUND_LEVY) * (1 + VAT_LEVY))
      }



      if (item?.discountType === 'general') {

        exclusivePrice = (exclusivePrice - +item?.discount) * item?.quantity
      } else {
        exclusivePrice = exclusivePrice * item?.quantity
      }

      const nhil = NHIL_LEVY * exclusivePrice
      const getf = GETFUND_LEVY * exclusivePrice
      const covid = COVID_LEVY * exclusivePrice

      if (item?.otherLevies === "NON" || item?.otherLevies === "") {
        vatableAmt = exclusivePrice + nhil + getf + covid
        vat = VAT_LEVY * vatableAmt
        totalPayable = vat + vatableAmt - discount
      } else if (item?.otherLevies === "CST") {
        csttourism = CST_LEVY * exclusivePrice
        vatableAmt = exclusivePrice + nhil + getf + covid + csttourism
        vat = VAT_LEVY * vatableAmt
        totalPayable = vat + vatableAmt - discount

        // console.log({ csttourism, vatableAmt, vat, totalPayable })
        // return
      } else if (item?.otherLevies === "TRSM") {
        csttourism = TOUR_LEVY * exclusivePrice
        vatableAmt = exclusivePrice + nhil + getf + covid
        vat = VAT_LEVY * vatableAmt

        totalPayable = vatableAmt + vat + csttourism - discount

        console.log({ exclusivePrice, totalPayable })
      }

      return (obj = {
        isINC: true,
        isTaxInclusive: true,
        taxable: isTaxable,
        discount: Number(discount),
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: Number(item.quantity),
        price: Number(item.price),
        taxableAmount: exclusivePrice,
        nhil,
        getf,
        covid,
        otherLevies: csttourism,
        vatItemId: item.vatItemId,
        vatableAmt,
        vat,
        totalPayable,
        isTaxable,
      })
    }
  }

  //   if (!item?.isTaxInclusive) {
  //     obj = {
  //       taxable: isTaxable,
  //       discount: Number(discount),
  //       itemCode: item.itemCode,
  //       itemName: item.itemName,
  //       quantity: Number(item.quantity),
  //       price: Number(item.price),
  //       taxableAmount: item.quantity * item.price,
  //       nhil: NHIL_LEVY * item.quantity * item.price,
  //       getf: GETFUND_LEVY * item.quantity * item.price,
  //       covid: COVID_LEVY * item.quantity * item.price,
  //       otherLevies: csttourism,
  //       vatItemId: item.vatItemId,
  //     }
  //     if (isTaxable) {
  //       vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid
  //       vat = VAT_LEVY * vatableAmt

  //       //   alert(vat);

  //       //checking for cst conditions
  //       if (csttourism > 0) {
  //         cstTaxableAmount =
  //           obj.nhil + obj.covid + obj.getf + obj.otherLevies + obj.taxableAmount
  //         vat = VAT_LEVY * cstTaxableAmount
  //         totalPayable = cstTaxableAmount + vat - obj.discount
  //       } else {
  //         totalPayable = vatableAmt + vat + obj.otherLevies - obj.discount
  //       }
  //     } else {
  //       obj.nhil = 0
  //       obj.getf = 0
  //       obj.covid = 0
  //       vatableAmt = obj.taxableAmount
  //       // vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid
  //       totalPayable = vatableAmt - obj.discount
  //     }
  //   } else {
  //     isINC = true
  //     let exclusivePrice = 0;
  //     if (item?.otherLevies === "CST") {
  //       exclusivePrice =
  //         item?.price /
  //         ((1 + NHIL_LEVY + COVID_LEVY + CST_LEVY + GETFUND_LEVY) *
  //           (1 + VAT_LEVY))
  //     } else if (item?.otherLevies === "TRSM") {
  //       exclusivePrice =
  //         item?.price /
  //         ((1 + NHIL_LEVY + COVID_LEVY + TOUR_LEVY + GETFUND_LEVY) *
  //           (1 + VAT_LEVY))
  //     } else {
  //       exclusivePrice =
  //         item?.price /
  //         ((1 + NHIL_LEVY + COVID_LEVY + GETFUND_LEVY) * (1 + VAT_LEVY))
  //     }

  //     const nhil = NHIL_LEVY * exclusivePrice
  //     const getf = GETFUND_LEVY * exclusivePrice
  //     const covid = COVID_LEVY * exclusivePrice

  //     //taxableAmount as vatableAmount
  //     let vatableAmount = exclusivePrice + nhil + getf + covid + csttourism

  //     obj = {
  //       discount: Number(discount) || 0,
  //       itemCode: item.itemCode, //'ITM' + Math.floor(Math.random() * 1000 + 1),
  //       itemName: item.itemName,
  //       quantity: Number(item.quantity),
  //       price: Number(item.price),
  //       nhil,
  //       getf,
  //       covid,
  //       otherLevies: csttourism,
  //       vatItemId: item.vatItemId,
  //       taxableAmount: vatableAmount,
  //     }

  //     // obj = {
  //     //   discount: Number(discount) || 0,
  //     //   itemCode: item.itemCode, //'ITM' + Math.floor(Math.random() * 1000 + 1),
  //     //   itemName: item.itemName,
  //     //   quantity: Number(item.quantity),
  //     //   price: Number(item.price),

  //     //   nhil: NHIL_LEVY * ((item.quantity * item.price * 100) / 121.9),
  //     //   getf: GETFUND_LEVY * ((item.quantity * item.price * 100) / 121.9),
  //     //   covid: COVID_LEVY * ((item.quantity * item.price * 100) / 121.9),
  //     //   otherLevies: csttourism,
  //     //   vatItemId: item.vatItemId,
  //     //   // taxableAmount: (item.quantity * item.price * 100) / 121.9,
  //     //   taxableAmount: (item.quantity * item.price * 100) / 121.9,
  //     // };

  //     if (isTaxable) {
  //     //   vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid
  //       vat = VAT_LEVY * vatableAmount

  //       let inclusiveAmt = item.quantity * item.price

  //       //checking for cst conditions
  //       if (csttourism > 0) {
  //         //re-calculate all levies in reverse
  //         obj.taxableAmount = (item.quantity * item.price * 100) / 127.65
  //         csttourism = CST_LEVY * obj.taxableAmount
  //         obj.nhil = NHIL_LEVY * ((item.quantity * item.price * 100) / 127.65)
  //         obj.getf = GETFUND_LEVY * ((item.quantity * item.price * 100) / 127.65)
  //         obj.covid = COVID_LEVY * ((item.quantity * item.price * 100) / 127.65)
  //         obj.otherLevies = csttourism
  //         cstTaxableAmount =
  //           obj.nhil + obj.covid + obj.getf + obj.otherLevies + obj.taxableAmount
  //         vat = VAT_LEVY * cstTaxableAmount
  //         totalPayable = cstTaxableAmount + vat - obj.discount
  //       } else {
  //         totalPayable = inclusiveAmt - discount
  //       }
  //     } else {
  //       obj.nhil = 0
  //       obj.getf = 0
  //       obj.covid = 0
  //       vatableAmt = obj.taxableAmount
  //       // vatableAmt = obj.taxableAmount + obj.nhil + obj.getf + obj.covid
  //       totalPayable =
  //         obj.nhil + obj.covid + obj.getf + obj.otherLevies + obj.taxableAmount
  //     }
  //   }

  //   alert(vat);

  //   return {
  //     ...obj,
  //     vatableAmt,
  //     vat,
  //     totalPayable,
  //     isINC,
  //     isTaxable,
  //   }
}

export const moneyInTxt = (value, standard, dec = 0) => {
  let nf = new Intl.NumberFormat(standard, {
    minimumFractionDigits: dec,
    maximumFractionDigits: 2,
  })
  return nf.format(Number(value) ? value : 0.0)
}

// export function getFormattedDate(dateObj) {

//   let month = dateObj.getUTCMonth() + 1; //months from 1-12
//   let day = dateObj.getUTCDate();
//   let year = dateObj.getUTCFullYear();
//   return year + "-" + month + "-" + day;
// }


export function getFormattedDate(date) {
  // if (!(date instanceof Date)) {
  //   throw new Error('Invalid date object');
  // }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day

  return `${year}-${month}-${day}`;
}



const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }

export const convertDate = (utcString) => {

  return !utcString

    ? ''

    : new Date(utcString).toUTCString('en-US', dateOptions).substring(5, 16)

}


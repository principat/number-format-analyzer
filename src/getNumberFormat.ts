export interface NumberFormat {
  // the maximum count of numbers after the decimal separator 
  fractionalLength: number,
  // the maximum count of numbers before the decimal separator
  integerLength: number,
  // the total number of characters needed to format the number
  totalLength: number
}

const DECIMAL_SEPARATOR = '.';
const DECIMAL_SEPARATOR_LENGTH = DECIMAL_SEPARATOR.length;

/**
 * calculates the length needed to list all value aligned at the 
 * decimal separator
 * 
 * @param numberFormat the number format of the list
 * @param the length needed to show all numbers aligned at the 
 * decimal separator
 */
function _getTotalLength(numberFormat: NumberFormat): number {
  let decimalSeparatorLength = DECIMAL_SEPARATOR_LENGTH;
  if (numberFormat.fractionalLength == 0) {
    // there is no DECIMAL_SEPARATOR needed
    decimalSeparatorLength = 0;
  }
  return numberFormat.integerLength + decimalSeparatorLength + numberFormat.fractionalLength;
}


/**
 * gets the max length the numbers parts (integer/fraction) in the list,
 * needed to output the at console as table
 * 
 * @param numberValues the list of numbers to be analysed
 * @returns the number format description,
 */
export function getNumberFormat(numberValues: number[]): NumberFormat {
  const numberFormat: NumberFormat = {
    integerLength: 0,
    fractionalLength: 0,
    /** the getter allows to change the fractional length */
    get totalLength() { return _getTotalLength(numberFormat); }
  };

  numberValues.forEach((numberValue: number) => {
    const numberString: string = numberValue.toString();
    const [mantissa, exponent] = numberString.split('e');
    const [integerPart = '', fractionalPart = ''] = mantissa.split(DECIMAL_SEPARATOR);

    let fractionDigitCount = fractionalPart.length;
    let integerDigitCount = integerPart.length;
    if (exponent !== undefined) {
      const exponentNum = parseInt(exponent);
      if (exponentNum < 0) {
        const exponentFractionLength = fractionDigitCount + -1 * exponentNum;
        numberFormat.fractionalLength = Math.max(numberFormat.fractionalLength, exponentFractionLength);
      }
    }
    numberFormat.integerLength = Math.max(numberFormat.integerLength, integerDigitCount);
    numberFormat.fractionalLength = Math.max(numberFormat.fractionalLength, fractionDigitCount);
  });

  return numberFormat;
}


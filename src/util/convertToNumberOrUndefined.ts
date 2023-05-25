export function convertToNumberOrUndefined(s: string){
  // empty string will become a 0 when using Number("") which we don't want.
  if(!s.length){
    return undefined
  }
  const number = Number(s)
  if(isNaN(number)){
    return undefined
  } else return number
}
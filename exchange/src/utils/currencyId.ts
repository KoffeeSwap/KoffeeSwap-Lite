import { Currency, KCS, Token } from '@koffeeswap/sdk'

export function currencyId(currency: Currency): string {
  if (currency === KCS) return 'KCS'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

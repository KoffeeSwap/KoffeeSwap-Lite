import { ChainId, Currency, currencyEquals, JSBI, Price, WKCS } from '@koffeeswap/sdk'
import { useMemo } from 'react'
import { USDT } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in USDT of the input currency
 * @param currency currency to compute the USDT price of
 */
export default function useUSDTPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WKCS[chainId], wrapped) ? undefined : currency,
        chainId ? WKCS[chainId] : undefined
      ],
      [chainId && wrapped?.equals(USDT[chainId]) ? undefined : wrapped, chainId === ChainId.MAINNET ? USDT[chainId] : undefined],
      [chainId ? WKCS[chainId] : undefined, chainId === ChainId.MAINNET ? USDT[chainId] : undefined]
    ],
    [chainId, currency, wrapped]
  )
  const [[kcsPairState, kcsPair], [usdtPairState, usdtPair], [usdtEthPairState, usdtEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle wkcs/kcs
    if (wrapped.equals(WKCS[chainId])) {
      if (usdtPair) {
        const price = usdtPair.priceOf(WKCS[chainId])
        return new Price(currency, USDT[chainId], price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdt
    if (wrapped.equals(USDT[chainId])) {
      return new Price(USDT[chainId], USDT[chainId], '1', '1')
    }

    const kcsPairKCSAmount = kcsPair?.reserveOf(WKCS[chainId])
    const kcsPairKCSUSDTValue: JSBI =
      kcsPairKCSAmount && usdtEthPair ? usdtEthPair.priceOf(WKCS[chainId]).quote(kcsPairKCSAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the usdt pair
    if (usdtPairState === PairState.EXISTS && usdtPair && usdtPair.reserveOf(USDT[chainId]).greaterThan(kcsPairKCSUSDTValue)) {
      const price = usdtPair.priceOf(wrapped)
      return new Price(currency, USDT[chainId], price.denominator, price.numerator)
    }
    if (kcsPairState === PairState.EXISTS && kcsPair && usdtEthPairState === PairState.EXISTS && usdtEthPair) {
      if (usdtEthPair.reserveOf(USDT[chainId]).greaterThan('0') && kcsPair.reserveOf(WKCS[chainId]).greaterThan('0')) {
        const kcsUsdcPrice = usdtEthPair.priceOf(USDT[chainId])
        const currencyEthPrice = kcsPair.priceOf(WKCS[chainId])
        const usdtPrice = kcsUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, USDT[chainId], usdtPrice.denominator, usdtPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, kcsPair, kcsPairState, usdtEthPair, usdtEthPairState, usdtPair, usdtPairState, wrapped])
}
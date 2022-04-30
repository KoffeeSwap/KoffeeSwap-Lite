import { ChainId, Currency, KCS, Token } from '@koffeeswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import KcsLogo from '../../assets/images/kcs-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

export const TOKEN_ASSET_DIR: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'mainnet',
  [ChainId.TESTNET]: 'testnet'
}

export const getTokenLogoURL = (address: string, chainId: ChainId) => 
  `https://raw.githubusercontent.com/KoffeeSwap/kcc-assets/main/${TOKEN_ASSET_DIR[chainId]}/tokens/${address}/logo.png`

const StyledKcsLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === KCS) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address, currency.chainId)]
      }
      return [getTokenLogoURL(currency.address, currency.chainId)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === KCS) {
    return <StyledKcsLogo src={KcsLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { KCS, JSBI, TokenAmount, Fraction } from '@koffeeswap/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/brew/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePair } from '../../data/Reserves'
import { BIG_INT_SECONDS_IN_WEEK, KOFFEE_TOKEN } from '../../constants'
import { Countdown } from 'pages/Brew/Countdown'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%, ${showBackground ? theme.black : theme.bg5} 100%) `};
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};
`

const AlignRight = styled.span`
  text-align: right;
`

export default function PoolCard({ stakingInfo, koffeePrice, kcsPrice, advanced }: { stakingInfo: StakingInfo, koffeePrice: string, kcsPrice: string, advanced: boolean }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))
  {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
  // get the color of the token
  const token = currency0 === KCS ? token1 : token0
  const WKCS = currency0 === KCS ? token0 : token1
  const KOFFEE = currency0 == unwrappedToken(KOFFEE_TOKEN[stakingInfo.chainId]) ? token0 : token1
  const backgroundColor = useColor(token)

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token)
  const [, stakingTokenPair] = usePair(...stakingInfo.tokens)

  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInWKCS: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair) {
    // take the total amount of LP tokens staked, multiply by KCS value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWKCS = new TokenAmount(
      WKCS,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WKCS).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WKCS they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }

  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInKOFFEE: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair) {
    // take the total amount of LP tokens staked, multiply by KCS value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInKOFFEE = new TokenAmount(
      KOFFEE,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(KOFFEE).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WKCS they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }
 
  const kcsPriceNumber = parseFloat(kcsPrice)
  const koffeePriceNumber = parseFloat(koffeePrice)
  const valueOfTotalStakedAmountInUSD = !valueOfTotalStakedAmountInWKCS || !valueOfTotalStakedAmountInKOFFEE
    ? 0 
    : stakingInfo.isKoffeePair
      ? parseFloat(valueOfTotalStakedAmountInKOFFEE?.toExact()) * koffeePriceNumber
      : parseFloat(valueOfTotalStakedAmountInWKCS?.toExact()) * kcsPriceNumber
  //const percentOfPersonalStake = !stakingInfo.totalStakedAmount || !stakingInfo.stakedAmount ? 0 : parseFloat(JSBI.divide(stakingInfo.stakedAmount.raw, stakingInfo.totalStakedAmount.raw).toString())
  const percentOfPersonalStake = parseInt(stakingInfo.stakedAmount.raw.toString()) / parseInt(stakingInfo.totalStakedAmount.raw.toString())
  const valueOfPersonalStakeInUSD = !isStaking ? 0 : valueOfTotalStakedAmountInUSD * percentOfPersonalStake
  const yearlyTotalRewardOutputValueUSD = parseFloat(stakingInfo.totalRewardRate.toExact()) * parseFloat(koffeePrice) * 60 * 60 * 24 * 365.25
  const apr = valueOfTotalStakedAmountInUSD > 0 ? yearlyTotalRewardOutputValueUSD / valueOfTotalStakedAmountInUSD : 0

  const end = stakingInfo.periodFinish ? Math.floor(stakingInfo.periodFinish.getTime() / 1000) : 0
  const time = Math.floor(Date.now() / 1000)
  const timeUntilEnd = end - time

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <CardBGImage desaturate />
      <CardNoise />

      <TopSection>
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
        <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
          {currency0.symbol}-{currency1.symbol}
        </TYPE.white>

        <StyledInternalLink to={`/brew/${currencyId(currency0)}/${currencyId(currency1)}`} style={{ width: '100%' }}>
          <ButtonPrimary padding="8px" borderRadius="8px">
            {isStaking ? 'Manage' : 'Deposit'}
          </ButtonPrimary>
        </StyledInternalLink>
      </TopSection>

      <StatContainer>
        <RowBetween>
          <TYPE.white>Total value of staked LPs</TYPE.white>
          <TYPE.white>
            ${valueOfTotalStakedAmountInUSD.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}
          </TYPE.white>
        </RowBetween>
        
        {!advanced ? null : (
          <RowBetween>
            <TYPE.white>Brew reward rate</TYPE.white>
            <TYPE.white textAlign="right">
              {stakingInfo
                ? stakingInfo.active
                  ? `${stakingInfo.totalRewardRate
                      ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                      ?.toFixed(0, { groupSeparator: ',' })} KOFFEE / week`
                  : '0 KOFFEE / week'
                : '-'}
            </TYPE.white>
          </RowBetween>
        )}
                
        <RowBetween>
          <TYPE.black color={'white'} fontWeight={500}>
            <span>APR</span>
          </TYPE.black>
          <TYPE.black textAlign="right" color={'white'} fontWeight={500}>
            {timeUntilEnd > 0 ? `${(apr * 100).toFixed(2)}%` : 'Waiting for refill'}
          </TYPE.black>
        </RowBetween>

        {!advanced ? null : (
          <RowBetween>
            <TYPE.white>Brew time remaining</TYPE.white>
            <AlignRight><Countdown color="white" exactEnd={stakingInfo.periodFinish} /></AlignRight>
          </RowBetween>
        )}
      </StatContainer>

      {isStaking && (
        <>
          <Break />
          <StatContainer style={{marginTop: '0.75rem'}}>
            <RowBetween>
              <TYPE.black color={'white'} fontWeight={500}>
                <span>Value of your stake</span>
              </TYPE.black>
              <TYPE.black textAlign="right" color={'white'} fontWeight={500}>
                ${valueOfPersonalStakeInUSD.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}
              </TYPE.black>
            </RowBetween>
            {timeUntilEnd > 0 && (
            <RowBetween>
              <TYPE.black color={'white'} fontWeight={500}>
                <span>Percent of brew</span>
              </TYPE.black>
              <TYPE.black textAlign="right" color={'white'} fontWeight={500}>
                {(percentOfPersonalStake * 100).toFixed(2)}%
              </TYPE.black>
            </RowBetween>
            )}
            {timeUntilEnd > 0 && (
              <RowBetween>
                <TYPE.black color={'white'} fontWeight={500}>
                  <span>Your brew rate</span>
                </TYPE.black>
                <TYPE.black textAlign="right" color={'white'} fontWeight={500}>
                  {stakingInfo
                    ? stakingInfo.active
                      ? `${stakingInfo.rewardRate
                          ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                          ?.toSignificant(4, { groupSeparator: ',' })} KOFFEE / week`
                      : '0 KOFFEE / week'
                    : '-'}
                </TYPE.black>
              </RowBetween>
            )}
            <RowBetween>
              <TYPE.black color={'white'} fontWeight={500}>
                <span>Unclaimed rewards</span>
              </TYPE.black>
              <TYPE.black textAlign="right" color={'white'} fontWeight={500}>
                {stakingInfo?.earnedAmount?.toFixed(6) ?? '0'} KOFFEE
              </TYPE.black>
            </RowBetween>
          </StatContainer>
        </>
      )}
    </Wrapper>
  )
}

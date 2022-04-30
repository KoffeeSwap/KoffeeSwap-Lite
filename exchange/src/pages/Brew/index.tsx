import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/brew/hooks'
import { TYPE } from '../../theme'
import PoolCard from '../../components/brew/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage, Break } from '../../components/brew/styled'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { JSBI, WKCS } from '@koffeeswap/sdk'
import { BIG_INT_ZERO, KOFFEE_TOKEN } from '../../constants'
import { OutlineCard } from '../../components/Card'
import { LiquidityTabs } from 'components/NavigationTabs'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useUSDTPrice from 'utils/useUSDTPrice'

const PageWrapper = styled(AutoColumn)`
  max-width: calc(640px + 2em);
  width: 100%;
  background-color: ${({ theme }) => theme.darkMode ? `rgba(0, 0, 0, 0.2)` : `rgba(255, 255, 255, 0.2)`};
  padding: 2em;
  border-radius: 1em;
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 640px;
    background-color: transparent;
    padding: 0;
  `};
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

export default function Brew() {
  const { chainId } = useActiveWeb3React()

  const koffeePrice = (chainId && useUSDTPrice(KOFFEE_TOKEN[chainId])?.toSignificant(6)) ?? '0';
  const kcsPrice = (chainId && useUSDTPrice(WKCS[chainId])?.toSignificant(6)) ?? '0';

  // staking info for connected account
  const stakingInfos = useStakingInfo()

  /**
   * only show staking cards with balance
   * @todo only account for this if rewards are inactive
   */
  const stakingInfosWithBalance = stakingInfos?.filter(s => JSBI.greaterThan(s.stakedAmount.raw, BIG_INT_ZERO))
  const stakingInfosWithoutBalance = stakingInfos.filter(s => s.periodFinish != undefined && JSBI.equal(s.stakedAmount.raw, BIG_INT_ZERO))

  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  const parsedQs = useParsedQueryString()
  const advanced = !!parsedQs?.advanced

  return (
    <PageWrapper gap="lg" justify="center">
      <LiquidityTabs active={'brew'} />
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Liquidity Mining</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                You supply the mugs, we supply the koffee! Deposit your liquidity provider tokens and receive KOFFEE as a reward.
                </TYPE.white>
              </RowBetween>{' '}
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            <OutlineCard>No Active Brews</OutlineCard>
          ) : (
            <>
            {stakingInfosWithBalance.length === 0 ? null : (
              <>
                <DataRow style={{ alignItems: 'baseline' }}>
                  <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Your Brews</TYPE.mediumHeader>
                </DataRow>
                {stakingInfosWithBalance?.map(stakingInfo => {
                  return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} kcsPrice={kcsPrice} koffeePrice={koffeePrice} advanced={advanced} />
                })}
                <Break />
              </>
            )}
            {stakingInfosWithoutBalance.length === 0 ? (
              <DataRow style={{ alignItems: 'baseline' }}>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>No Other Brews Available</TYPE.mediumHeader>
              </DataRow>
            ) : (
              <>
                <DataRow style={{ alignItems: 'baseline' }}>
                  <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Available Brews</TYPE.mediumHeader>
                </DataRow>
                {stakingInfosWithoutBalance?.map(stakingInfo => {
                  return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} kcsPrice={kcsPrice} koffeePrice={koffeePrice} advanced={advanced} />
                })}
              </>
            )}
            </>
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

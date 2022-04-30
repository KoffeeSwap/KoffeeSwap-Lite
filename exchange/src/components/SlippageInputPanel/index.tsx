import React, { useState, useRef, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { TYPE } from '../../theme'

import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

import { darken } from 'polished'


import { Text } from 'rebass'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSlippageMenu } from '../../state/application/hooks'
import { Settings } from 'react-feather'

const FancyButton = styled.button`
  color: ${({ theme }) => theme.text1};
  align-items: center;
  height: 2rem;
  border-radius: 36px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background: ${({ theme }) => theme.bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
`

const Option = styled(FancyButton)<{ active: boolean }>`
  margin-right: 8px;
  :hover {
    cursor: pointer;
  }
  background-color: ${({ active, theme }) => active && theme.primary1};
  color: ${({ active, theme }) => (active ? theme.white : theme.text1)};
`
const OptionCustom = styled(FancyButton)<{ active?: boolean; warning?: boolean }>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  margin-left: 8px;
  flex: 1;
  border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1}`};
  :hover {
    border: ${({ theme, active, warning }) =>
      active && `1px solid ${warning ? darken(0.1, theme.red1) : darken(0.1, theme.primary1)}`};
  }

  input {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 2rem;
  }
`

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`

const Input = styled.input`
  background: ${({ theme }) => theme.bg1};
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.text1)};
  text-align: right;
`

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text2};
  }

  :hover {
    opacity: 0.7;
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.secondary2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  bottom: 0rem;
  left: 100%;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
  `};
`
enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh'
}

interface SlippageInputPanelProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  compact?: boolean
}

export default function SlippageInputPanel({
  rawSlippage,
  setRawSlippage,
  compact = false
}: SlippageInputPanelProps) {
  const theme = useContext(ThemeContext)

  const inputRef = useRef<HTMLInputElement>()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SLIPPAGE)
  const toggle = useToggleSlippageMenu()

  const [slippageInput, setSlippageInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch {}
  }

  const ManualInput = (
    <RowFixed>
        {!!slippageInput &&
        (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
        <SlippageEmojiContainer>
            <span role="img" aria-label="warning">
            ⚠️
            </span>
        </SlippageEmojiContainer>
        ) : null}
        <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
            Slippage:
        </TYPE.black>
        <OptionCustom active={![10, 50, 100, 200, 300, 500, 1000, 2500, 5000].includes(rawSlippage)} warning={!slippageInputIsValid} tabIndex={-1}>
        <RowBetween>
            {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
            <Input
                ref={inputRef as any}
                key={`expertSI`}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                    parseCustomSlippage((rawSlippage / 100).toFixed(2))
                }}
                onChange={e => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? 'red' : ''}
            />
            %
        </RowBetween>
        </OptionCustom>
    </RowFixed>
    )

  function SlippageButton(percent: number){
      return (
        <Option
            onClick={() => {
                setSlippageInput('')
                setRawSlippage(percent * 100)
            }}
            active={rawSlippage === percent * 100}
        >
            {percent}%
        </Option>
      )
  }

  function SlippageButtons() {

    return (
        <AutoColumn justify="space-between">
            <RowBetween>
                {SlippageButton(0.1)}
                {SlippageButton(0.5)}
                {SlippageButton(1)}
            </RowBetween>
            <RowBetween>
                {SlippageButton(2)}
                {SlippageButton(3)}
                {SlippageButton(5)}
            </RowBetween>
            <RowBetween>
                {SlippageButton(10)}
                {SlippageButton(25)}
                {SlippageButton(50)}
            </RowBetween>
        </AutoColumn>
    )
  }

  return (
    <>
    {compact ? (
        <StyledMenu ref={node as any}>
        {ManualInput}
        <StyledMenuButton onClick={toggle} id="open-slippage-dialog-button">
            <StyledMenuIcon />
        </StyledMenuButton>
        {open && (
            <MenuFlyout>
                <AutoColumn gap="md" style={{ padding: '1rem' }}>
                    <Text fontWeight={600} fontSize={14}>
                        Slippage
                    </Text>
                    <SlippageButtons />
                </AutoColumn>
            </MenuFlyout>
        )}
        </StyledMenu>
    ) : (
        <AutoColumn gap="sm">
            {ManualInput}
            <SlippageButtons />
        </AutoColumn>
    )}    
    </>
  )
}

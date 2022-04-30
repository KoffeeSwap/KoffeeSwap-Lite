//import React, { useState, useRef, useContext } from 'react'
import React, { useState, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { TYPE } from '../../theme'

import Grid, { GridCell } from '../Grid'
import { darken } from 'polished'
import Toggle from '../Toggle'
import { useUserSingleHopOnly, useUserSwapConfirmations } from '../../state/user/hooks'
import ReactGA from 'react-ga'

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

// const Option = styled(FancyButton)<{ active: boolean }>`
//   margin-right: 8px;
//   :hover {
//     cursor: pointer;
//   }
//   background-color: ${({ active, theme }) => active && theme.primary1};
//   color: ${({ active, theme }) => (active ? theme.white : theme.text1)};
// `
const OptionCustom = styled(FancyButton)<{ active?: boolean; warning?: boolean }>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
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
enum DeadlineError {
  InvalidInput = 'InvalidInput'
}

interface AdvancedSettingsPanelProps {
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function AdvancedSettingsPanel({
  deadline,
  setDeadline
}: AdvancedSettingsPanelProps) {
  const theme = useContext(ThemeContext)

  //const inputRef = useRef<HTMLInputElement>()

  const [deadlineInput, setDeadlineInput] = useState('')

  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput
  
  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
      deadlineError = DeadlineError.InvalidInput
    } else {
        deadlineError = undefined
    }
    
    function parseCustomDeadline(value: string) {
        setDeadlineInput(value)
        
        try {
            const valueAsInt: number = Number.parseInt(value) * 60
            if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
                setDeadline(valueAsInt)
            }
        } catch {}
    }
    
    const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
    
    const [swapConfirmations, setSwapConfirmations] = useUserSwapConfirmations()

    return (
        <Grid gap="6px" template='
            "dl dl do do do do" 1fr
            "hl hl hl hl ho ho" 1fr
            "cl cl cl cl co co" 1fr
            / 1fr 1fr 1fr 1fr 1fr 1fr
        '>
            <GridCell area="dl">
                <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    Deadline:
                </TYPE.black>
            </GridCell>
            <GridCell area="do">
                <OptionCustom style={{ width: '80px' }} tabIndex={-1}>
                    <Input
                        color={!!deadlineError ? 'red' : undefined}
                        onBlur={() => {
                        parseCustomDeadline((deadline / 60).toString())
                        }}
                        placeholder={(deadline / 60).toString()}
                        value={deadlineInput}
                        onChange={e => parseCustomDeadline(e.target.value)}
                    />
                </OptionCustom>
                <TYPE.body style={{ paddingLeft: '8px' }} display="inline" fontSize={14}>
                    minutes
                </TYPE.body>
            </GridCell>
            <GridCell area="hl">
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                    Disable Multihops:
                </TYPE.black>
            </GridCell>
            <GridCell area="ho">
                <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => {
                    ReactGA.event({
                    category: 'Routing',
                    action: singleHopOnly ? 'disable single hop' : 'enable single hop'
                    })
                    setSingleHopOnly(!singleHopOnly)
                }}
                />
            </GridCell>
            <GridCell area="cl">
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                    Disable Confirmation:
                </TYPE.black>
            </GridCell>
            <GridCell area="co">
                <Toggle
                id="toggle-disable-confirmation-button"
                isActive={!swapConfirmations}
                toggle={() => {
                    ReactGA.event({
                    category: 'Routing',
                    action: swapConfirmations ? 'disable confirmations' : 'enable confirmations'
                    })
                    setSwapConfirmations(!swapConfirmations)
                }}
                />
            </GridCell>
        </Grid>
    )
}

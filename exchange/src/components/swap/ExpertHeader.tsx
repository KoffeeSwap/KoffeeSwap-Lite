import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'

const StyledExpertHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 530px;
  color: ${({ theme }) => theme.text2};
`

export default function ExpertHeader() {
  return (
    <StyledExpertHeader>
      <RowBetween>
        <TYPE.black fontWeight={500}>Expert Swap</TYPE.black>
      </RowBetween>
    </StyledExpertHeader>
  )
}

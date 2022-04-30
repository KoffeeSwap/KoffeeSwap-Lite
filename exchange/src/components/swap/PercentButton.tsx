import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'

const StyledPercent = styled.button<{ 
    bgColor:string,
    borderColor:string,
    textColor:string,
    bgColorActive:string,
    borderColorActive:string,
    textColorActive:string,
    stretch:boolean
}>`
  height: 28px;
  background-color: ${({bgColor}) => bgColor};
  border: 1px solid ${({borderColor}) => borderColor};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  ${({ stretch }) => stretch ? 'width: 100%;' : ''};
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    background-color: ${({bgColorActive}) => bgColorActive};
    border: 1px solid ${({borderColorActive}) => borderColorActive};
  }
  :focus {
    background-color: ${({bgColorActive}) => bgColorActive};
    border: 1px solid ${({borderColorActive}) => borderColorActive};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

export class PercentButtonTheme{
    bgColor: string
    borderColor: string
    textColor: string
    bgColorActive :string
    borderColorActive :string
    textColorActive :string

    constructor(
        bgColor?: string,
        borderColor?: string,
        textColor?: string,
        bgColorActive? :string,
        borderColorActive? :string,
        textColorActive? :string,
    ){
        const theme = useTheme();

        this.bgColor = bgColor ? bgColor : theme.primary5;
        this.borderColor = borderColor ? borderColor : theme.primary5;
        this.textColor = textColor ? textColor : theme.primaryText1;
        this.bgColorActive = bgColorActive ? bgColorActive : theme.primary1;
        this.borderColorActive = borderColorActive ? borderColorActive : theme.primary1;
        this.textColorActive = textColorActive ? textColorActive : theme.primaryText1;
    }

}

interface PercentButtonProps {
    value: number,
    clickHandler: (value: number) => void
    stretch?: boolean
    theme?: PercentButtonTheme
}

export default function PercentButton({
    value,
    clickHandler,
    stretch,
    theme
}: PercentButtonProps) {
    if (!theme) theme = new PercentButtonTheme()
    return (
        <StyledPercent
            bgColor={theme.bgColor}
            borderColor={theme.borderColor}
            textColor={theme.textColor}
            bgColorActive={theme.bgColorActive}
            borderColorActive={theme.borderColorActive}
            textColorActive={theme.textColorActive}
            stretch={stretch ?? false}
            onClick={() => clickHandler(value)}
        >
            {value}%
        </StyledPercent>
    )
}
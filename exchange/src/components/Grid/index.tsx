import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Grid = styled(Box)<{
    template: string
    gap?: string
    width?: string
    align?: string
    margin?: string
    padding?: string
    border?: string
    borderRadius?: string
}>`
    width: ${({ width }) => width ?? '100%'};
    display: grid;
    grid-template: ${({template}) => template};
    grid-gap: ${({gap}) => gap ?? `0px`};
    margin: ${({ margin }) => margin ?? '0px'};
    padding: ${({ padding }) => padding ?? '0px'};
    align-items: ${({ align }) => align ?? 'center'};
    border: ${({ border }) => border};
    border-radius: ${({ borderRadius }) => borderRadius};
`
export const GridCell = styled(Box)<{
    area?: string
}>`
    grid-area: ${({area}) => area};
`

export default Grid

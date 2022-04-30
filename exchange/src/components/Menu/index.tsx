import React, { useRef } from 'react'
import { BookOpen, Code, DollarSign, Info, MessageCircle, Twitter } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import useTheme from 'hooks/useTheme'
import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(Info)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.darkMode ? '#ffffff20' : '#ffffffa0'};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.darkMode ? '#ffffff40' : '#ffffff'};
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
  min-width: 9rem;
  background-color: ${({ theme }) => theme.darkMode ? '#45534d' : '#d7f0eb'};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 42px;
  right: 0rem;
  z-index: 100;
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -222px;
    background-color: ${({ theme }) => theme.darkMode ? '#615668' : '#f8f2f5'};
  `};
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

export default function Menu() {
  const { account } = useActiveWeb3React()
  
  const theme = useTheme()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)  
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <Info color={theme.text1} />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem id="info-docs-link" href="https://docs.koffeeswap.finance">
            <BookOpen size={14} />
            Docs
          </MenuItem>
          <MenuItem id="info-github-link" href={"https://github.com/KoffeeSwap"}>
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem id="info-telegram-link" href="https://t.me/koffeeswap">
            <MessageCircle size={14} />
            Telegram
          </MenuItem>
          <MenuItem id="info-twitter-link" href="https://twitter.com/koffeeswap">
            <Twitter size={14} />
            Twitter
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}

import React, { useRef } from 'react'
import { Menu } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import useTheme from 'hooks/useTheme'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const StyledMenuButton = styled.button`
  width: 100%;
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
    background-color: ${({ theme }) => theme.darkMode ? '#ffffff40' : '#ffffff'};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  margin-right: 0.75rem;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: flex;
  `};
`

const MenuWrapper = styled.span`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 64px);
  z-index: 100;
`
  
const MenuFlyout = styled.span`
  background: linear-gradient(to bottom, ${({ theme }) => `${theme.bg2} ${theme.darkMode ? '-25%, #190e1f' : '-50%, #ffffff'}`});
  background-size: 200%;
  box-shadow: 7px -7px 8px ${({ theme }) => theme.darkMode ? '#000000' : '#404040'};
  border-top-right-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1.25rem;
  width: 200px;
  position: absolute;
  bottom: 0;
  z-index: 101;
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  flex: 1;
  padding: 1rem 1rem;
  color: ${({ theme }) => theme.text2};
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
  }
  > svg {
    margin-right: 8px;
  }
  
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }
`

const StyledExpertLink = styled(StyledNavLink)`
  @media (max-width: 539px) {
    display: none;
  }
`

export default function NavMenu() {
  const { chainId } = useActiveWeb3React()
  
  const { t } = useTranslation()
  const theme = useTheme()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.NAVMENU)
  const toggle = useToggleModal(ApplicationModal.NAVMENU)  

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <Menu color={theme.text1} />
      </StyledMenuButton>

      {open && (
        <MenuWrapper onClick={toggle}>
          <MenuFlyout>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            Classic
          </StyledNavLink>
          <StyledExpertLink id={`expert-nav-link`} to={'/expert'}>
            Expert
          </StyledExpertLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('pool')}
          </StyledNavLink>
          <StyledNavLink id={`brew-nav-link`} to={'/brew'}>
            Brew
          </StyledNavLink>
          </MenuFlyout>
        </MenuWrapper>
      )}
    </StyledMenu>
  )
}

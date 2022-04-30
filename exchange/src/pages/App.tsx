import React, { Suspense } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure, RedirectToAddLiquidity} from './AddLiquidity/redirects'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Expert from './Expert'
import { RedirectToExpert } from './Expert/redirects'
import Footer from 'components/Pro/ProFooter'
import Header from 'components/Pro/ProHeader'
import Brew from './Brew'
import ManageBrew from './Brew/Manage'

const DefaultAppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  height: 100%;
  background: linear-gradient(to bottom, ${({ theme }) => `${theme.bg2}, ${theme.darkMode ? '#190e1f' : '#ffffff 90%'}`});
`

function IsProInterface(): boolean{
  const location = useLocation();
  return location.pathname === "/pro" || location.pathname.startsWith("/pro/")
}

function IsHome(): boolean{
  const location = useLocation();
  return location.pathname === "/"
}

function AppWrapper({ children }: { children: JSX.Element[] }){
  let elementsToStyle: HTMLElement[] = [document.documentElement, document.body]
  
  let rootDiv = document.getElementById("root");
  if (rootDiv) elementsToStyle.push(rootDiv);
  
  elementsToStyle.forEach(element => element.style.height = "100%");
  
  return (<DefaultAppWrapper>{children}</DefaultAppWrapper>)
}

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const FooterWrapper = styled.div`
  display: none;
  width: 100%;
  justify-content: space-between;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    ${({ theme }) => theme.flexRowNoWrap}
  `};
`

const ProBodyWrapper = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
`

const HomeBodyWrapper = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  
  @media (max-width: 715px), (max-height: 768px) {
    overflow-y: auto;
  }
`

const DefaultBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 50px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

function BodyWrapper({ children }: { children: JSX.Element[] }){
  if (IsProInterface()){
    return (<ProBodyWrapper>{children}</ProBodyWrapper>)
  }else if(IsHome()){
    return (<HomeBodyWrapper>{children}</HomeBodyWrapper>)
  }else{
    return (<DefaultBodyWrapper>{children}</DefaultBodyWrapper>)
  }
}

const Marginer = styled.div`
  margin-top: 5rem;
`
export default function App() {
  return (
    <Suspense fallback={null}>
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/expert" component={Expert} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/expert/:outputCurrency" component={RedirectToExpert} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/brew" component={Brew} />
              <Route exact strict path="/brew/:currencyIdA/:currencyIdB" component={ManageBrew} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </AppWrapper>
    </Suspense>
  )
}

import { ChainId, JSBI, Percent, Token, WKCS } from '@koffeeswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, walletconnect } from '../connectors'

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
    [ChainId.MAINNET]: '0xc0fFee0000C824D24E0F280f1e4D21152625742b',
    [ChainId.TESTNET]: '0xc0fFee0000C824D24E0F280f1e4D21152625742b'
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dead'

export const KOFFEE_KCS_PAIR_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xe95C9f40F3Bffa2ADe0fC274EF97b8e1138B2eFf',
  [ChainId.TESTNET]: '0x9c0955970CF1B1e4832Abbf8c594fB44dab0e92F'
}

export const KOFFEE_KCS_PAIR_BASE: { [chainId in ChainId]: number } = {
  [ChainId.MAINNET]: 0,
  [ChainId.TESTNET]: 1
}

export const KOFFEE_TOKEN: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xc0ffeE0000921eB8DD7d506d4dE8D5B79b856157', 18, 'KOFFEE', 'KoffeeSwap Token'),
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, '0xb0fabEED45da483915e2E80a0109dBC6f01E7F98', 18, 'KSTEST', 'KS Test'),
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x0039f574eE5cC39bdD162E9A88e3EB1f111bAF48', 18, 'USDT', 'Tether USD'),
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, '0x67f6a7BbE0da067A747C6b2bEdF8aBBF7D6f60dc', 18, 'USDT', 'Tether USD'),
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x980a5AfEf3D17aD98635F6C5aebCBAedEd3c3430', 18, 'USDC', 'USD Coin'),
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, '0xD6c7E27a598714c2226404Eb054e0c074C906Fc9', 18, 'USDC', 'USD Coin'),
}


export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

const WKCS_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WKCS[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WKCS[ChainId.TESTNET]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  //...WKCS_ONLY,
  [ChainId.MAINNET]: [...WKCS_ONLY[ChainId.MAINNET], KOFFEE_TOKEN[ChainId.MAINNET], USDT[ChainId.MAINNET], USDC[ChainId.MAINNET]],
  [ChainId.TESTNET]: [...WKCS_ONLY[ChainId.TESTNET], KOFFEE_TOKEN[ChainId.TESTNET], USDT[ChainId.TESTNET], USDC[ChainId.TESTNET]]

}

export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  // [ChainId.MAINNET]: {
  //   '0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18': [new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap')],
  //   '0x561a4717537ff4AF5c687328c0f7E90a319705C0': [new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap')],
  //   [FEI.address]: [TRIBE],
  //   [TRIBE.address]: [FEI],
  //   [FRAX.address]: [FXS],
  //   [FXS.address]: [FRAX],
  //   [WBTC.address]: [renBTC],
  //   [renBTC.address]: [WBTC]
  // }
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  // [ChainId.MAINNET]: {
  //   [AMPL.address]: [DAI, WKCS[ChainId.MAINNET]]
  // }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  //...WKCS_ONLY,
  [ChainId.MAINNET]: [...WKCS_ONLY[ChainId.MAINNET], KOFFEE_TOKEN[ChainId.MAINNET]],
  [ChainId.TESTNET]: [...WKCS_ONLY[ChainId.TESTNET], KOFFEE_TOKEN[ChainId.TESTNET]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  //...WKCS_ONLY,
  [ChainId.MAINNET]: [...WKCS_ONLY[ChainId.MAINNET], KOFFEE_TOKEN[ChainId.MAINNET], USDT[ChainId.MAINNET], USDC[ChainId.MAINNET]],
  [ChainId.TESTNET]: [...WKCS_ONLY[ChainId.TESTNET], KOFFEE_TOKEN[ChainId.TESTNET], USDT[ChainId.TESTNET], USDC[ChainId.TESTNET]]  
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  // [ChainId.MAINNET]: [
  //   [
  //     new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
  //     new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
  //   ],
  //   [USDC, USDT],
  //   [DAI, USDT]
  // ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Use WalletConnect to connect to mobile wallets and more.',
    href: null,
    color: '#4196FC',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much KCS so they end up with <.01
export const MIN_KCS: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 KCS
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

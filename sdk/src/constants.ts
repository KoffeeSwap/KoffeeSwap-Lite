import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MAINNET = 321,
  TESTNET = 322
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
    [ChainId.MAINNET]: '0xC0fFeE00000e1439651C6aD025ea2A71ED7F3Eab',
    [ChainId.TESTNET]: '0xC0fFeE00000e1439651C6aD025ea2A71ED7F3Eab'
}

export const INIT_CODE_HASH: { [chainId in ChainId]: string } = {
    [ChainId.MAINNET]: '0x62c604a2a99a1c155ab3a06b325602ce74fbd4ea12c4fb4c4c1cffdd110d3981',
    [ChainId.TESTNET]: '0x894c922d7e2dd3cebd951071d0e54f736f27edb995844f32dbaa23ee3a07f6a8'
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

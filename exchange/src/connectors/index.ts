import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ChainId } from '@koffeeswap/sdk'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

export const RPC_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://rpc-mainnet.kcc.network',
  [ChainId.TESTNET]: 'https://rpc-testnet.kcc.network'
}

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '321')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { 
    321: RPC_URLS[ChainId.MAINNET],
    322: RPC_URLS[ChainId.TESTNET]
  },
  defaultChainId: NETWORK_CHAIN_ID
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [321, 322]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 
    321: RPC_URLS[ChainId.MAINNET],
    322: RPC_URLS[ChainId.TESTNET]
  },
  qrcode: true,
  pollingInterval: 15000
})

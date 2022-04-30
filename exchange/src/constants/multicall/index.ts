import { ChainId } from '@koffeeswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xCCa83a45DA0c09316127Aac2e2DEDCF570aE6c18',
  [ChainId.TESTNET]: '0xa12636eAe495c2a5b3D3f566Ce6a19Ea63Cf4e1A'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }

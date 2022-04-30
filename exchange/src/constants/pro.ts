import { ChainId } from '@koffeeswap/sdk'

export const GRAPH_URI: { [chainId in ChainId]: string } = {
  321: 'graph.koffeeswap.exchange',
  322: 'graphtest.koffeeswap.exchange'
}

export const HISTORY_URI: { [chainId in ChainId]: string } = {
  321: 'history.koffeeswap.exchange',
  322: 'historytest.koffeeswap.exchange'
}

export enum ProScreenSizes{
  Width_Medium = 1200,
  Width_Small = 1035,
  Width_Mobile = 648,
  Height_Mobile = 719
}

export const CHART_SAVE_LOAD_URL: { [chainId in ChainId]: string } = {
  321: 'https://chartstore.koffeeswap.exchange',
  322: 'https://chartstoretest.koffeeswap.exchange'
}
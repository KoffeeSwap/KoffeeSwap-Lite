# KoffeeSwap Lite

This repository is the monorepo for the open-source lite version of KoffeeSwap.

## Getting Started

 1. Install Required software:
	 - Node.js 14.16.1
	 - Yarn
	 - Python 2.7

1. Clone repository, and set working directory to root of repository.

1. Install all dependencies using yarn:
```yarn```

1. Compile/build all workspaces:
```yarn build:mainnet```

1. Run the application locally:
```yarn start```

## Other Build Options

Build just the SDK:
```yarn build:sdk```

Build just the Exchange:
```yarn build:exchange```

Build both the SDK and the exchange:
```yarn build:web```
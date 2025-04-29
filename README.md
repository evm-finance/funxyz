## To run locally: 

### cd vite-project

### npm install

### npm run dev

### Link : https://funxyz-swap.vercel.app/  

### Key Features:
Supports fetching prices of USDT, USDC, WETH, and WBTC from the funkit api.
Before the user connects their wallet to the application, swap estimates are computed using the Funkit API.  
Can connect to wallet and get swap estimates directly from Uniswap V2 router.  (including between WETH/WBTC)
can approve uniswap router to use tokens from the selected wallet for swapping.
Can perform swaps to the Uniswap v2 router
Have icons for all the tokens

### Assumptions made in design:
Implementing swapping logic for this project would show initiative, even thought it was not part of the spec.
It is useful to have a DEX price quote side by side with an external API so a user can see potential slippage on a transaction.
I thought a default input amount of 1 ETH would be good for showing the price


### Libraries used:
ethersjs - for connecting wallet, quoting prices from Uniswap 

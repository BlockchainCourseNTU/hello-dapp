# Warming Up

Before diving into coding, let's have some fun with existing blockchain tools and products first to get a feeling of "using blockchain apps".

First, set up your [MetaMask wallet](https://metamask.io/index.html). For more information, read its [FAQ](https://metamask.io/faqs.html) page.

> Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, secure login, token wallet, and token exchange—everything you need to manage your digital assets.

Explore inside the intuitive MetaMask wallet, and try to accomplish the following by clicking around:

- Switch to a different network (e.g. switch to Kovan testnet).
- Create a new account.
- Change your account name/alias from "Account X" to something you prefer.
- Copy paste your public address (e.g. `0x5238...a1CD`).
- View your _Secret Recovery Phrase_ (but never ever reveal to others or even let it stay in your clipboard for too long, this is your master secret seed).
- View your account on Etherscan.

Now you are ready to try out the following:

- [Sending and receiving ethers](#sending-and-receiving-ethers)
- [exploring blockchain explorer: etherscan](#blockchain-explorer-etherscan)
- [play around ERC20 tokens](#play-around-erc20-tokens)
- [play around ERC721 tokens](#play-around-erc721-tokens)
- [setup alchemy account](#setup-alchemy)

## Sending and receiving ethers

Unless unlikely events, your wallet and accounts should have 0 ether in balance when you created them.

While you are waiting for faucet to grant you test ethers, a fun question to ponder on: "what are the rare cases where you create a new account to find positive balance?":

<details>
 <summary>make sure you have an answer yourself before revealing</summary>

- your private key collide with someone else's: there are [~170 million](https://etherscan.io/chart/address) total distinct addresses on Ethereum
  as of Sept 13, 2021 according to Etherscan, Ethereum's private key is 256 bit long, which gives us 2^256 total possibilities. Your chance of randomly sampled an in-use
  private key is < 2^(28-256) = 2^(-228). FYI, there are roughly 2^224 atoms in our galaxy. In short, extremely unlikely events.
- someone accidentally send your address some ethers. (mistype the receiver address)
- on the topic of receiving money unknowingly, can you force a contract to receive ether even if it doesn't have `receive() external payable {...}` function?
  The answer is yes, via `selfdestruct`, [read doc here](https://docs.soliditylang.org/en/latest/contracts.html?highlight=selfdestruct#receive-ether-function).

</details>

## Blockchain explorer: etherscan

## Play around ERC20 tokens

## Play around ERC721 tokens

## Setup alchemy

[Alchemy](https://www.alchemy.com/) is a powerful developer tool providing features like hosted Ethereum nodes with API access. What that means is: you don't have to run
your own Ethereum node in order to receive updates from or deploy your contacts to the live network, instead you use Alchemy Supernode service as a gateway for a highly
available nodes with a rich set of APIs for your applications to interact with the blockchain.

You can [register here](https://auth.alchemyapi.io/signup), and go through their ['getting started'](https://docs.alchemy.com/alchemy/introduction/getting-started) doc here.

Give your project whatever name you prefer, try to compartmentalize your backend traffic analytic from that of the front-end by creating separate projects --
for now, let's just create one to experiment with, "Environment" set to "Development", "Network" selects "Kovan" (you can switch to others later).

Once you have logged in, you should be able to see your dashboard and a task of "Make your first request", we encourage you to view the list of supported methods and
make requests from your command line as instructed.

<img src="./assets/warmup/alchemy-request.png" alt="alchemy requests" width="600" align="0 auto" />

In case if you are an automation maximalist, and prefer running a script over manually sending 10 requests, try:

- Rename `.env.example` file to `.env`in our project root (don't worry, it's git ignored)
- Copy paste your own HTTP integration API key into the `.env` file
- Run [`./scripts/alchemy-requests-example.sh` scripts](./scripts/alchemy-requests-example.sh)

We further note that there are alternatives like [Infura](https://infura.io/) that offers similar services, you can use either for your own projects, but we use Alchemy by default in our workshop.

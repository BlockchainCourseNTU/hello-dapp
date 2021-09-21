#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: ./alchemy-requests-example.sh -n <main|kovan|rinkeby|ropsten|goerli>" 1>&2; exit 1;
}

BASEDIR=$(dirname $0) # Project root
NETWORK="main" #default network choice is mainnet

[ $# -eq 0 ] && usage
while getopts ":n:" option; do
  case $option in
    n)
      NETWORK=${OPTARG}
      ;;
    *)
      echo "here"
      usage
      ;;
   esac
done
echo "Using network: ${NETWORK}."

# import all .env into your environment variables
if [ "$(uname)" = "Darwin" ] || [ "$(uname)" = "FreeBSD" ]; then
    export $(grep -v '^#' ${BASEDIR}/../.env | xargs -0)
elif [ "$(uname)" = "Linux" ]; then
    export $(grep -v '^#' ${BASEDIR}/../.env | xargs -d '\n')
fi

ALCHEMY_HTTP_TOKEN="https://eth-${NETWORK}.alchemyapi.io/v2/${ALCHEMY_TOKEN}"

# Send 10 different requests
curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x1b4", true],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0xc94770007dda54cF92009BFF0dE90c06F603a09f","latest"],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["0xab059a62e22e230fe0f56d8555340a29b2e9532360368f810595453f6fdd213b"],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByNumber","params":["latest"],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xc94770007dda54cF92009BFF0dE90c06F603a09f", "latest"],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907", "latest"],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"address": "0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907","topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],"blockHash": "0x8243343df08b9751f5ca0c5f8c9c0460d8a9b6351066fae0acbd4d3e776de8bb"}],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":0}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":83}'

curl $ALCHEMY_HTTP_TOKEN \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{see above}],"id":1}'

import * as sdk from "@decentral.ee/rtoken-contracts";

const contracts = {
    IRToken: null,
    IERC20: null,
    tokens: null,
    functions: null,
    faucet: null,

    init: async function(web3, allTokens, chainId) {
        const tokens = allTokens[chainId];
        const contracts = sdk.load(web3.currentProvider);
        this.IRToken = contracts.IRToken;
        this.IERC20 = contracts.IERC20;
        this.functions = await this.IRToken.at(tokens.rdai);
        if (chainId == 4) {
            this.faucet = await contracts.RinkebyTestDAI.at(
                "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa"
            );
        }
        // load all tokens and await all to be done
        var tokensTemp = {};
        await Promise.all(
            Object.keys(tokens).map(async token => {
                console.log(`Loading token ${token} at ${tokens[token]}`);
                tokensTemp[token] = await this.IERC20.at(tokens[token]);
            })
        );
        this.tokens = tokensTemp;
    }
};

export default contracts;

import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'StakingVault',
}


const arbitrumContract: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,

    contractName: 'StakingVault',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: sepoliaContract,
        },
        {
            contract: arbitrumContract,
        },
    ],
    connections: [
        {
            from: sepoliaContract,
            to: arbitrumContract,
        },
        {
            from: arbitrumContract,
            to: sepoliaContract,
        },
    ],
}

export default config

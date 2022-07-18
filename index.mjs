import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from '../build/index.main.mjs';
import { ask, yesno } from '@reach-sh/stdlib/ask.mjs';

const deployer_name = "Alice"
const Att1_name = "Bob"
const Att2_name = "Kate"

const stdlib = await loadStdlib(process.env);
const startingBalance = stdlib.parseCurrency(100);

const acc_deployer = await stdlib.newTestAccount(startingBalance);
const acc_Att1 = await stdlib.newTestAccount(startingBalance);
const acc_Att2 = await stdlib.newTestAccount(startingBalance);

const theNFT = await stdlib.launchToken(acc_deployer, "NFT", "NFT01", { supply: 1 });
console.log(`The Nft info : ${theNFT}`)
const ctcdeployer = acc_deployer.contract(backend);
const ctc_att1 = acc_Att1.contract(backend, ctcdeployer.getInfo())
const ctc_att2 = acc_Att2.contract(backend, ctcdeployer.getInfo())

const showBalance = async (acc, name) => {
    const amt = await stdlib.balanceOf(acc);
    const amtNFT = await stdlib.balanceOf(acc, theNFT.id);
    console.log(`${name} has ${stdlib.formatCurrency(amt)} ${stdlib.standardUnit} and ${amtNFT} of the NFT`);
};
const before_deployer = await showBalance(acc_deployer, deployer_name)
const before_att1 = await showBalance(acc_Att1, Att1_name)
const before_att2 = await showBalance(acc_Att2, Att2_name)
const Att1_address = await acc_Att1.getAddress()
const Att2_address = await acc_Att2.getAddress()
console.log(`What is the algorand blockchain of Fifa and the future?`)
const ans = { 'ALgorand': 0, 'algorand': 0, 'ALGORAND': 0, 'algo': 0 }
const possible_ans = ['Algorand', 'algorand', 'ALGORAND', 'algo']
await Promise.all([
    ctcdeployer.p.Deployer({
        Tokenid: theNFT.id,
        ans_to_ques: async () => {
            const answer = ans['ALGORAND']
            return answer

        },
    }),
    ctc_att1.p.Attacher1({
        accept_token: async (id) => {
            acc_Att1.tokenAccept(id)
            console.log(`${Att1_name} accepted the token `);
        },
        answer: async () => {
            const att1_ans = await ask(`enter your answer to the question above: `, (b) => {
                const at1a = b
                return at1a
            })
            if (att1_ans === possible_ans[0] || att1_ans === possible_ans[1] || att1_ans === possible_ans[2] || att1_ans === possible_ans[3]) {
                return ans[att1_ans]
            } else {
                return 1
            }
        }
    }),
    ctc_att2.p.Attacher2({
        accept_token: async (id) => {
            acc_Att2.tokenAccept(id)
            console.log(`${Att2_name} accepted the token `);
        },
        answer: async () => {
            const att2_ans = await ask(`enter your answer to the question above: `, (b) => {
                const at2a = b
                return at2a
            })
            if (att2_ans === possible_ans[0] || att2_ans === possible_ans[1] || att2_ans === possible_ans[2] || att2_ans === possible_ans[3]) {
                return ans[att2_ans]
            } else {
                return 1
            }
        }
    })
])

await showBalance(acc_deployer, deployer_name)
await showBalance(acc_Att1, Att1_name)
await showBalance(acc_Att2, Att2_name)

const Att1_nftbal = await stdlib.balanceOf(acc_Att1, theNFT.id)
const Att2_nftbal = await stdlib.balanceOf(acc_Att2, theNFT.id)

if (parseInt(Att1_nftbal) == 1) {
    console.log(`${Att1_name}'s Whitelisted address: ${Att1_address}`)
} else {
    console.log(`${Att1_name} wasn't whitelisted`)
}

if (parseInt(Att2_nftbal) == 1) {
    console.log(`${Att2_name}'s Whitelisted address: ${Att2_address}`)
} else {
    console.log(`${Att2_name} wasn't whitelisted`)
}

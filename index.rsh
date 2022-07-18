'reach 0.1'

const shared = {
    accept_token: Fun([Token], Null),
    answer: Fun([], UInt)
}

export const main = Reach.App(() => {
    const Deployer = Participant('Deployer', {
        Tokenid: Token,
        ans_to_ques: Fun([], UInt)
    })
    const Attacher1 = Participant('Attacher1', {
        ...shared
    })
    const Attacher2 = Participant('Attacher2', {
        ...shared
    })

    init()

    Deployer.only(() => {
        const TokenId = declassify(interact.Tokenid)
        const Answer = declassify(interact.ans_to_ques())
    })
    Deployer.publish(TokenId, Answer)
    const Token_pay = [[1, TokenId]]
    commit()

    Deployer.pay(Token_pay)
    commit()

    Attacher1.only(() => {
        const att1_at = declassify(interact.accept_token(TokenId))
        const att1_ans = declassify(interact.answer())
    })
    Attacher1.publish(att1_at, att1_ans)
    commit()

    Attacher2.only(() => {
        const att2_at = declassify(interact.accept_token(TokenId))
        const att2_ans = declassify(interact.answer())
    })
    Attacher2.publish(att2_at, att2_ans)
    const whitelisted = new Map(Address, UInt)
    const [forAtt1, forAtt2, forDeployer] =
        Answer == att1_ans ? [1, 0, 0] :
            Answer == att2_ans ? [0, 1, 0] :
                [0, 0, 1]
    if (forAtt1 == 1) {
        whitelisted[Attacher1] = att1_ans
        transfer([[forAtt1, TokenId]]).to(Attacher1)
    } else if (forAtt2 == 1) {
        whitelisted[Attacher2] = att2_ans
        transfer([[forAtt2, TokenId]]).to(Attacher2)
    } else {
        transfer([[forDeployer, TokenId]]).to(Deployer)
    }
    commit()
})

import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { RuleGroupRow } from './RuleGroupRow';
import { RulesAccordion } from './RulesAccordion';

export type Rule = {
    id: string;
    type: 'rule';
    question?: string;
    condition?: string;
    operator?: string;
    value?: string;
};

export type RuleCombinator = (typeof ruleCombinators)[number];

export type RuleGroup = {
    id: string;
    type: 'group';
    combinator: RuleCombinator;
    rules: (Rule | RuleGroup)[];
};

const ruleCombinators = ['AND', 'OR'] as const;

const initialRulesState: RuleGroup = {
    id: uuid(),
    type: 'group',
    combinator: 'AND',
    rules: []
};

export function RulesCreator() {
    const [rootRuleGroup, setRootRuleGroup] = useState<RuleGroup>(initialRulesState);

    console.log(JSON.stringify(rootRuleGroup, null, 2));

    return (
        <RulesAccordion>
            <div className='flex flex-col'>
                <RuleGroupRow
                    key={rootRuleGroup.id}
                    hasBackgroundColor={false}
                    isFirstGroup={true}
                    group={rootRuleGroup}
                    setRules={setRootRuleGroup}
                    combinators={[...ruleCombinators]}
                    questions={['q1', 'q2']}
                    conditions={['sentiment', 'emotion']}
                    operators={['is', 'equals']}
                    values={['1', '2']}
                />
            </div>
        </RulesAccordion>
    );
}

import { RuleGroupRow } from './RuleGroupRow';
import { RulesAccordion } from './RulesAccordion';
import { RulesControl } from '@/features/form-creation/hooks/useFormFields';

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

export const ruleCombinators = ['AND', 'OR'] as const;

type Props = {
    rules: RuleGroup;
    onRulesChange: (controls: RulesControl) => void;
    questions: string[];
};

export function RulesCreator({ rules, onRulesChange, questions }: Props) {
    const handleRuleChange = (rules: RuleGroup) => {
        onRulesChange({ rules });
    };

    return (
        <RulesAccordion>
            <div className='flex flex-col'>
                <RuleGroupRow
                    key={rules.id}
                    hasBackgroundColor={false}
                    isFirstGroup={true}
                    rootGroup={rules}
                    group={rules}
                    onRuleChange={handleRuleChange}
                    combinators={[...ruleCombinators]}
                    questions={questions}
                    conditions={['sentiment', 'emotion']}
                    operators={['is', 'equals']}
                    values={['1', '2']}
                />
            </div>
        </RulesAccordion>
    );
}

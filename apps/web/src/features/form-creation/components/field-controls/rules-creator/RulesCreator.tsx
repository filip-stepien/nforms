import { memo } from 'react';
import { RuleGroupRow } from './RuleGroupRow';
import { RulesAccordion } from './RulesAccordion';
import { FieldType, RuleGroup, ruleCombinators } from '@/features/form-creation/lib/types';

type Props = {
    fieldId: string;
    fieldType: FieldType;
    rules: RuleGroup;
    onRulesChange: (rules: RuleGroup) => void;
};

export const RulesCreator = memo(function RulesCreator(props: Props) {
    const { fieldId, fieldType, rules, onRulesChange } = props;

    return (
        <RulesAccordion>
            <div className='flex flex-col'>
                <RuleGroupRow
                    key={rules.id}
                    hasBackgroundColor={false}
                    isFirstGroup={true}
                    rootGroup={rules}
                    group={rules}
                    onRuleChange={onRulesChange}
                    combinators={[...ruleCombinators]}
                    fieldId={fieldId}
                    fieldType={fieldType}
                    conditions={['sentiment', 'emotion']}
                    operators={['is', 'equals']}
                    values={['1', '2']}
                />
            </div>
        </RulesAccordion>
    );
});

import { memo, useCallback } from 'react';
import { RuleGroupRow } from './RuleGroupRow';
import { RulesAccordion } from './RulesAccordion';
import {
    Field,
    FieldType,
    FieldUpdater,
    RuleConfigMap,
    RuleGroup
} from '@/features/form-creation/lib/types';

type Props = {
    fieldId: string;
    fieldType: FieldType;
    rules: RuleGroup;
    ruleConfig: RuleConfigMap;
    onFieldChange: FieldUpdater;
    field: Field;
};

export const RulesCreator = memo(function RulesCreator(props: Props) {
    const { fieldId, fieldType, rules, ruleConfig, onFieldChange, field } = props;

    const handleRuleChange = useCallback(
        (rules: RuleGroup) => {
            onFieldChange(prev => ({ ...prev, controls: { ...prev.controls, rules } }));
        },
        [onFieldChange]
    );

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
                    fieldId={fieldId}
                    fieldType={fieldType}
                    ruleConfig={ruleConfig}
                    field={field}
                />
            </div>
        </RulesAccordion>
    );
});

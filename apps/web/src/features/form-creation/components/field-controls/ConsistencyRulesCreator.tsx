import { useState } from 'react';
import { Field, formatQuery, QueryBuilder, RuleGroupType } from 'react-querybuilder';
import { QueryBuilderMantine } from '@react-querybuilder/mantine';
import { Accordion } from '@mantine/core';
import { IconTextGrammar } from '@tabler/icons-react';

const fields: Field[] = [
    {
        name: 'this-question-sentiment',
        label: 'This question sentiment',
        valueEditorType: 'select',
        values: [
            { name: 'positive', label: 'Positive' },
            { name: 'negative', label: 'Negative' },
            { name: 'neutral', label: 'Neutral' }
        ],
        operators: [
            {
                name: '=',
                label: 'is'
            }
        ]
    }
];

export function ConsistencyRulesCreator() {
    const [query, setQuery] = useState<RuleGroupType>({
        combinator: 'and',
        rules: []
    });

    console.log(formatQuery(query, 'sql'));

    return (
        <Accordion
            variant='contained'
            classNames={{
                control: 'bg-white px-3.5 outline-none',
                panel: 'bg-white h-fit',
                label: 'py-1.5',
                item: 'border-border',
                icon: 'w-fit mr-2'
            }}
        >
            <Accordion.Item value='rules'>
                <Accordion.Control
                    icon={<IconTextGrammar stroke={1.5} size={20} className='text-icon w-fit' />}
                >
                    <span className='text-sm'>Consistency rules</span>
                </Accordion.Control>
                <Accordion.Panel>
                    <QueryBuilderMantine
                        controlClassnames={{
                            addRule: 'bg-primary-background text-primary',
                            addGroup: 'bg-primary-background text-primary',
                            removeGroup: 'bg-danger-background text-danger px-sm',
                            removeRule: 'bg-danger-background  text-danger px-sm',
                            header: 'flex gap-md',
                            rule: 'flex gap-md mt-md',
                            ruleGroup:
                                'mt-md border-border border-1 rounded-sm p-md bg-[rgba(20,20,20,0.02)]'
                        }}
                    >
                        <div className='-mt-lg'>
                            <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
                        </div>
                    </QueryBuilderMantine>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}

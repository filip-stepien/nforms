import { useAppSelector } from '@/hooks/useAppSelector';
import { selectFieldById, selectFields } from '../../state/fields';
import { useRuleSelectValues } from '../../hooks/useRuleSelectValues';
import { useState } from 'react';
import { Badge, Group, NumberInput, Select, Stack } from '@mantine/core';
import { ActionButton } from '../ui/ActionButton';
import { IconInfoSquareRounded, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { IconButton } from '../ui/IconButton';
import { selectCategories } from '../../state/respondent-categories';
import {
    addAttentionCheck,
    addAttentionCheckField,
    deleteAttentionCheck,
    deleteAttentionCheckField,
    selectAttentionCheckById,
    selectAttentionChecks,
    setAttentionCheck
} from '../../state/attention-checks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { v4 as uuid } from 'uuid';
import { useAppStore } from '@/hooks/useAppStore';
import { DefaultValueSelect } from '../field-controls/rules-creator/DefaultValueSelect';
import { Field } from '@packages/db/schemas/form/form-fields';

type Props = {
    attentionCheckId: string;
};

function AttentionCheck({ attentionCheckId }: Props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const fields = useAppSelector(selectFields);
    const categories = useAppSelector(selectCategories);
    const [selected, setSelected] = useState(fields.at(0)!.id);
    const { selectValues, transformValue } = useRuleSelectValues(selected);
    const attentionCheck = useAppSelector(state =>
        selectAttentionCheckById(state, attentionCheckId)
    );

    const firstField = selectFieldById(store.getState(), attentionCheck.fields.at(0)!) as
        | Field
        | undefined;

    const handleFieldAdd = () => {
        if (attentionCheck.fields.includes(selected)) {
            return;
        }

        dispatch(addAttentionCheckField({ attentionCheckId, fieldId: selected }));

        if (!firstField) {
            const addedField = selectFieldById(store.getState(), selected);

            dispatch(
                setAttentionCheck({
                    attentionCheckId,
                    attentionCheck: {
                        condition: selectValues[addedField!.type].map(v => v.condition).at(0),
                        operator: selectValues[addedField!.type]
                            .map(v => v.operators)
                            .at(0)!
                            .at(0)!,
                        value: transformValue(
                            selectValues[addedField!.type]
                                .map(v => v.values)
                                .at(0)!
                                .at(0)!
                        )
                    }
                })
            );
        }
    };

    const handleConditionChange = (condition: string | null) => {
        if (condition) {
            const valuesByCondition = selectValues[firstField!.type].find(
                v => v.condition === condition
            )!;
            const firstOperator = valuesByCondition?.operators[0];
            const firstValue = valuesByCondition?.values[0];

            dispatch(
                setAttentionCheck({
                    attentionCheckId,
                    attentionCheck: {
                        condition,
                        operator: firstOperator,
                        value: transformValue(firstValue)
                    }
                })
            );
        }
    };

    const handleOperatorChange = (operator: string | null) => {
        if (operator) {
            dispatch(setAttentionCheck({ attentionCheckId, attentionCheck: { operator } }));
        }
    };

    const handleValueChange = (value: string | null) => {
        if (value) {
            dispatch(setAttentionCheck({ attentionCheckId, attentionCheck: { value } }));
        }
    };

    const handleFieldDelete = (fieldId: string) => {
        dispatch(deleteAttentionCheckField({ attentionCheckId, fieldId }));
    };

    const handleFieldSelect = (fieldId: string | null) => {
        if (fieldId) {
            setSelected(fieldId);
        }
    };

    const handleCategoryChange = (categoryId: string | null) => {
        if (categoryId) {
            dispatch(setAttentionCheck({ attentionCheckId, attentionCheck: { categoryId } }));
        }
    };

    const handleScoreChange = (score: string | number) => {
        dispatch(setAttentionCheck({ attentionCheckId, attentionCheck: { score: Number(score) } }));
    };

    const handleDelete = () => {
        dispatch(deleteAttentionCheck({ attentionCheckId }));
    };

    return (
        <Stack className='p-xl border-outline w-full rounded-sm border bg-neutral-100'>
            <Group justify='space-between' align='flex-start' wrap='nowrap'>
                <Stack>
                    <Group className='flex-1'>
                        <Badge className='min-w-18 rounded-sm' variant='default' size='lg'>
                            SET
                        </Badge>
                        <Select
                            data={categories.map(({ id, category }) => ({
                                label: category,
                                value: id
                            }))}
                            value={attentionCheck.categoryId}
                            onChange={handleCategoryChange}
                            allowDeselect={false}
                        />
                        <Badge className='rounded-sm' variant='default' size='lg'>
                            SCORE TO
                        </Badge>
                        <NumberInput value={attentionCheck.score} onChange={handleScoreChange} />
                    </Group>
                    <Group>
                        <Badge className='min-w-18 rounded-sm' variant='default' size='lg'>
                            WHEN
                        </Badge>
                        {attentionCheck.fields.length > 0 ? (
                            <>
                                <Select
                                    data={selectValues[firstField!.type].map(v => v.condition)}
                                    value={attentionCheck.condition}
                                    onChange={handleConditionChange}
                                    allowDeselect={false}
                                />
                                <Select
                                    data={
                                        selectValues[firstField!.type].find(
                                            v => v.condition === attentionCheck.condition
                                        )!.operators
                                    }
                                    value={attentionCheck.operator}
                                    onChange={handleOperatorChange}
                                    allowDeselect={false}
                                />
                                <DefaultValueSelect
                                    data={
                                        selectValues[firstField!.type].find(
                                            v => v.condition === attentionCheck.condition
                                        )!.values
                                    }
                                    onChange={handleValueChange}
                                    value={attentionCheck.value}
                                    allowDeselect={false}
                                />
                            </>
                        ) : (
                            <Group className='text-font-tertiary h-9 text-sm'>
                                {'<Add at least one question to this group>'}
                            </Group>
                        )}
                    </Group>
                </Stack>
                <IconButton
                    color='red'
                    variant='light'
                    icon={IconTrash}
                    className='justify-self-end'
                    onClick={handleDelete}
                />
            </Group>
            <Stack className='p-lg border-outline border bg-white' gap={firstField ? 'sm' : 0}>
                <Group>
                    <Select
                        value={selected}
                        data={
                            firstField
                                ? fields
                                      .filter(question => question.type === firstField!.type)
                                      .map(q => ({ label: q.title, value: q.id }))
                                : fields.map(q => ({ label: q.title, value: q.id }))
                        }
                        allowDeselect={false}
                        className='w-fit'
                        onChange={handleFieldSelect}
                    />
                    <ActionButton
                        label='Add question to group'
                        icon={IconPlus}
                        variant='transparent'
                        onClick={handleFieldAdd}
                    />
                </Group>
                <Stack gap={0} className='pl-sm'>
                    {attentionCheck.fields.map(fieldId => {
                        const { title } = selectFieldById(store.getState(), fieldId);
                        return (
                            <Group key={fieldId}>
                                <span className='text-sm'>{title}</span>
                                <IconButton
                                    icon={IconX}
                                    color='red'
                                    variant='transparent'
                                    onClick={() => handleFieldDelete(fieldId)}
                                />
                            </Group>
                        );
                    })}
                </Stack>
            </Stack>
        </Stack>
    );
}

export function FormAttentionChecksTab() {
    const fields = useAppSelector(selectFields);
    const categories = useAppSelector(selectCategories);
    const attentionChecks = useAppSelector(selectAttentionChecks);
    const dispatch = useAppDispatch();

    const handleCheckAdd = () => {
        if (fields.length > 0 && categories.length > 0) {
            dispatch(
                addAttentionCheck({
                    id: uuid(),
                    categoryId: categories.at(0)!.id,
                    score: 0,
                    fields: []
                })
            );
        }
    };

    return fields.length > 0 && categories.length > 0 ? (
        <Stack align='center'>
            {attentionChecks.map(({ id }) => (
                <AttentionCheck key={id} attentionCheckId={id} />
            ))}
            <ActionButton
                label='Add attention check'
                icon={IconPlus}
                variant='transparent'
                className='pt-sm'
                onClick={handleCheckAdd}
            />
        </Stack>
    ) : (
        <Group gap='xs'>
            <IconInfoSquareRounded className='text-font-tertiary' size={20} />
            <span className='text-font-tertiary'>Add at least one question and category.</span>
        </Group>
    );
}

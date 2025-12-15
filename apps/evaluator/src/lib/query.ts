import { Form } from '@packages/db/schemas/form/form';
import { FieldContext } from './fields';

export function findFirstFieldById(fieldId: string, form: Form) {
    const field = form.fields.find(f => f.id === fieldId);

    if (!field) {
        throw new Error(`Field ${fieldId} not found`);
    }

    return field;
}

export function findAllFieldCategoryActionsByFieldId(fieldId: string, form: Form) {
    return form.fieldRules.categoryActions.filter(c => c.fieldId === fieldId);
}

export function findCategoryById(categoryId: string, form: Form) {
    const category = form.respondentCategories.find(c => c.id === categoryId);

    if (!category) {
        throw new Error(`Category ${categoryId} not found`);
    }

    return category;
}

export function findFirstFieldRuleGroupById(groupId: string, form: Form) {
    const group = form.fieldRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`Field rule group ${groupId} not found`);
    }

    return group;
}

export function findFirstFieldRuleById(ruleId: string, form: Form) {
    const rule = form.fieldRules.rules.find(r => r.id === ruleId);

    if (!rule) {
        throw new Error(`Field rule ${ruleId} not found`);
    }

    return rule;
}

export function findFirstFieldOptionById(optionId: string, form: Form) {
    const option = form.fieldOptions.find(opt => opt.id === optionId);

    if (!option) {
        throw new Error(`Field option ${optionId} not found`);
    }

    return option;
}

export function findFirstFieldContextByFieldIdAndCondition(
    fieldId: string,
    condition: string,
    contexts: FieldContext[]
) {
    const fieldContext = contexts?.find(
        ctx => ctx.fieldId === fieldId && ctx.condition === condition
    );

    if (!fieldContext) {
        throw new Error(`Cannot resolve context for field ${fieldId}`);
    }

    return fieldContext;
}

export function findFirstCategoryRuleById(ruleId: string, form: Form) {
    const rule = form.respondentCategoryRules.rules.find(r => r.id === ruleId);

    if (!rule) {
        throw new Error(`Category rule ${ruleId} not found`);
    }

    return rule;
}

export function findFirstCategoryRuleGroupById(groupId: string, form: Form) {
    const group = form.respondentCategoryRules.groups.find(g => g.id === groupId);

    if (!group) {
        throw new Error(`Category rule group ${groupId} not found`);
    }

    return group;
}

export function findFirstCategoryRuleRelationByCategoryId(categoryId: string, form: Form) {
    const relation = form.respondentCategoryRules.relations.find(r => r.categoryId === categoryId);

    if (!relation) {
        throw new Error(`Category rule relation for category ID ${categoryId} not found`);
    }

    return relation;
}

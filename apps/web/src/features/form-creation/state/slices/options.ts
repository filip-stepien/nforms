import { RootState } from '@/lib/store';
import { FieldOption } from '@packages/db/schemas/form';
import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';

export type FieldOptionPatch = Partial<FieldOption>;

const fieldOptionsAdapter = createEntityAdapter<FieldOption>({
    sortComparer: (a, b) => a.order - b.order
});

const initialState = fieldOptionsAdapter.getInitialState();

const fieldOptionsSlice = createSlice({
    name: 'fieldOptions',
    initialState,
    reducers: {
        addOption: (state, action: PayloadAction<Omit<FieldOption, 'order'>>) => {
            const { id, fieldId, content } = action.payload;

            const existingOptions = Object.values(state.entities).filter(
                opt => opt?.fieldId === fieldId
            );

            const maxOrder = existingOptions.length
                ? Math.max(...existingOptions.map(opt => opt!.order))
                : -1;

            fieldOptionsAdapter.addOne(state, {
                id,
                fieldId,
                content,
                order: maxOrder + 1
            });
        },

        _deleteOption: (state, action: PayloadAction<{ optionId: string }>) => {
            fieldOptionsAdapter.removeOne(state, action.payload.optionId);
        },

        deleteOptionsByField: (state, action: PayloadAction<{ fieldId: string }>) => {
            const idsToRemove = Object.values(state.entities)
                .filter(opt => opt?.fieldId === action.payload.fieldId)
                .map(opt => opt!.id);

            fieldOptionsAdapter.removeMany(state, idsToRemove);
        },

        setOption: (
            state,
            action: PayloadAction<{ optionId: string; option: FieldOptionPatch }>
        ) => {
            const { optionId, option } = action.payload;
            fieldOptionsAdapter.updateOne(state, {
                id: optionId,
                changes: option
            });
        },

        reorderOption: (
            state,
            action: PayloadAction<{ fieldId: string; from: number; to?: number }>
        ) => {
            const { fieldId, from, to } = action.payload;

            const optionsForField = Object.values(state.entities)
                .filter(opt => opt.fieldId === fieldId)
                .sort((a, b) => a.order - b.order);

            const [moved] = optionsForField.splice(from, 1);
            optionsForField.splice(to ?? from, 0, moved);

            optionsForField.forEach((opt, index) => {
                fieldOptionsAdapter.updateOne(state, {
                    id: opt.id,
                    changes: { order: index }
                });
            });
        }
    }
});

export const { addOption, _deleteOption, deleteOptionsByField, setOption, reorderOption } =
    fieldOptionsSlice.actions;

export const fieldOptionsReducer = fieldOptionsSlice.reducer;

export const { selectAll: selectOptions, selectById: selectOptionById } =
    fieldOptionsAdapter.getSelectors<RootState>(state => state.fieldOptions);

export const selectOptionsByFieldId = (fieldId: string) =>
    createSelector(selectOptions, options => options.filter(option => option.fieldId === fieldId));

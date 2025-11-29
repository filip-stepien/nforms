import { RootState } from '@/lib/store';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AttentionChecksState = {
    id: string;
    categoryId: string;
    score: number;
    condition?: string;
    operator?: string;
    value?: string;
    fields: string[];
};

const attentionChecksAdapter = createEntityAdapter<AttentionChecksState>();

const initialState = attentionChecksAdapter.getInitialState();

export const attentionChecksSlice = createSlice({
    name: 'attentionChecks',
    initialState,
    reducers: {
        addAttentionCheck: attentionChecksAdapter.addOne,

        deleteAttentionCheck: (state, action: PayloadAction<{ attentionCheckId: string }>) => {
            attentionChecksAdapter.removeOne(state, action.payload.attentionCheckId);
        },

        setAttentionCheck: (
            state,
            action: PayloadAction<{
                attentionCheckId: string;
                attentionCheck: Partial<AttentionChecksState>;
            }>
        ) => {
            const { attentionCheckId, attentionCheck } = action.payload;

            attentionChecksAdapter.updateOne(state, {
                id: attentionCheckId,
                changes: attentionCheck
            });
        },

        addAttentionCheckField: (
            state,
            action: PayloadAction<{ attentionCheckId: string; fieldId: string }>
        ) => {
            const { attentionCheckId, fieldId } = action.payload;
            state.entities[attentionCheckId].fields.push(fieldId);
        },

        deleteAttentionCheckField: (
            state,
            action: PayloadAction<{ attentionCheckId: string; fieldId: string }>
        ) => {
            const { attentionCheckId, fieldId } = action.payload;

            const fields = state.entities[attentionCheckId].fields;
            const idx = fields.indexOf(fieldId);

            fields.splice(idx, 1);
        }
    }
});

export const {
    addAttentionCheck,
    addAttentionCheckField,
    deleteAttentionCheck,
    deleteAttentionCheckField,
    setAttentionCheck
} = attentionChecksSlice.actions;

export const attentionChecksReducer = attentionChecksSlice.reducer;

export const { selectAll: selectAttentionChecks, selectById: selectAttentionCheckById } =
    attentionChecksAdapter.getSelectors<RootState>(state => state.attentionChecks);

import z from 'zod';
import { textInputAttributesSchema } from '../inputs/TextInput';
import { radioInputAttributesSchema } from '../inputs/RadioInput';
import { checkboxInputAttributesSchema } from '../inputs/CheckboxInput';

const fieldsStructureSchema = z.array(
    z.discriminatedUnion('type', [
        z.object({
            id: z.string().nonempty(),
            type: z.literal('text'),
            required: z.boolean().optional(),
            attributes: textInputAttributesSchema
        }),
        z.object({
            id: z.string().nonempty(),
            type: z.literal('radio'),
            required: z.boolean().optional(),
            attributes: radioInputAttributesSchema
        }),
        z.object({
            id: z.string().nonempty(),
            type: z.literal('checkbox'),
            required: z.boolean().optional(),
            attributes: checkboxInputAttributesSchema
        })
    ])
);

type FieldResponsesBody = {
    formId: string;
    fieldResponses: { fieldId: string; response: string | string[] }[];
};

export type FieldStructure = z.infer<typeof fieldsStructureSchema>[number];

export type FieldResponse = {
    id: string;
    value: string | string[];
};

export class FormFetch {
    private _inputs: FieldStructure[] = [];
    private _loading = false;
    private _error = false;
    private _onChange: () => unknown = () => {};

    public async fetchInputs(formId: string) {
        this._loading = true;
        this._error = false;
        this._onChange();

        try {
            const url = WIDGET_FORM_STRUCTURE_BASE_URL + formId;
            const raw = await fetch(url);
            const body = await raw.json();
            this._inputs = fieldsStructureSchema.parse(body?.data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Fetched inputs have incorrect shape. Issues:', error.issues);
            } else {
                console.error('An error occurred while fetching form inputs:', error);
            }

            this._error = true;
        } finally {
            this._loading = false;
            this._onChange();
        }
    }

    public async uploadResponses(formId: string, responses: FieldResponse[]) {
        this._loading = true;
        this._error = false;
        this._onChange();

        try {
            const body: FieldResponsesBody = {
                formId,
                fieldResponses: responses.map(({ id, value }) => ({ fieldId: id, response: value }))
            };

            const response = await fetch(WIDGET_FORM_SUBMIT_URL, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (response.ok) {
                console.log('Form submitted:', body);
            } else {
                this._error = true;
                console.error(
                    'An error occurred while uploading form responses:',
                    await response.json()
                );
            }
        } catch (error) {
            this._error = true;
            console.error('An error occurred while uploading form responses:', error);
        } finally {
            this._loading = false;
            this._onChange();
        }
    }

    public set onChange(callback: () => void) {
        this._onChange = callback;
    }

    public get loading() {
        return this._loading;
    }

    public get error() {
        return this._error;
    }

    public get inputs() {
        return this._inputs;
    }
}

import z from 'zod';
import { textInputAttributesSchema } from '../inputs/TextInput';
import { radioInputAttributesSchema } from '../inputs/RadioInput';
import { checkboxInputAttributesSchema } from '../inputs/CheckboxInput';

export const inputsStructureSchema = z.array(
    z.discriminatedUnion('inputType', [
        z.object({
            id: z.string().nonempty(),
            inputType: z.literal('text'),
            required: z.boolean().optional(),
            attributes: textInputAttributesSchema
        }),
        z.object({
            id: z.string().nonempty(),
            inputType: z.literal('radio'),
            required: z.boolean().optional(),
            attributes: radioInputAttributesSchema
        }),
        z.object({
            id: z.string().nonempty(),
            inputType: z.literal('checkbox'),
            required: z.boolean().optional(),
            attributes: checkboxInputAttributesSchema
        })
    ])
);

export type InputStructure = z.infer<typeof inputsStructureSchema>[number];

export type InputResponse = {
    id: string;
    value: string | string[];
};

async function debug_fetch(formId: string): Promise<InputStructure[]> {
    console.log(`Fetching form with ID: ${formId}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        {
            id: '1',
            inputType: 'text',
            required: true,
            attributes: { placeholder: 'placeholder' }
        },
        {
            id: '2',
            inputType: 'radio',
            required: true,
            attributes: {
                values: [
                    { key: '1', label: 'First' },
                    { key: '2', label: 'Second' },
                    { key: '3', label: 'Third' }
                ]
            }
        },
        {
            id: '3',
            inputType: 'checkbox',
            required: true,
            attributes: {
                values: [
                    { key: '1', label: 'First' },
                    { key: '2', label: 'Second' },
                    { key: '3', label: 'Third' }
                ]
            }
        }
    ];
}

export class FormFetch {
    private _inputs: InputStructure[] = [];
    private _loading = false;
    private _error = false;
    private _onChange: () => unknown = () => {};

    public async fetchInputs(formId: string) {
        this._loading = true;
        this._error = false;
        this._onChange();

        try {
            const raw = await debug_fetch(formId);
            this._inputs = inputsStructureSchema.parse(raw);
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

    public async uploadResponses(formId: string, responses: InputResponse[]) {
        this._loading = true;
        this._error = false;
        this._onChange();

        try {
            // submit stuff...
            await debug_fetch(formId);
            console.log(responses);
        } catch (error) {
            if (error) {
                console.error('An error occurred while uploading form responses:', error);
            }

            this._error = true;
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

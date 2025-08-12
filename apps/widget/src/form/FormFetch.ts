import z from 'zod';
import { textInputAttributesSchema } from '../inputs/TextInput';

export const inputsStructureSchema = z.array(
    z.discriminatedUnion('inputType', [
        z.object({
            id: z.string().nonempty(),
            inputType: z.literal('text'),
            attributes: textInputAttributesSchema
        })
    ])
);

export type InputStructure = z.infer<typeof inputsStructureSchema>[number];

async function debug_fetch(): Promise<InputStructure[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        {
            id: '1',
            inputType: 'text',
            attributes: { required: true, placeholder: 'placeholder' }
        },
        {
            id: '2',
            inputType: 'text',
            attributes: {}
        }
    ];
}

export class FormFetch {
    private _inputs: InputStructure[] = [];
    private _loading = false;
    private _error = false;

    public async fetchInputs() {
        this._loading = true;

        try {
            const raw = await debug_fetch();
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
        }
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

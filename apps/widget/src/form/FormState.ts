export type InputState = {
    id: string;
    value: string | string[] | null;
    error: boolean;
};

export class FormState {
    private _state: InputState[] = [];

    public setValueById(inputId: string, newValue: string | string[]) {
        this._state = this._state.map(input =>
            input.id === inputId ? { id: inputId, value: newValue, error: input.error } : input
        );
    }

    public setErrorById(inputId: string, error: boolean) {
        this._state = this._state.map(input =>
            input.id === inputId ? { id: inputId, value: input.value, error } : input
        );
    }

    public getById(inputId: string) {
        return this._state.find(input => input.id === inputId);
    }

    public set(newState: InputState[]) {
        this._state = newState;
    }

    public get() {
        return this._state;
    }
}

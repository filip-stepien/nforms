import { Select, SelectProps } from '@mantine/core';

export function DefaultValueSelect(props: SelectProps) {
    const data = [{ label: '<Select>', value: '', disabled: true }, ...(props.data ?? [])];

    return data.length > 1 ? (
        <Select {...props} data={data} value={props.value ?? ''} />
    ) : (
        <Select {...props} disabled={true} data={[{ label: '<No data>', value: '' }]} value={''} />
    );
}

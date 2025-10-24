import { Button, ColorPicker, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RefObject, useImperativeHandle, useState } from 'react';

export type ColorRef = {
    color: string;
};

type Props = {
    ref: RefObject<ColorRef | null>;
};

export function ColorPickButton({ ref }: Props) {
    const [color, setColor] = useState('#228be6');
    const [opened, { toggle, close }] = useDisclosure();

    useImperativeHandle(ref, () => ({ color }));

    return (
        <Popover opened={opened} onDismiss={close} position='bottom-start'>
            <Popover.Target>
                <Button variant='default' className='relative' onClick={toggle}>
                    <div
                        style={{ backgroundColor: color }}
                        className='absolute top-1/2 left-1/2 size-[22px] -translate-x-1/2 -translate-y-1/2 transform rounded-xs'
                    ></div>
                </Button>
            </Popover.Target>
            <Popover.Dropdown>
                <ColorPicker
                    value={color}
                    onChange={value => setColor(value)}
                    swatches={[
                        '#2e2e2e',
                        '#868e96',
                        '#fa5252',
                        '#e64980',
                        '#be4bdb',
                        '#7950f2',
                        '#4c6ef5',
                        '#228be6',
                        '#15aabf',
                        '#12b886',
                        '#40c057',
                        '#82c91e',
                        '#fab005',
                        '#fd7e14'
                    ]}
                />
            </Popover.Dropdown>
        </Popover>
    );
}

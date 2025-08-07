import { ActionIcon, CopyButton as MantineCopyButton, Tooltip } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

type Props = {
    value: string;
};

export function CopyButton({ value }: Props) {
    return (
        <MantineCopyButton value={value} timeout={1000}>
            {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow position='right'>
                    <ActionIcon
                        color={copied ? 'green' : 'gray'}
                        variant='transparent'
                        onClick={copy}
                    >
                        {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                    </ActionIcon>
                </Tooltip>
            )}
        </MantineCopyButton>
    );
}

import { cn } from '@/lib/utils';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { IconGripVertical } from '@tabler/icons-react';
import { HTMLAttributes } from 'react';

type Props = {
    dragHandleProps?: DraggableProvidedDragHandleProps | null;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function DragButton({ dragHandleProps, className, ...rest }: Props) {
    return (
        <div
            {...rest}
            className={cn('w-[36px] grid place-items-center', className)}
            {...dragHandleProps}
        >
            <IconGripVertical className='text-icon cursor-grab' stroke={1.5} size={20} />
        </div>
    );
}

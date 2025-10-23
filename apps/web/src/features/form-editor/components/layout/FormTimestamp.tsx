import dayjs from 'dayjs';

type Props = {
    createdAt: Date;
};

export function FormTimestamp({ createdAt }: Props) {
    return (
        <span className='text-font-tertiary text-sm'>
            Created on {dayjs(createdAt).format('DD.MM.YYYY')}
        </span>
    );
}

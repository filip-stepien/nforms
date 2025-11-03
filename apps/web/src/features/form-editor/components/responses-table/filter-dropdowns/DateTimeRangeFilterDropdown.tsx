import { Stack } from '@mantine/core';
import { DateStringValue, DateTimePicker } from '@mantine/dates';
import { DropdownControls } from './DropdownControls';
import { Header } from '@tanstack/react-table';
import { ResponseColumnFilterValues, ResponseRow } from '../ResponsesTable';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

type Props = {
    header: Header<ResponseRow, unknown>;
    closeDropdown: () => void;
};

type TimeRanges = {
    from: DateStringValue | null;
    to: DateStringValue | null;
};

function formatDate(date?: Dayjs | null): DateStringValue | null {
    return date?.format('YYYY-MM-DD HH:mm:ss') ?? null;
}

export function DateTimeRangeFilterDropdown({ header, closeDropdown }: Props) {
    const filterValue = header.column.getFilterValue() as
        | ResponseColumnFilterValues['dateRange']
        | undefined;

    const [dateTimeRanges, setDateTimeRanges] = useState<TimeRanges>({
        from: formatDate(filterValue?.from),
        to: formatDate(filterValue?.to)
    });

    const handleStartDateTimeChange = (value: DateStringValue | null) => {
        setDateTimeRanges(prev => ({ ...prev, from: value }));
    };

    const handleEndDateTimeChange = (value: DateStringValue | null) => {
        setDateTimeRanges(prev => ({ ...prev, to: value }));
    };

    const handleApply = () => {
        const filterValue: ResponseColumnFilterValues['dateRange'] = {
            from: dayjs(dateTimeRanges.from),
            to: dayjs(dateTimeRanges.to)
        };

        header.column.setFilterValue(filterValue);
        closeDropdown();
    };

    const handleClear = () => {
        header.column.setFilterValue(undefined);
        setDateTimeRanges({ from: null, to: null });
        closeDropdown();
    };

    return (
        <Stack gap='sm'>
            <span className='text-sm font-bold'>Select date and time range</span>
            <DateTimePicker
                placeholder='Start date and time...'
                popoverProps={{ withinPortal: false }}
                value={dateTimeRanges.from}
                onChange={handleStartDateTimeChange}
            />
            <DateTimePicker
                placeholder='End date and time...'
                popoverProps={{ withinPortal: false }}
                value={dateTimeRanges.to}
                onChange={handleEndDateTimeChange}
            />
            <DropdownControls onApply={handleApply} onClear={handleClear} />
        </Stack>
    );
}

import { Header } from '@tanstack/react-table';
import { ResponseRow, ResponseRowMeta } from '../ResponsesTable';
import { CategoryFilterDropdown } from './CategoryFilterDropdown';
import { DateTimeRangeFilterDropdown } from './DateTimeRangeFilterDropdown';
import { EmailFilterDropdown } from './EmailFilterDropdown';

type Props = {
    header: Header<ResponseRow, unknown>;
    closeDropdown: () => void;
};

export function FilterDropdown({ header, closeDropdown }: Props) {
    const columnMeta = header.column.columnDef.meta as ResponseRowMeta;

    switch (columnMeta.filterType) {
        case 'email':
            return <EmailFilterDropdown header={header} closeDropdown={closeDropdown} />;
        case 'category':
            return <CategoryFilterDropdown header={header} closeDropdown={closeDropdown} />;
        case 'dateRange':
            return <DateTimeRangeFilterDropdown header={header} closeDropdown={closeDropdown} />;
    }
}

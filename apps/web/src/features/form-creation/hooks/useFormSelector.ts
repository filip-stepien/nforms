import { useSelector } from 'react-redux';
import { FormRootState } from '../state/formStore';

export const useFormSelector = useSelector.withTypes<FormRootState>();

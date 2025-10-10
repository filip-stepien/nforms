import { useDispatch } from 'react-redux';
import { FormDispatch } from '../state/formStore';

export const useFormDispatch = useDispatch.withTypes<FormDispatch>();

import { configureStore } from '@reduxjs/toolkit';

import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import itemSlice from '@/features/simple/itemSlice';
import orderSlice from '@/features/complex/orderSlice';

const store = configureStore({
  reducer: {
    item: itemSlice.reducer,
    order: orderSlice.reducer,
  },
});

export default store;


// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import itemDTO, { defaultItemInput } from '@/pages/simple/default/itemData';
import axios from 'axios';

type ItemState = {
  heads: object[];
  items: itemDTO[];
  formInput: itemDTO;
};

const initialState: ItemState = {
  heads: [],
  items: [],
  formInput: defaultItemInput,
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    // set item form input object
    setItemForm(state, action: PayloadAction<itemDTO>) {
      state.formInput = action.payload;
    },

    // set item list array
    setItemList(state, action: PayloadAction<itemDTO[]>) {
      state.items = action.payload;
    },

    // set item list array
    setHead(state, action: PayloadAction<itemDTO[]>) {
      state.heads = action.payload;
    },

    // reset form input
    resetFormInput(state) {
      state.formInput = defaultItemInput;
    },
  },
});

// export const itemActions = itemSlice.actions;
export const { setItemForm, setItemList, setHead, resetFormInput } = itemSlice.actions
export default itemSlice;

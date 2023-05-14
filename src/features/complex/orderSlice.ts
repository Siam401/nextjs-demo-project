import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import {
  BuyerDTO,
  CustomerDTO,
  defaultFilterParams,
  defaultOrderInput,
  FilterDTO,
  OrderDTO,
  OrderSummaryDTO,
  ProductDTO,
} from '@/pages/complex/default/orderData';

type OrderState = {
  customers: CustomerDTO[];
  buyers: BuyerDTO[];
  products: ProductDTO[];
  orders: OrderSummaryDTO[];
  orderPagination: any;
  orderFormInput: OrderDTO;
  filterParams: FilterDTO;
};

const initialState: OrderState = {
  customers: [],
  buyers: [],
  products: [],
  orders: [],
  orderFormInput: defaultOrderInput,
  orderPagination: {},
  filterParams: defaultFilterParams,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setFilterForm(state, action: PayloadAction<FilterDTO>) {
      state.filterParams = action.payload;
    },
    setOrderForm(state, action: PayloadAction<OrderDTO>) {
      state.orderFormInput = action.payload;
    },
    setOrders(state, action: PayloadAction<OrderSummaryDTO[]>) {
      state.orders = action.payload;
    },
    setOrderPagination(state, action: PayloadAction<any>) {
      state.orderPagination = action.payload;
    },
    setCustomers(state, action: PayloadAction<CustomerDTO[]>) {
      state.customers = action.payload;
    },
    setBuyers(state, action: PayloadAction<BuyerDTO[]>) {
      state.buyers = action.payload;
    },
    setProducts(state, action: PayloadAction<ProductDTO[]>) {
      state.products = action.payload;
    },
  }
});

export const orderActions = orderSlice.actions;
export default orderSlice;

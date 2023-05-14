import axios from 'axios';
import { CustomerDTO, BuyerDTO, OrderDTO, FilterDTO } from '@/pages/complex/default/orderData';
import jsonToFormData from '@ajoelp/json-to-formdata';

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const fetchApiData = {
  customers: async () => {
    const result: any = await axios.get(BASE_URL + `complex/customers`).then((res) => {
      return res.data;
    })
    return result;
  },

  buyers: async () => {
    const result: any = await axios.get(BASE_URL + `complex/buyers`).then((res) => {
      return res.data
    })
    return result;
  },

  products: async () => {
    const result: any = await axios.get(BASE_URL + `complex/products`).then((res) => {
      return res.data
    })
    return result;
  },

  order: async (id: number) => {
    const result: any = await axios.get(BASE_URL + `complex/orders/` + id).then((res) => {
      return res.data
    })
    return result;
  },

  orderStore: async (formData: any) => {
    const result: any = await axios.post(BASE_URL + `complex/orders`, jsonToFormData(formData)).then((res) => {
      return res.data
    })
    return result;
  },
  orderUpdate: async (orderId: number, formData: any) => {
    formData = jsonToFormData(formData)
    formData.append('_method', 'put')
    const result: any = await axios.post(BASE_URL + `complex/orders/` + orderId, formData).then((res) => {
      return res.data
    }).catch((error) => {
      return error
    })
    return result;
  },

  orders: async (seachFilter: object) => {
    const asArray = Object.entries(seachFilter);

    const params: any = asArray.filter(
      ([key, value]) => Boolean(value) === true
    );

    const result: any = await axios.get(BASE_URL + `complex/orders?` + new URLSearchParams(params).toString()).then((res) => {
      let orders = [],
        pagination = {
          links: null,
          meta: null,
        };

      if (res.data.data) {
        orders = res.data.data;
      }

      if (res.data.links) {
        pagination.links = res.data.links;
      }
      if (res.data.meta) {
        pagination.meta = res.data.meta;
      }

      return [orders, pagination];
    })
    return result;
  },
  searchOrders: async (seachFilter: FilterDTO) => {
    const asArray = Object.entries(seachFilter);

    const params: any = asArray.filter(
      ([key, value]) => Boolean(value) === true
    );

    const result: any = await axios.get(BASE_URL + `complex/orders?` + new URLSearchParams(params).toString()).then((res) => {
      return res.data
    })
    return result;
  },
  deleteOrder: async (orderId: number) => {
    const result: any = await axios.delete(BASE_URL + `complex/orders/${orderId}`).then((res) => {
      return res.data
    })
    return result;
  },
  deleteOrderProduct: async (productId: number) => {
    const result: any = await axios.delete(BASE_URL + `complex/orders/products/${productId}`).then((res) => {
      return res.data
    })
    return result;
  }
}


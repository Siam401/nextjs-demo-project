import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
//material-ui
import { TextField, InputLabel, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Button, FormHelperText, Select, MenuItem, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
// import { setItems } from '../../../features/complex/itemSlice'
// import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import { Controller, SubmitHandler, FormProvider, useForm, UseFormProps, useFieldArray, useFormContext, UseFieldArrayReturn, FieldArrayPath } from 'react-hook-form';
import FormOrderProductEntry from '@/pages/complex/components/FormItemRow';
import { fetchApiData } from '@/pages/complex/sync/DataLoad';

import { OrderDTO, defaultOrderInput, BuyerDTO, defaultOrderProduct } from '@/pages/complex/default/orderData';

export default function ItemSection() {
  const form = useFormContext<OrderDTO>();
  const orderProductsField: UseFieldArrayReturn<
    OrderDTO,
    FieldArrayPath<any>,
    'orderProductId'
  > = useFieldArray<OrderDTO, FieldArrayPath<any>, 'orderProductId'>({
    control: form.control,
    name: 'order_products',
    keyName: 'orderProductId',
  });

  const products = useAppSelector((state) => state.order.products)

  const removeProduct = async (index: number) => {
    if (orderProductsField.fields.length === 1) {
      return;
    }
    console.log(orderProductsField)

    orderProductsField.remove(index);

    let productId = form.getValues(`order_products.${index}.id`);
    console.log(index)
    console.log(productId)
    console.log(orderProductsField)
    if (productId && productId > 0) {
      fetchApiData.deleteOrderProduct(productId)
    }
  };

  const addNewProduct = () => {
    orderProductsField.append(defaultOrderProduct);
  };

  const prepareProductObj = (data: any) => {
    delete data.orderProductId;
    return data;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">UOM </TableCell>
              <TableCell align="center">Unit Price</TableCell>
              <TableCell align="center">Quantity </TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              orderProductsField.fields.map((field, index) => {
                return (
                  <FormOrderProductEntry
                    product={prepareProductObj(field)}
                    products={products}
                    key={index}
                    index={index}
                    removeProduct={removeProduct}
                  />
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      {form.formState.errors && form.formState.errors.order_products ? (
        <FormHelperText className="text-red-500 text-xs">
          {form.formState.errors.order_products.message}
        </FormHelperText>
      ) : null}
      <Button onClick={() => addNewProduct()} sx={{ my: 1 }} variant="outlined" color="primary" startIcon={<AddIcon />}>
        Add Item
      </Button>
    </>
  )

}
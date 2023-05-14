import { TextField, InputLabel, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Button, FormControl, Select, MenuItem, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { OrderProductDTO, ProductDTO } from '@/pages/complex/default/orderData';

type FormOrderProductProps = {
  product: OrderProductDTO;
  products: ProductDTO[];
  index: number;
  removeProduct: (index: number) => void;
};
const FormOrderProductEntry = ({
  product,
  products,
  index,
  removeProduct
}: FormOrderProductProps) => {
  const {
    setValue,
    control,
    formState: { errors }
  } = useFormContext();

  const [productArray, setProductArray] = useState<object[]>([]);
  const [productCategory, setProductCategory] = useState<object[]>([]);
  const [productUnit, setProductUnit] = useState<object[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);


  useEffect(() => {
    setProductArray(products);
  }, [products]);

  useEffect(() => {
    if (product.product && product.product > 0) {
      handleOrderProductEntry(Number(product.product));

      setValue(`order_products[${index}].unit_price`, product.unit_price);
      setValue(`order_products[${index}].quantity`, product.quantity);

      setBasePrice(product.unit_price ?? 0);
      setQuantity(product.quantity ?? 1);
    }
  }, [product]);

  const getPrice = (quantity: number) => {
    setValue(`order_products[${index}].quantity`, quantity);

    setQuantity(quantity);
  };

  const handleOrderProductEntry = (productId: number) => {
    let productObj = products.filter((obj) => {
      return obj.id === productId;
    });

    if (productObj && productObj[0]) {
      setProductCategory(productObj[0].categories);
      setProductUnit(productObj[0].units);

      setValue(`order_products[${index}].unit_price`, productObj[0].price);
      setValue(`order_products[${index}].quantity`, 1);

      setBasePrice(productObj[0].price);
      setQuantity(1);
    }
  };

  return (
    <TableRow key={index}>
      <TableCell component="th" scope="row">
        <Controller
          control={control}
          name={`order_products[${index}].product`}
          render={({ field: { onChange, ...rest } }) => (
            <FormControl fullWidth>
              <Select
                {...rest}
                size="small"
                onChange={(e: any) => {
                  handleOrderProductEntry(e.target.value);
                  onChange(e.target.value);
                }}
              >
                <MenuItem key={0} value={0}>
                  Select Product
                </MenuItem>
                {
                  productArray.map((row: any) => (
                    <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          )}
        />
      </TableCell>
      <TableCell component="th" scope="row">

        <Controller
          control={control}
          name={`order_products[${index}].product_category`}
          render={({ field: { ...rest } }) => (
            <FormControl fullWidth>
              <Select
                {...rest}
                size="small"
              >
                <MenuItem key={0} value={0}>
                  Select Category
                </MenuItem>
                {
                  productCategory.map((row: any) => (
                    <MenuItem key={row.id} value={row.id}>{row.category_name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          )}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        <Controller
          control={control}
          name={`order_products[${index}].product_unit`}
          render={({ field: { ...rest } }) => (
            <FormControl fullWidth>
              <Select
                {...rest}
                size="small"
              >
                <MenuItem key={0} value={0}>
                  Select Unit
                </MenuItem>
                {
                  productUnit.map((row: any) => (
                    <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          )}
        />
      </TableCell>

      <TableCell component="th" scope="row">
        <Controller
          name={`order_products[${index}].unit_price`}
          control={control}
          render={({ field: { ...rest } }) => (
            <TextField
              {...rest}
              fullWidth
              size="small"
              type="number"
              disabled
              hiddenLabel
            />
          )}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        <Controller
          name={`order_products[${index}].quantity`}
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <TextField
              onChange={(e: any) => {
                getPrice(e.target.value);
                onChange(e);
              }}
              {...rest}
              fullWidth
              size="small"
              type="number"
              InputProps={{
                inputMode: 'numeric',
              }}
            />
          )}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        {basePrice && quantity ? basePrice * quantity : 0}
      </TableCell>
      <TableCell align="right" component="th" scope="row">
        {/* <Button onClick={() => handleDelete(index)} variant="outlined" color="error">delete</Button> */}
        <Button
          color="error"
          variant="outlined"
          // disabled={disableRemoveButton}
          onClick={() => removeProduct(index)}
          className="w-full lg:w-auto"
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default FormOrderProductEntry;


//material-ui
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BuyerDTO, CustomerDTO, defaultFilterParams, FilterDTO } from '@/pages/complex/default/orderData';
import { orderActions } from '@/features/complex/orderSlice'

//redux
// import { setAuthenticated } from '../../features/auth/userSlice'
// import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { fetchApiData } from '@/pages/complex/sync/DataLoad';

export default function OrderFilter(props: any) {
  const dispatch = useAppDispatch()
  const customers = props.customers
  const buyers = props.buyers

  const {
    handleSubmit,
    reset,
    control
  } = useForm<FilterDTO>({
    defaultValues: defaultFilterParams
  });

  const filterParams: FilterDTO = useAppSelector<FilterDTO>(
    (state: any) => state.order.filterParams
  );

  const resetForm = () => {
    console.log('asd')
    reset(defaultFilterParams);

    fetchApiData.orders({}).then(data => {
      dispatch(orderActions.setOrders(data[0]))
      dispatch(orderActions.setOrderPagination(data[1]))
    })
  };

  const filterFormSubmit: SubmitHandler<FilterDTO> = async (
    inputs: FilterDTO
  ) => {
    console.log(inputs)
    fetchApiData.orders(inputs).then(data => {
      dispatch(orderActions.setOrders(data[0]))
      dispatch(orderActions.setOrderPagination(data[1]))
    })
  };

  return (
    <>

      <form autoComplete="off" onSubmit={handleSubmit(filterFormSubmit)}>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="customer"
            control={control}
            defaultValue={filterParams.customer}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select labelId="demo-simple-select-label"
                  {...field}
                >
                  <MenuItem value={0}>
                    <em>Select Customer</em>
                  </MenuItem>
                  {customers &&
                    customers.map((row: CustomerDTO) => (
                      <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="order_number"
            control={control}
            defaultValue={filterParams.order_number}
            render={({ field: { onChange, value, ...rest } }) => (
              <TextField
                onChange={onChange}
                {...rest}
                value={value ?? ''}
                sx={{ mb: 3 }}
                label="Order Number"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Box>


        <Box
          sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(3, 1fr)', }}
        >
          <Controller
            name="buyer"
            control={control}
            defaultValue={filterParams.buyer}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  {...field}
                >
                  <MenuItem value={0}>
                    <em>Select Buyer</em>
                  </MenuItem>
                  {buyers &&
                    buyers.map((row: BuyerDTO) => (
                      <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            )}
          />
          {/* <TextField sx={{ flexGrow: 1 }}
                  name="title"
                  label="Start Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField sx={{ flexGrow: 1 }}
                  name="title"
                  label="End Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                /> */}

          <Controller
            name="start_date"
            control={control}
            defaultValue={filterParams.start_date}
            render={({ field }) => (
              <TextField sx={{ flexGrow: 1 }}
                onChange={field.onChange}
                value={field.value ?? ''}
                name="start_date"
                label="Start Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
          <Controller
            name="end_date"
            control={control}
            defaultValue={filterParams.end_date}
            render={({ field }) => (
              <TextField sx={{ flexGrow: 1 }}
                onChange={field.onChange}
                value={field.value ?? ''}
                name="end_date"
                label="End Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />

        </Box>

        <Box sx={{ display: 'flex', m: 1, gap: 1, flexDirection: 'row-reverse' }}>
          <Button variant="contained" style={{ backgroundColor: "#ffc400" }} color="warning" onClick={resetForm} type='button'>Reset</Button>
          <Button variant="contained" type="submit" style={{ backgroundColor: "#03a9f4" }}>Search</Button>
        </Box>
      </form >
    </>

  )

}

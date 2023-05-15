import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import jsonToFormData from '@ajoelp/json-to-formdata';

//material-ui
import PropTypes from 'prop-types';
import { Box, Container, Grid, TextField, Button, ButtonGroup, FormControl, Select, MenuItem, Paper, FormHelperText, Dialog, DialogTitle, Link, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

//redux
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import MasterLayout from '@/layouts/MasterLayout';
import ItemSection from '@/pages/complex/components/FormItem';
import { CustomerLocation } from '@/pages/complex/components/CustomerLocation';
import orderValidate from '@/pages/complex/validation/orderValidate';
import Head from 'next/head';
import { Controller, SubmitHandler, FormProvider, useForm, UseFormProps, UseFormReturn, useFormContext, UseFieldArrayReturn, FieldArrayPath } from 'react-hook-form';
import { OrderDTO, CustomerDTO, defaultOrderInput, BuyerDTO } from '@/pages/complex/default/orderData';
import * as Yup from 'yup';
import { orderActions } from '@/features/complex/orderSlice'
import { fetchApiData } from '@/pages/complex/sync/DataLoad';
import Swal from 'sweetalert2'
import { useRouter } from 'next/router';

export default function OrderForm() {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const orderId = Number(router.query.orderId)

  const [customerId, setCustomerId] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [file, setFile] = useState(null);
  const customers = useAppSelector((state) => state.order.customers)
  const buyers = useAppSelector((state) => state.order.buyers)
  const orderFormInput = useAppSelector((state) => state.order.orderFormInput)
  const [activeLocation, setActiveLocation] = useState('');
  const [customerLocations, setCustomerLocations] = useState<string[]>([]);
  const [reqDate, setreqDate] = useState(new Date());

  useEffect(() => {
    if (orderId > 0) {
      getOrder(orderId)
    } else {
      dispatch(orderActions.setOrderForm(defaultOrderInput))
    }
  }, [orderId])

  async function getOrder(orderId: number) {
    await fetchApiData.order(orderId).then(data => {
      setCustomerId(data.data.customer)
      setActiveLocation(data.data.customer_address)
      setFileUrl(data.data.attachment)
      data.data.attachment = null
      dispatch(orderActions.setOrderForm(data.data))
    })
    return true
  }


  const form: UseFormReturn<OrderDTO, UseFormProps> = useForm<OrderDTO>({
    resolver: yupResolver(orderValidate),
    defaultValues: defaultOrderInput,
  });

  const customerInputRegister = form.register("customer", { required: true })

  useEffect(() => {
    form.reset(orderFormInput);
  }, [orderFormInput, form]);

  useEffect(() => {
    getCustomerLocation(customerId, customers)
  }, [customerId, customers])


  const getCustomerLocation = async (customerId: number, customers: any) => {
    let customerObj: any = customers.filter((obj: any) => {
      return obj.id === customerId;
    });
    customerObj = customerObj[0] ?? null;

    if (customerObj && customerObj.locations) {
      setCustomerLocations(customerObj.locations);
    } else {
      setCustomerLocations([]);
    }
  }

  const getCustomerId = (event: any) => {
    setCustomerId(event.target.value)
  };

  const getFile = (file: any) => {
    setFile(file)
  };

  const convertDate = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
  };

  const orderFormSubmit = (input: OrderDTO) => {
    input.order_date = convertDate(new Date(input.order_date));
    input.delivery_date = convertDate(new Date(input.delivery_date));
    input.attachment = file;
    console.log(input)
    if (orderId > 0) {
      fetchApiData.orderUpdate(orderId, input).then(data => {
        Swal.fire({
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
          icon: "success",
          text: data.message
        })
        router.push('/complex')
      })
    } else {
      fetchApiData.orderStore(input).then(data => {
        Swal.fire({
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
          icon: "success",
          text: data.message
        })
        form.reset(orderFormInput);
      })
    }
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Head>
        <title>Order Form</title>
      </Head>

      <MasterLayout>
        <Container>
          <Paper elevation={1} sx={{ px: 3, py: 4 }}>
            <Box mt={3} ml={1}>
              <FormProvider {...form} >
                <form autoComplete="off" onSubmit={form.handleSubmit(orderFormSubmit)}>
                  <Grid item xs={12}>
                    <Typography align="center" variant="h4" gutterBottom>
                      Order Form
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <Controller
                        name="customer"
                        control={form.control}
                        render={({ field: { onChange, ...rest } }) => (
                          <FormControl fullWidth>
                            <Select
                              error={!!form.formState.errors['customer']}
                              {...rest}
                              onChange={(e) => {
                                // code
                                getCustomerId(e)
                                customerInputRegister.onChange(e)
                              }}
                            >
                              <MenuItem value={0}>
                                <em className={form.formState.errors['customer'] ? `text-red-600` : ''}>Select Customer</em>
                              </MenuItem>
                              {customers &&
                                customers.map((row: CustomerDTO) => (
                                  <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                                ))
                              }
                            </Select>
                            {form.formState.errors['customer'] ? (
                              <FormHelperText error={true}>{form.formState.errors['customer'].message}</FormHelperText>
                            ) : null}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="order_number"
                        control={form.control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Order Number"
                            type="text"
                            error={!!form.formState.errors['order_number']}
                            helperText={form.formState.errors['order_number'] ? form.formState.errors['order_number'].message : ''}
                          />
                        )}
                      />

                      <Controller
                        name="delivery_date"
                        control={form.control}
                        render={({ field: { value, onChange, ...rest } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...rest}
                              sx={{ width: 550 }}
                              label="Delivery Date"
                              disablePast={orderId === 0}
                              value={dayjs(value)}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <Controller
                        name="delivery_time"
                        control={form.control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="time"
                            label="Delivery Time"
                            sx={{ width: 550 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              step: 300, // 5 min
                            }}
                            error={!!form.formState.errors['delivery_time']}
                            helperText={form.formState.errors['delivery_time'] ? form.formState.errors['delivery_time'].message : ''}
                          />
                        )}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1, my: 2,
                      }}
                    >
                      <Controller
                        name="buyer"
                        control={form.control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <Select
                              error={!!form.formState.errors['buyer']}
                              {...field}
                            >
                              <MenuItem value={0}>
                                <em className={form.formState.errors['buyer'] ? `text-red-600` : ''}>Select Buyer</em>
                              </MenuItem>
                              {buyers &&
                                buyers.map((row: BuyerDTO) => (
                                  <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                                ))
                              }
                            </Select>
                            {form.formState.errors['buyer'] ? (
                              <FormHelperText error={true}>{form.formState.errors['buyer'].message}</FormHelperText>
                            ) : null}
                          </FormControl>
                        )}
                      />
                      <Controller
                        name="order_date"
                        control={form.control}
                        render={({ field: { value, onChange, ...rest } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...rest}
                              sx={{ width: 550 }}
                              label="Order Date"
                              disablePast={orderId === 0}
                              value={dayjs(value)}
                            />
                          </LocalizationProvider>
                        )}
                      />

                      <Controller
                        name="attachment"
                        control={form.control}
                        render={({ field: { onChange, ...rest } }) => (
                          <FormControl fullWidth>
                            <TextField
                              {...rest}
                              onChange={(e: any) => {
                                getFile(e.target.files[0]);
                                onChange(e);
                              }}
                              type="file"
                              label="Attachment"
                              error={!!form.formState.errors['attachment']}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            {fileUrl ? (
                              <ImageIcon color="primary" onClick={() => window.open(fileUrl)} />
                            ) : null}
                          </FormControl>
                        )}
                      />

                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1, my: 2,
                      }}
                    >
                      <CustomerLocation activeLocation={activeLocation} locations={customerLocations} customer={customerId} />

                    </Box>

                    <ItemSection getOrder={getOrder} orderId={orderId} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                      <Box sx={{ display: 'flex', my: 1, gap: 1, flexDirection: 'row' }}>
                        <Controller
                          name="remark"
                          control={form.control}
                          render={({ field: { ...rest } }) => (
                            <TextField
                              {...rest}
                              type="text"
                              label="Remark"
                              error={!!form.formState.errors['remark']}
                              helperText={form.formState.errors['remark'] ? form.formState.errors['remark'].message : ''}
                            />
                          )}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', m: 1, gap: 1, flexDirection: 'row-reverse' }}>
                        <ButtonGroup variant="outlined" aria-label="button group">
                          <Button color="success" type='submit'>Save</Button>
                          <Button color="warning" onClick={() => form.reset(orderFormInput)}>Reset</Button>
                        </ButtonGroup>
                      </Box>
                    </Box>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Paper>
        </Container >
      </MasterLayout>
    </>
  )
}
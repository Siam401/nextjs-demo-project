
import { styled } from '@mui/material/styles';
//material-ui
import { Box, Container, TableContainer, Paper, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import OrderFilter from '@/pages/complex/components/OrderFilter';
import OrderList from '@/pages/complex/components/OrderList';
import { useRouter } from 'next/router';
//redux
import { orderActions } from '@/features/complex/orderSlice'
// import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import { useEffect, useState } from 'react';
import MasterLayout from '@/layouts/MasterLayout';
import Head from 'next/head';
import { fetchApiData } from '@/pages/complex/sync/DataLoad';

export default function List() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const customers = useAppSelector((state) => state.order.customers)
  const buyers = useAppSelector((state) => state.order.buyers)
  const orders = useAppSelector((state) => state.order.orders)
  const pagination = useAppSelector((state) => state.order.orderPagination)

  useEffect(() => {
    fetchApiData.orders({}).then(data => {
      dispatch(orderActions.setOrders(data[0]))
      dispatch(orderActions.setOrderPagination(data[1]))
    })
  }, []);



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
        <title>Complex Page</title>
      </Head>

      <MasterLayout>
        <Container>
          <Paper elevation={1} sx={{ px: 3, py: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              <Button
                key="Add Order"
                onClick={() => router.push('/complex/0')}
                variant='contained'
                style={{
                  backgroundColor: "green",
                }}
                sx={{ my: 2, mx: 1, display: 'block' }}
              >
                Add Order
              </Button>
            </Box>

            <OrderFilter customers={customers} buyers={buyers} />

            <OrderList orders={orders} pagination={pagination} />

          </Paper>
        </Container >
      </MasterLayout >
    </>

  )

}

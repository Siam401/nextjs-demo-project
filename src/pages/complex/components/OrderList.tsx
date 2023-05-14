
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
//material-ui
import { TableContainer, Paper, Stack, Button, Table, TableBody, TableCell, TableHead, TableRow, Pagination, Select, MenuItem } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { CustomerDTO, defaultFilterParams, FilterDTO, OrderSummaryDTO } from '@/pages/complex/default/orderData';
import OrderFilter from '@/pages/complex/components/OrderFilter';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fetchApiData } from '@/pages/complex/sync/DataLoad';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import { orderActions } from '@/features/complex/orderSlice'
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import Swal from 'sweetalert2'

export default function OrderList(props: any) {
  const orders = props.orders
  const pagination = props.pagination
  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [deleteOrder, setDeleteOrder] = useState<number>(0);

  const handleEditForm = (id: number) => {
    push('/complex/' + id);
  };


  const openDelete = (id: number) => {
    setOpenDialog(true);
    setDeleteOrder(id);
  };

  const handleDelete = async () => {
    if (deleteOrder > 0) {
      setOpenDialog(false);
      await fetchApiData.deleteOrder(deleteOrder).then(data => {
        Swal.fire({
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
          icon: "success",
          text: data.message
        })
        setOpenDialog(false);
        fetchApiData.orders({}).then(data => {
          dispatch(orderActions.setOrders(data[0]))
          dispatch(orderActions.setOrderPagination(data[1]))
        })
      })
    }
  };

  const handlePageChange = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    if (pagination.meta.current_page !== value) {
      await fetchApiData.orders({ page: value }).then(data => {
        dispatch(orderActions.setOrders(data[0]))
        dispatch(orderActions.setOrderPagination(data[1]))
      })
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className="w-full" aria-label="Order Table">
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell align="center">Order Date</TableCell>
              <TableCell align="center">Delivery Date</TableCell>
              <TableCell align="center">Total Price</TableCell>
              <TableCell align="center">Attachment</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders &&
              orders.map((order: OrderSummaryDTO) => (
                <TableRow key={order.id}>
                  <TableCell component="th" scope="row">
                    {order.order_number}
                  </TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.buyer_name}</TableCell>
                  <TableCell align="center">
                    {order.order_date}
                  </TableCell>
                  <TableCell align="center">
                    {order.delivery_date}
                  </TableCell>
                  <TableCell align="center">
                    {order.total_amount}
                  </TableCell>
                  <TableCell align="center">
                    {order.attachment ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        href={order.attachment}
                        target="_blank"
                      >
                        Download
                      </Button>
                    ) : (
                      'n/a'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      type="button"
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => handleEditForm(order.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => openDelete(order.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {orders && (
        <Stack spacing={2} alignItems="center" sx={{ my: 4 }}>
          <Pagination
            count={
              pagination?.meta?.total
                ? Math.ceil(pagination.meta.total / pagination.meta.per_page)
                : 1
            }
            page={pagination?.meta?.current_page ?? 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}

      <Dialog
        maxWidth={"xs"}
        fullWidth={true}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>

  )

}

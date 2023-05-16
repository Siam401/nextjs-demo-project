
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
//material-ui
import { TableContainer, Paper, Stack, Button, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, Pagination } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import HideImageIcon from '@mui/icons-material/HideImage';
import { OrderSummaryDTO } from '@/pages/complex/default/orderData';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fetchApiData } from '@/pages/complex/sync/DataLoad';
import { useAppDispatch } from '@/core/redux/store';
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <TableContainer component={Paper}>
        <Table className="w-full" aria-label="Order Table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order Number</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Buyer</StyledTableCell>
              <StyledTableCell align="center">Order Date</StyledTableCell>
              <StyledTableCell align="center">Delivery Date</StyledTableCell>
              <StyledTableCell align="center">Total Price</StyledTableCell>
              <StyledTableCell align="center">Attachment</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders &&
              orders.map((order: OrderSummaryDTO) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell component="th" scope="row">
                    {order.order_number}
                  </StyledTableCell>
                  <StyledTableCell>{order.customer_name}</StyledTableCell>
                  <StyledTableCell>{order.buyer_name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {order.order_date}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {order.delivery_date}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {order.total_amount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {order.attachment ? (
                      <ImageIcon color="primary" onClick={() => window.open(order.attachment)} />
                    ) : (
                        <HideImageIcon />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="right">
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
                  </StyledTableCell>
                </StyledTableRow>
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

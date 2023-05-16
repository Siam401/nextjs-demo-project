import { useEffect, useState } from 'react';
import * as React from 'react';
import itemDTO from '../default/itemData';
// import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Swal from 'sweetalert2'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import axios from 'axios';
import { setItemList, setItemForm, resetFormInput } from '@/features/simple/itemSlice'

const ItemTable = () => {
  const dispatch = useAppDispatch();
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [tableData, setTableData] = useState<itemDTO[]>([]);
  const [deleteItemId, setDeleteItemId] = useState(0);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id: number) => {
    setDeleteItemId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const [deleteItem, setDeleteItem] = useState<number>(0);

  const items = useAppSelector((state) => state.item.items);

  useEffect(() => {
    setTableData(items);
  }, [items]);

  const handleEditForm = async (id: number) => {
    console.log(id)
    if (id > 0) {
      items.map((row) => {
        if (row.id === id) {
          dispatch(setItemForm({
            name: row.name,
            code: row.code,
            head: row.head,
            status: Boolean(row.status),
            id: row.id,
          }))
        }
        return true
      });
    }
  };

  const heads = useAppSelector((state) => state.item.heads);
  const getHeadNameById = (id: number) => {
    let head: any = heads.filter((obj: any) => {
      return obj.id === id;
    });

    return head[0] ? head[0].value : '';
  };

  const handleDelete = async () => {
    await axios.delete(BASE_URL + `simple/items/${deleteItemId}`).then(({ data }) => {
      Swal.fire({
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1500,
        icon: "success",
        text: data.message
      })
      setOpen(false);
      fetchItems()
      dispatch(resetFormInput())
    })
  };

  const fetchItems = async () => {
    await axios.get(BASE_URL + `simple/items`).then(({ data }) => {
      dispatch(setItemList(data.data))
    })
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="center">Head</TableCell>
              <TableCell align="center">Code</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData &&
              tableData.map((item: itemDTO) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="center">
                    {getHeadNameById(item.head)}
                  </TableCell>
                  <TableCell align="center">{item.code}</TableCell>
                  <TableCell align="center">
                    {item.status ? (
                      <small className="bg-green-500 p-2 rounded-2xl text-white">
                        Active
                      </small>
                    ) : (
                      <small className="bg-red-500 p-2 rounded-2xl text-white">
                        In-active
                      </small>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                        onClick={() => handleEditForm(item.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleClickOpen(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        display="flex"
        justifyContent="right"
        alignItems="center"
        sx={{ mt: 4 }}
      >
      </Box>

      <Dialog
        maxWidth={"xs"}
        fullWidth={true}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemTable;

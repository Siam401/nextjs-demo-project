
import SaveIcon from '@mui/icons-material/Save';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import itemDTO, { defaultItemInput } from '../default/itemData';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import { useEffect, useState } from 'react';
import { setItemList, resetFormInput } from '@/features/simple/itemSlice'
import Swal from 'sweetalert2'

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import axios from 'axios';

const ItemForm = () => {

  const heads = useAppSelector((state) => state.item.heads);
  const itemInput = useAppSelector((state) => state.item.formInput);
  const dispatch = useAppDispatch();
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<itemDTO>({
    defaultValues: defaultItemInput,
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string()
          .required('Item name is required')
          .min(3, 'Name must be at least 3 characters'),
        code: Yup.string()
          .required('Item code is required')
          .matches(
            /^[A-Z0-9]*$/,
            'Code must contain only uppercase letters and digits'
          ),
        head: Yup.number()
          .min(1, 'Please select a valid option')
          .required('Item head is required'),
        status: Yup.bool().nullable(),
      })
    ),
  });

  useEffect(() => {
    reset(itemInput);
  }, [itemInput, reset]);

  const itemFormSubmit: SubmitHandler<itemDTO> = async (inputs: itemDTO) => {
    console.log(inputs)
    setLoading(true)
    if (inputs.id == 0) {
      await axios.post(BASE_URL + `simple/items`, inputs).then(({ data }) => {
        Swal.fire({
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
          icon: "success",
          text: data.message
        })
        fetchItems()
        dispatch(resetFormInput())
        reset(defaultItemInput)
        setLoading(false)
      })
    } else {
      await axios.put(BASE_URL + `simple/items/` + inputs.id, inputs).then(({ data }) => {
        Swal.fire({
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
          icon: "success",
          text: data.message
        })
        fetchItems()
        dispatch(resetFormInput())
        reset(defaultItemInput)
        setLoading(false)
      })
    }

  };

  const fetchItems = async () => {
    await axios.get(BASE_URL + `simple/items`).then(({ data }) => {
      dispatch(setItemList(data.data))
    })
  }

  function resetForm() {
    reset(defaultItemInput)
    dispatch(resetFormInput())
  }

  return (
    <Paper elevation={1} sx={{ px: 3, py: 4 }}>
      <div className="text-xl font-bold text-center mb-5">
        Item Form
      </div>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(itemFormSubmit)}
        sx={{ mt: 1 }}
      >
        <input type="hidden" name="id" value={itemInput.id} />
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <TextField
              onChange={onChange}
              value={value}
              {...rest}
              sx={{ mb: 2 }}
              label="Item Name"
              fullWidth
              required
              error={!!errors['name']}
              helperText={errors['name'] ? errors['name'].message : ''}
            />
          )}
        />
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              sx={{ mb: 2 }}
              label="Code"
              fullWidth
              required
              error={!!errors['code']}
              helperText={errors['code'] ? errors['code'].message : ''}
            />
          )}
        />

        <Controller
          control={control}
          name="head"
          defaultValue={0}
          render={({ field }) => (
            <FormControl fullWidth error>
              <Select {...field} error={!!errors['head']}>
                <MenuItem value="0">
                  <em className={errors['head'] ? `text-red-600` : ''}>
                    Choose Item Head
                  </em>
                </MenuItem>

                {heads &&
                  heads.map(({ id, value }: any) => (
                    <MenuItem key={id} value={id}>
                      {value}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />

        <FormControlLabel
          control={
            <Controller
              name="status"
              control={control}
              defaultValue={false}
              render={({ field: { onChange, value, ...rest } }) => (
                <>
                  <Checkbox {...rest} checked={value} onChange={onChange} />
                </>
              )}
            />
          }
          label="Is Active?"
          sx={{ mt: 1 }}
          labelPlacement="start"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <LoadingButton
              loading={loading}
              variant="outlined"
              color="primary"
              fullWidth
              type="submit"
              loadingPosition="start"
              sx={{ py: '0.8rem', mt: '1rem' }}
              startIcon={<SaveIcon />}
            >
              <span>Save</span>
            </LoadingButton>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ py: '0.8rem', mt: '1rem' }}
              onClick={resetForm}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ItemForm;
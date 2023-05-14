import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, List, Dialog, DialogTitle, ListItem, ListItemText, ListItemButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { boolean } from 'yup';
import { Controller, SubmitHandler, FormProvider, useForm, UseFormProps, UseFormReturn, useFormContext } from 'react-hook-form';
import { OrderDTO } from '../default/orderData';

type PropTypes = {
  locations: object[];
}

export function CustomerLocation(props: PropTypes) {
  const { locations } = props;
  const form = useFormContext<OrderDTO>();

  const [open, setOpen] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState(false);

  useEffect(() => {
    if (locations.length != 0) {
      setActiveButton(true)
    } else {
      setActiveButton(false)
    }
    form.setValue('customer_address', '');
  }, [locations]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: any) => {
    setOpen(false);
  };

  const handleListItemClick = (value: any) => {
    console.log(value)
    form.setValue('customer_address', value);
    setOpen(false);
  };

  return (
    <>
      <Controller
        name="customer_address"
        control={form.control}
        render={({ field: { ...rest } }) => (
          <TextField sx={{ flexGrow: 1 }}
            {...rest}
            disabled
            name="customer_address"
            hiddenLabel
            error={!!form.formState.errors['order_date']}
            helperText={form.formState.errors['order_date'] ? form.formState.errors['order_date'].message : ''}
          />
        )}
      />
      <Button disabled={!activeButton} onClick={handleClickOpen} variant="outlined" color="primary">Add Address</Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Select Customer Address</DialogTitle>
        <List sx={{ pt: 0 }}>
          {locations.map((row: any) => (
            <ListItemButton onClick={() => handleListItemClick(row)} key={row}>
              <LocationOnIcon />
              <ListItemText sx={{ mx: 1 }} primary={row} />
            </ListItemButton>
          ))}
        </List>
      </Dialog>
    </>
  );
}

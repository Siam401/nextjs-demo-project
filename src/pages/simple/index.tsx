import MasterLayout from '@/layouts/MasterLayout';
import ItemForm from '@/pages/simple/components/ItemForm';
import ItemSearch from '@/pages/simple/components/ItemSearch';
import ItemTable from '@/pages/simple/components/ItemTable';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Head from 'next/head';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/redux/store';
import { setHead, setItemList } from '@/features/simple/itemSlice'

const Simple = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchHeads()
    fetchItems()
  }, [])


  const fetchHeads = async () => {
    await axios.get(`http://auth-simple-complex-react-laravel.local/api/simple/heads`).then(({ data }) => {
      dispatch(setHead(data.data))
    })
  }

  const fetchItems = async () => {
    await axios.get(`http://auth-simple-complex-react-laravel.local/api/simple/items`).then(({ data }) => {
      dispatch(setItemList(data.data))
    })
  }

  return (
    <>
      <Head>
        <title>Simple Page</title>
      </Head>

      <MasterLayout>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item lg={5} xs={12} sx={{ p: 3 }}>
              <ItemForm />
            </Grid>
            <Grid item lg={7} xs={12} sx={{ p: 3 }}>
              <Paper elevation={1} sx={{ px: 3, py: 4 }}>
                <ItemSearch />
                <ItemTable />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </MasterLayout>
    </>
  );
}

export default Simple;
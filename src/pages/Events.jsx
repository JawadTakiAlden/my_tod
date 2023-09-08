import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import EventCard from '../layouts/EventCard'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import { tokens } from '../assets/theme'
import AddButton from '../components/AddButton'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import CubeLoader from '../components/CubeLoader/CubeLoader'


const getEeventFromServer = () => {
    return request({
        url : '/events',
        method : 'get'
    })
}


const createNewEventInServer = (values) => {
    return request({
        url : '/events',
        method : 'POST',
        headers : {
            "Content-Type": "multipart/form-data"
        },
        data : values
    })
}


const Events = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [addEventDialogOpen , setAddEventDialogOpen] = useState(false)
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const onAddEventDialogOpen = () => {
        setAddEventDialogOpen(true)
    }
    const onAddEventDialogClose = () => {
        setAddEventDialogOpen(false)
    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const events = useQuery({
        queryKey : ['get-events-from-server'],
        queryFn : getEeventFromServer
    })


    const createNewEvent = useMutation({
        mutationKey : ['create-new-event-in-server'],
        mutationFn : createNewEventInServer,
        onSuccess : (data) => {
            events.refetch()
        },
        onError : (error) => {
            if(!error.response || error.message === 'Network Error'){
                setError("obbs , you have internet connection problems")
                setOpen(true)
                return
            }
            switch(error.response.status){
                case 404 : {
                    setError("obbs , you're out of space , the destenation not found in our system")
                    setOpen(true)
                    break ;
                }
                case 401 : {
                    setError("you're not authorize to create new event in our system")
                    setOpen(true)
                    break ;
                }

                case 500 : {
                    setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                    setOpen(true)
                    break
                }
                case 422 : {
                    setError("obbs , may you are making some mistake in your entered data")
                    setOpen(true)
                    break
                }
                default : {
                    setError(`obbs ,unknown error happend with status code ${error.status}`)
                    setOpen(true)
                    break
                }
            }  
        }
    })

    const handleFormSubmit = (values) => {
        let neValues = {
            name : values.name,
            image_cover : values.imageFile
        }
        createNewEvent.mutate(neValues)
        setAddEventDialogOpen(false)
    }
    

      if(events.isLoading){
        return <CubeLoader />
      }

      if(events.isError){
        if(events.error.response.status !== 401){
            events.refetch()
            return
        }else{
            return <Typography color={'seashell'} variant='h1'>error</Typography>
        }
      }

  return (
    <>
    <Box>
        <AddButton color={colors.indigoAccent[500]} reactionFunction={onAddEventDialogOpen} />
        {
            events?.data?.data?.events.length === 0 && (
                <Typography
                    sx={{
                      color : colors.pinkAccent[500],
                      textAlign : 'center'
                    }}
                    variant='h2'
                  >
                    No Events until now
                  </Typography>
            )
        }
        <GridBox spacing={2}>
            {
                    events?.data?.data?.events?.map(event => (
                    <GridItem xs={12} sm={6} md={4} lg={3}>
                        <EventCard eventData={event} refetch={events.refetch} />
                    </GridItem>
                ))
            }
        </GridBox>
    </Box>
        <Dialog
            open={addEventDialogOpen}
            maxWidth={'xs'}
        >
        <DialogTitle
                sx={{
                    color : colors.yellowAccent[500] ,
                    textAlign : 'center',
                    textTransform : 'capitalize'
                }}
            >create new Event</DialogTitle>
        <DialogContent>
            <DialogContentText
            sx={{
                textAlign : 'center',
                marginBottom : '10px'
            }}
            >
                after you click on create button , new Event will publish for all users, and dont worry you can delete Event if you make a mistake
            </DialogContentText>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
            >
                {
                    (
                    {
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue
                    }
                    ) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn:"span 4" },
                            }}
                        >
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Event Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            name="name"
                            error={!!touched.name && !!errors.name}
                            helperText={touched.name && errors.name}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="file"
                            label="Image"
                            onBlur={handleBlur}
                            // onChange={handleChange}
                            onChange={(e) => {
                                        setFieldValue('imageFile' , e.currentTarget.files[0])
                                        handleChange(e)
                                    }}
                            value={values.image}
                            name="image"
                            error={!!touched.image && !!errors.image}
                            helperText={touched.image && errors.image}
                            sx={{ gridColumn: "span 4" }}
                        />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="success" variant="contained">
                            add
                        </Button>
                        </Box>
                    </form>
                    )
                }
            </Formik>
        </DialogContent>
        <DialogActions>
            <Button onClick={onAddEventDialogClose} color="error">
                Cancel
            </Button>
        </DialogActions>
        </Dialog>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
        </>
  )
}

const validationSchema = Yup.object({
    name :  Yup.string().required('event name field is required'),
    image :  Yup.string().required('cover image of event is required'),
  })
  
  const initialValues = {
    name : '',
    image : '',
    imageFile : {}
  }
  

export default Events
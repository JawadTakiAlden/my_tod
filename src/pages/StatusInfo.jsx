import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import AddButton from '../components/AddButton'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import StatusCard from '../components/StatusCard'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { request } from '../api/request'
import { useMutation, useQuery } from '@tanstack/react-query'
import CubeLoader from '../components/CubeLoader/CubeLoader'

const addNewSubStatusInServer = (values) => {
    return request({
        url : '/substatus',
        method : 'post',
        headers : {
            "Content-Type" : 'multipart/form-data',
        },
        data : values
    })
}


const StatusInfo = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [deleteFAQDialogOpen , setDeleteFAQDialogOpen] = useState(false)
    const {statusID} = useParams()
    const handleFormSubmit = (values) => {
        let data = {
            image : values.imageFile,
            name : values.name,
            status_id : statusID
        }
        addNewSubStatusMutation.mutate(data)
    }

    const addNewSubStatusMutation = useMutation({
        mutationKey : ['add-new-subb-status-mutation'],
        mutationFn : addNewSubStatusInServer
    })
    const onDeleteFAQDialogOpen = () => {
        setDeleteFAQDialogOpen(true)
      }
      const onDeleteFAQDialogClose = () => {
        setDeleteFAQDialogOpen(false)
      }
      const onDeleteFAQDialogConfirm = () => {
        onDeleteFAQDialogClose()
      }
      const getStatusFromServer = () => {
        return request({
            url : `/status/${statusID}`,
        })
    }

    const c = useQuery({
        queryKey : [`get-substatus-${statusID}-from-se`],
        queryFn : getStatusFromServer
    })
    if(c.isLoading){
        return <CubeLoader />
    }
    const substatus = c.data.data.status.substatus

        return (
            <>
            <Box>
                <AddButton color={colors.indigoAccent[500]} reactionFunction={onDeleteFAQDialogOpen} />
                <GridBox
                    spacing={1}
                >
                    {
                        substatus.map(subStatus => (
                            <GridItem xs={12} sm={6} md={4} lg={3} key={substatus.id}>
                                <StatusCard subStatus={subStatus} />
                            </GridItem>
                        ))
                    }
                </GridBox>
            </Box>
            <Dialog
                    open={deleteFAQDialogOpen}
                    maxWidth={'xs'}
                >
                <DialogTitle
                        sx={{
                            color : colors.yellowAccent[500] ,
                            textAlign : 'center',
                            textTransform : 'capitalize'
                        }}
                    >create new Sub Status</DialogTitle>
                <DialogContent>
                    <DialogContentText
                    sx={{
                        textAlign : 'center',
                        marginBottom : '10px'
                    }}
                    >
                     after you click on create button , new sub status will add for all users , take care this action cant be undo
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
                                    label="Name"
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
                    <Button onClick={onDeleteFAQDialogClose} color="error">
                        Cancel
                    </Button>
                </DialogActions>
                </Dialog>
        </>
        )
}

const validationSchema = Yup.object({
    name :  Yup.string().required('name field is required'),
    image :  Yup.string().required('image field is required'),
  })
  
  const initialValues = {
    name : '',
    image : '',
    imageFile : ''
  }

    export default StatusInfo
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, Snackbar, TextField, useTheme } from '@mui/material'
import React from 'react'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import StatusCard from '../components/StatusCard'
import AddButton from '../components/AddButton'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import StatusCard2 from '../components/StatusCard2'
import { useMutation, useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import { useNavigate } from 'react-router'
import CubeLoader from '../components/CubeLoader/CubeLoader'

const getStatusFromServer = () => {
    return request({
        url : '/status'
    })
}

const addStatusToServer = (values) => {
    return request({
        url : '/status',
        method : 'post',
        data : values
    })
}

const getAgeSectionsFromServer = () => {
    return request({
        url : '/age-section'
    })
}

const Status = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [addStatusDialogOpen , setAddStatusDialogOpen] = useState(false)
    const [openSnackbar , setOpenSnackbar] = useState(false)
    const [error , setError] = useState("")
    const navigate = useNavigate()
    const handleFormSubmit = (values) => {
        addStatusMutation.mutate(values)
        onAddStatusDialogClose()
    }
    const onAddStatusDialogOpen = () => {
        setAddStatusDialogOpen(true)
      }
      const onAddStatusDialogClose = () => {
        setAddStatusDialogOpen(false)
      }

      const handelAlterClose = () => {
        setOpenSnackbar(false)
      }


      const addStatusMutation = useMutation({
        mutationKey : ['add-new-status-to-server'],
        mutationFn : addStatusToServer,
        onSuccess : (data) => {
            getStatusQuery.refetch()
            },
            onError : (error) => {
              if(!error?.response && error?.message === 'Network Error'){
                  setError("obbs , you have internet connection problems")
                  setOpenSnackbar(true)
                  return
              }
              switch(error.response.status){
                  case 404 : {
                      setError("obbs , you're out of space , the destenation not found in our system")
                      setOpenSnackbar(true)
                      break ;
                  }
                  case 401 : {
                      setError(`you're not authorize to create new question and answer in our system`)
                      setOpenSnackbar(true)
                      break ;
                  }
      
                  case 422 : {
                    setError(`check your entered data , there are some mistake`)
                    setOpenSnackbar(true)
                    break ;
                  }
      
                  case 500 : {
                      setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                      setOpenSnackbar(true)
                      break
                  }
                  default : {
                      setError(`obbs ,unknown error happend with status code ${error.status}`)
                      setOpenSnackbar(true)
                      break
                  }
              }  
          }

      })

      const getStatusQuery = useQuery({
        queryKey : ['get-status-from-server'],
        queryFn : getStatusFromServer
      })

      const getAgeSectionsQuery = useQuery({
        queryKey : ['get-age-sections-from-server'],
        queryFn : getAgeSectionsFromServer
      })


      if(getStatusQuery.isLoading || getAgeSectionsQuery.isLoading){
        return <CubeLoader />
      }
    
      if(getStatusQuery.isError || getAgeSectionsQuery.isError){
        if(getStatusQuery.error.response.status === 401){
          navigate('/auth/signin')
        }else{
            getStatusQuery.refetch()
            getAgeSectionsQuery.refetch()
        }
      }

      console.log(getStatusQuery.data.data)
  return (
    <>
    <Box>
        <AddButton color={colors.indigoAccent[500]} reactionFunction={onAddStatusDialogOpen} />
        <GridBox
            spacing={1}
        >
            {
                getStatusQuery.data.data.map((status) => (        
                    <GridItem key={status.id} xs={12} sm={6} md={4} lg={3}>
                        <StatusCard2 data={status} ageSections={getAgeSectionsQuery.data.data.data} />
                    </GridItem>
                ))
            }
        </GridBox>
    </Box>
    <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handelAlterClose}>
            <Alert onClose={handelAlterClose} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
    <Dialog
    open={addStatusDialogOpen}
    maxWidth={'xs'}
>
<DialogTitle
        sx={{
            color : colors.yellowAccent[500] ,
            textAlign : 'center',
            textTransform : 'capitalize'
        }}
    >create new FAQ</DialogTitle>
<DialogContent>
    <DialogContentText
    sx={{
        textAlign : 'center',
        marginBottom : '10px'
    }}
    >
    after you click on create button , new FAQ will publish for all users and this FAQ cant be update later so take care while writing, and dont worry you can delete FAQ if you make a mistake
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
                    label="Status Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ gridColumn: "span 4" }}
                />
                <Select
                    value={values.ageSection_id}
                    onChange={handleChange}
                    autoWidth
                    label="Age Section"
                    name={'ageSection_id'}
                >
                    {
                        getAgeSectionsQuery.data.data.data.map(ageSection => (
                            <MenuItem key={ageSection.id} value={ageSection.id}>From {ageSection.from} To {ageSection.to} Year</MenuItem>
                        ))
                    }
                </Select>
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
    <Button onClick={onAddStatusDialogClose} color="error">
        Cancel
    </Button>
</DialogActions>
</Dialog>
</>
  )
}

const validationSchema = Yup.object({
    name :  Yup.string().required('name field is required'),
    ageSection_id :  Yup.string().required('age section should be choosen field is required'),
  })
  
  const initialValues = {
    name : '',
    ageSection_id : 1,
  }

export default Status
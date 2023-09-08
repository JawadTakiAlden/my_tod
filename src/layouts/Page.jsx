import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Select, Snackbar, TextField, useMediaQuery, useTheme } from '@mui/material'
import React, {  useState } from 'react'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import { DeleteOutlined, NavigateNextOutlined } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import { DataGrid, GridNoRowsOverlay, GridToolbar } from '@mui/x-data-grid'
import SaveAction from '../components/SaveAction'
import { useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { request } from '../api/request'
import CubeLoader from '../components/CubeLoader/CubeLoader'

const Page = ({columns , data , name , link , formInputs , validationSchema , valuesShouldUpdate , initialValues }) => {
    const [clickedRow , setClickedRow] = useState()
    const [deleteRowDialogOpen , setDeleteRowDialogOpen] = useState(false)
    const [fromOpen , setFormOpen] = useState(false)
    const [rowId , setRowId] = useState(null)
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const isNoneMobile = useMediaQuery('(min-width : 600px')
    const location = useLocation()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    // start working with backend logic

    // add to server 
    const addToServer = (values) => {
        return request({
            url : `/${link.path}`,
            method : 'POST',
            headers : {
                'Content-Type' : "multipart/form-data"
            },
            data : values
        })
    }

    const addToServerMutation = useMutation({
        mutationKey : [`add-${name.slice(-1,1)}-to-server`],
        mutationFn : addToServer,
        onSuccess : (data) => {
            console.log(data)
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
                    setError(`you're not authorize to create new ${name.slice(-1 , 1)} in our system`)
                    setOpen(true)
                    break ;
                }

                case 422 : {
                    setError(`you're make some mistake with data entered by you , check it and try again`)
                    setOpen(true)
                    break ;
                }

                case 500 : {
                    setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                    setOpen(true)
                    break
                }
                default : {
                    setError(`obbs ,unknown error happend with status code ${error.response.status}`)
                    setOpen(true)
                    break
                }
            }  
        }
    })



    // delete from server
    const deleteFromServer = (id) => {
        return request({
            url : `/${link.path}/${id}`,
            method : 'delete'
        })
    }

    const deleteFromServerMutation = useMutation({
        mutationKey : [`delete-${name.slice(-1 , 1)}-from-server`],
        mutationFn : deleteFromServer,
        onSuccess : (data) => {
            console.log(data)
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
                    setError(`you're not authorize to create new ${name.slice(-1 , 1)} in our system`)
                    setOpen(true)
                    break ;
                }

                case 500 : {
                    setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
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

    // end working with backend logic
    
    const addHandler = (values) => {
        let data = {
            ...values
        }
        if(values.image){
            data.image = values.imageFile
        }
        // console.log(data)
        addToServerMutation.mutate(data)
    }

    
    const columnWithAction = useMemo(() => (
        [
            ...columns,
            {
                field : 'action',
                type : 'actions',
                headerName : 'Actions',
                width : 300,
                renderCell : (params) => (
                    <Box
                        sx={{
                            display : 'flex',
                            alignItems : 'center',
                            gap : '5px'
                        }}
                    >
                        <IconButton
                            component={Link}
                            to={`${location.pathname}/${params.row.id}`}
                            state={{
                                data : params.row
                            }}
                        >
                            <NavigateNextOutlined />
                        </IconButton>
                        <SaveAction {...{params , rowId , setRowId , name , valuesShouldUpdate}} />
                        <IconButton
                            onClick={() => onDeleteRowDialogOpen(params.row.id)}
                        >
                            <DeleteOutlined color='error'/>
                        </IconButton>
                    </Box>
                )
            }
        ]
    ) , [rowId])
        

    const onDeleteRowDialogOpen = (id) => {
        setClickedRow(id)
        setDeleteRowDialogOpen(true)
    }

    const onDeleteRowDialogClose = () => {
        setDeleteRowDialogOpen(false)
    }


    const onDeleteRowDialogConfirm = () => {
        deleteFromServerMutation.mutate(clickedRow)
        onDeleteRowDialogClose()
    }

    const addFormOpen = () => {
        setFormOpen(true)
    }
    
    const closeAddForm = () => {
        setFormOpen(false)
    }

    // const initial = {}

    // formInputs.map(input => {
    //     initial[input.name] = input.initialValues
    //     if(input.type === 'file'){
    //         initial.imageFile = ''
    //     }
    // })

    // console.log(initial)
    // const InputFields = ({handleBlur , handleChange , touched , errors , values , setFieldValue}) => {

    //     const fields = formInputs.map((input , i) => {
    //         initial[input.name] = input.initialValues
    //         if(input.type === 'select'){
    //             return <Select
    //                 value={values[input.name]}
    //                 onChange={handleChange}
    //                 autoWidth
    //                 label="Role"
    //                 name={input.name}
    //             >
    //                 {
    //                     input.valueOptions.map((valueObj  , i)=> (
    //                         <MenuItem value={valueObj.value} key={i}>{valueObj.name}</MenuItem>
    //                     ))
    //                 }
    //             </Select>
    //         }

    //         if(input.type === 'file'){
    //             return <TextField 
    //             key={i}
    //             fullWidth={input.fullWidth}
    //             variant="filled"
    //             type={input.type}
    //             label={input.lable}
    //             onBlur={handleBlur}
    //             onChange={(e) => {
    //                 setFieldValue('imageFile' , e.currentTarget.files[0])
    //                 handleChange(e)
    //             }}
    //             value={values[input.name]}
    //             name={input.name}
    //             error={!!touched[input.name] && !!errors[input.name]}
    //             helperText={touched[input.name] && errors[input.name]}
    //             sx={{ 
    //                 gridColumn: "span 2",
    //             }}
    //         />
    //         }


    //         return (
    //             <TextField 
    //                 key={i}
    //                 fullWidth={input.fullWidth}
    //                 variant="filled"
    //                 type={input.type}
    //                 label={input.lable}
    //                 onBlur={handleBlur}
    //                 onChange={handleChange}
    //                 value={values[input.name]}
    //                 name={input.name}
    //                 error={!!touched[input.name] && !!errors[input.name]}
    //                 helperText={touched[input.name] && errors[input.name]}
    //                 sx={{ 
    //                     gridColumn: "span 2",
    //                 }}
    //             />
    //         )
    //     })

    //     return fields
    // }

    

    // loading while requests done
    if(addToServerMutation.isLoading || deleteFromServerMutation.isLoading){
        return <CubeLoader />
    }

  return (
    <>
        <Button
            color='secondary'
            sx={{
                marginBottom : '10px',
                border : `1px solid ${colors.yellowAccent[500]}`,
                textTransform : 'capitalize'
            }}
            onClick={addFormOpen}
        >
            new {name}
        </Button>
        {
            fromOpen && (
                <Box
            sx={{
                width : '90%',
                margin : '20px auto'
            }}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={addHandler}
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
                                "& > div": { gridColumn: isNoneMobile ? undefined : "span 4" },
                                }}
                            >
                                    {
                                        formInputs.map((input , i) => {
                                            // initial[input.name] = input.initialValues
                                            if(input.type === 'select'){
                                                return <Select
                                                    value={values[input.name]}
                                                    onChange={handleChange}
                                                    autoWidth
                                                    label="Role"
                                                    name={input.name}
                                                    sx={{
                                                        gridColumn: "span 2",
                                                    }}
                                                >
                                                    {
                                                        input.valueOptions.map((valueObj  , i)=> (
                                                            <MenuItem value={valueObj.value} key={i}>{valueObj.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            }
                                
                                            if(input.type === 'file'){
                                                // initial.imageFile = {}
                                                return <TextField 
                                                key={i}
                                                fullWidth={input.fullWidth}
                                                variant="filled"
                                                type={input.type}
                                                label={input.lable}
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    setFieldValue('imageFile' , e.currentTarget.files[0])
                                                    handleChange(e)
                                                }}
                                                value={values[input.name]}
                                                name={input.name}
                                                error={!!touched[input.name] && !!errors[input.name]}
                                                helperText={touched[input.name] && errors[input.name]}
                                                sx={{ 
                                                    gridColumn: "span 2",
                                                }}
                                            />
                                            }
                                
                                
                                            return (
                                                <TextField 
                                                    key={i}
                                                    fullWidth={input.fullWidth}
                                                    variant="filled"
                                                    type={input.type}
                                                    label={input.lable}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values[input.name]}
                                                    name={input.name}
                                                    error={!!touched[input.name] && !!errors[input.name]}
                                                    helperText={touched[input.name] && errors[input.name]}
                                                    sx={{ 
                                                        gridColumn: "span 2",
                                                    }}
                                                />
                                            )
                                        })   
                                    }

                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px" gap={'5px'}>
                                <Button type="submit" color="success" variant="contained">
                                    add
                                </Button>
                                <Button
                                    color='error'
                                    onClick={closeAddForm}
                                >
                                    cancel
                                </Button>
                            </Box>
                        </form>
                        )
                    }
                </Formik>
                </Box>
            )
        }
        <Box>
        <Box 
      sx={{ 
         height : '500px',
         maxWidth : '100%',
         overflowX : 'auto'
      }}
    >
      <DataGrid
        rows={data}
        columns={columnWithAction}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        
        pageSizeOptions={[5 , 10]}
        sx={{
          '& .MuiDataGrid-columnHeaders' : {
            backgroundColor : colors.yellowAccent[500]
          },
          '& .MuiDataGrid-footerContainer' : {
            backgroundColor : colors.yellowAccent[500]
          },
          '& .MuiDataGrid-virtualScroller' : {
            backgroundColor : 'transparent'
          },
          '& .MuiDataGrid-cell--editing':{
            backgroundColor : `${colors.primary[500]} !important`
          },
          "&" : {
            height : '100%',
            width : '100%'
          },
          "& .MuiDataGrid-toolbarContainer" : {
            backgroundColor : colors.yellowAccent[500]
          },
        }}
        disableRowSelectionOnClick
        onCellEditStop={(params) => setRowId(params.id)}
        slots={{
            toolbar : GridToolbar,
            noRowsOverlay : GridNoRowsOverlay
        }}
      />
    </Box>
        </Box>
        <Dialog
            maxWidth={'xs'}
            open={deleteRowDialogOpen}
        >
            <DialogTitle
                sx={{
                    color : colors.yellowAccent[500],
                    textTransform : 'capitalize'
                }}
            >Confirm Delete {name} Information</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
                textTransform : 'capitalize'
            }}
          >
            Are you sure you want to Delete the {name}? this action
            can't be undone and all data realted with this {name} will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteRowDialogClose} color="error">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onDeleteRowDialogConfirm}
            color='success'
          >
            Confirm
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

export default Page
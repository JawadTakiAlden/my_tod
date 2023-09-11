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
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        style={{ flexShrink: 0 }}
        width="240"
        height="200"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}

const Page = ({columns , data , name , link , formInputs , validationSchema , valuesShouldUpdate , initialValues  , updateAPI , withNavigate = true}) => {
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
                        {
                            withNavigate && (
                                <IconButton
                                    component={Link}
                                    to={`${location.pathname}/${params.row.id}`}
                                    state={{
                                        data : params.row
                                    }}
                                >
                                    <NavigateNextOutlined />
                                </IconButton>
                            )
                        }
                        <SaveAction {...{params , rowId , setRowId , name , valuesShouldUpdate , updateAPI}} />
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
            noRowsOverlay : CustomNoRowsOverlay
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
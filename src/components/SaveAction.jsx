import { Check, Save } from '@mui/icons-material'
import { Box, CircularProgress, Fab, useTheme } from '@mui/material'
import React from 'react'
import { tokens } from '../assets/theme'
import { useState } from 'react'
import { useEffect } from 'react'
import { request } from '../api/request'
import { useMutation } from '@tanstack/react-query'


const SaveAction = ({ params , rowId , setRowId , name , valuesShouldUpdate , updateAPI}) => {
    const [loading , setLoading] = useState(false)
    const [success , setSuccess] = useState(false)
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const updateInformationInServer = (values) => {
        return request({
            url : `${updateAPI}/${params.id}`,
            method : 'PATCH',
            data : values
        })
    }

    const updateInformationMutation = useMutation({
        mutationKey : [`update-${name.slice(-1,1)}-in-server`],
        mutationFn : updateInformationInServer,
        onSuccess : (data) => {
            console.log(data)
            setSuccess(true)
            setRowId(null)
            setLoading(false)
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
                    setLoading(false)
                    break ;
                }
                case 401 : {
                    setError(`you're not authorize to create new ${name} in our system`)
                    setOpen(true)
                    setLoading(false)
                    break ;
                }

                case 500 : {
                    setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                    setOpen(true)
                    setLoading(false)
                    break
                }
                case 422 : {
                    setError("obbs , may you are making some mistake in your entered data")
                    setOpen(true)
                    setLoading(false)
                    break
                }
                default : {
                    setError(`obbs ,unknown error happend with status code ${error.status}`)
                    setOpen(true)
                    setLoading(false)
                    break
                }
            }  
        }
    })

    const saveUpdateHandler = () => {
        setLoading(true)
        // // update old row in database with new rowdata
        let dataForUpdate = {} ;
        valuesShouldUpdate.map(attribute => {
            dataForUpdate[attribute] = params.row[attribute]
        })
        console.log(dataForUpdate)
        updateInformationMutation.mutate(dataForUpdate)
    }
    useEffect(() => {
        if(rowId === params.id && success) setSuccess(false)
    } , [rowId])
  return (
    <Box
                        sx={{
                            position : 'relative',
                            m : 1
                        }}
                    >
                        {
                            success ? (
                                <Fab
                                    color='primary'
                                    sx={{
                                        width : '40px',
                                        height : '40px',
                                        backgroundColor : colors.greenBlueAccent[500],
                                        transition : '0.3s',
                                        "&:hover" : {
                                            backgroundColor : colors.greenBlueAccent[600],
                                        }
                                    }}
                                >
                                    <Check />
                                </Fab>
                            )
                            : (
                                <Fab
                                    color='primary'
                                    sx={{
                                        width : '40px',
                                        height : '40px',
                                    }}
                                    disabled={params.id !== rowId || loading}
                                    onClick={saveUpdateHandler}
                                >
                                    <Save />
                                </Fab>
                            )
                        }
                        {
                            loading && (
                                <CircularProgress 
                                    size={52}
                                    sx={{
                                        color : colors.greenBlueAccent[500],
                                        position : 'absolute',
                                        top : '-6px',
                                        left : '-6px',
                                        zIndex : '1'
                                    }}
                                />
                            )
                        }
                    </Box>
  )
}

export default SaveAction
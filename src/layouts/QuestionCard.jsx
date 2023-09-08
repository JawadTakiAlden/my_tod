import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Typography, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { tokens } from '../assets/theme'
import { DeleteOutlined, QuestionAnswer, QuestionMarkOutlined } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { request } from '../api/request'
import CubeLoader from '../components/CubeLoader/CubeLoader'

const deleteFaqFromServer = (id) => {
    return request({
        url : `/question-answer/${id}`,
        method : 'delete'
    })
}

const QuestionCard = ({faqData , refetch}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [answerOpen , setAnswerOpen] = useState(false)
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const randomColor = useMemo(() => colors.mix[Math.floor(Math.random() * 6) * 100] ,[])
    const [deleteFAQDialogOpen , setDeleteFAQDialogOpen] = useState(false)
    const onDeleteFAQDialogOpen = () => {
        setDeleteFAQDialogOpen(true)
      }
      const onDeleteFAQDialogClose = () => {
        setDeleteFAQDialogOpen(false)
      }

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      const deleteDialogMuation = useMutation({
        mutationKey : ['delete-faq-from-server'],
        mutationFn : deleteFaqFromServer,
        onSuccess : (data) => {
            refetch()
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
                default : {
                    setError(`obbs ,unknown error happend with status code ${error.status}`)
                    setOpen(true)
                    break
                }
            }  
        }
      })

      const onDeleteFAQDialogConfirm = () => {
        deleteDialogMuation.mutate(faqData?.id)
        onDeleteFAQDialogClose()
      }

    if(deleteDialogMuation.isLoading){
      return <CubeLoader />
    }
  return (
    <>
    <Box
        sx={{
            
            padding : '10px',
            borderRadius : '8px',
            // boxShadow : `2px 2px 10px -6px ${colors.primary[400]}`
            boxShadow : `1px 1px 8px -6px ${randomColor}`,
            // boxShadow : `2px 2px 10px -6px ${colors.mix[Math.floor(Math.random() * 7) * 100]}`,
            marginBottom : '10px',
            
        }}
        
    >
        <Box
            sx={{
                display : 'flex',
                justifyContent : 'space-between',
                alignItems : 'center',
            }}
            
        >

            <Box
                sx={{
                    display : 'flex',
                    alignItems : 'center',
                    gap : '5px',
                    padding : '6px',
                    cursor : 'pointer',
                }}
                onClick={() => setAnswerOpen(!answerOpen)}
            >
                <QuestionMarkOutlined 
                    sx={{
                        color : randomColor,
                    }}
                />
                <Typography
                    sx={{
                        textTransform : 'capitalize',
                        color : colors.grey[100]
                    }}
                    variant='h4'
                >
                    {faqData?.question}
                </Typography>
                
            </Box>
            <IconButton
                color='warning'
                onClick={onDeleteFAQDialogOpen}
            >
                <DeleteOutlined />
            </IconButton>
        </Box>
        {
            answerOpen && (
                <Box
                    sx={{
                        display : 'flex',
                        alignItems : 'center',
                        gap : '8px',
                        padding : '10px',
                        borderRadius : '2px',
                        marginTop : '10px',
                        cursor : 'pointer',
                    }}
                    onClick={() => setAnswerOpen(!answerOpen)}
                >
                    <QuestionAnswer 
                        color='success'
                    />
                    <Typography
                        variant='h5'
                    >
                        {faqData?.answer}
                    </Typography>
                </Box>
            )
        }
    </Box>
    <Dialog
        open={deleteFAQDialogOpen}
        maxWidth={'xs'}
    >
        <DialogTitle
                sx={{
                    color : colors.yellowAccent[500] 
                }}
            >Confirm Delete FAQ's Card</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete the FAQ? this action
            can't be undone .
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteFAQDialogClose} color="error">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onDeleteFAQDialogConfirm}
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

export default QuestionCard
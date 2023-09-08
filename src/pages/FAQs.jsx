import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import QuestionCard from '../layouts/QuestionCard'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import * as Yup from 'yup'
import AddButton from '../components/AddButton'
import { request } from '../api/request'
import { useMutation, useQuery } from '@tanstack/react-query'
import CubeLoader from '../components/CubeLoader/CubeLoader'

const getFAQsFromServer = () => {
  return request({
    url : '/question-answer',
    method : 'get'
  })
}

const addFaqToServer = (values) => {
  return request({
    url : '/question-answer',
    method : 'post',
    data : values
  })
}

const FAQs = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [addFAQDialogOpen , setAddFAQDialogOpen] = useState(false)
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const randomNumberBetween0Adn7 = Math.floor(Math.random() * 7)
    const randomNumberBetween100And700 = (randomNumberBetween0Adn7 !== 0 ? randomNumberBetween0Adn7 : 1) * 100
    const randomColor = colors.mix[randomNumberBetween100And700]
    const addToServerMutation = useMutation({
      mutationKey : ['add-faq-to-server'],
      mutationFn: addFaqToServer,
      onSuccess : (data) => {
        getFaqsQuery.refetch()
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
                setError(`you're not authorize to create new question and answer in our system`)
                setOpen(true)
                break ;
            }

            case 401 : {
              setError(`check your entered data , there some mistake with it`)
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
    const handleFormSubmit = (values) => {
      addToServerMutation.mutate(values)
      setAddFAQDialogOpen(false)
    }
    const onAddFAQDialogOpen = () => {
      setAddFAQDialogOpen(true)
    }
    const onAddFAQDialogClose = () => {
      setAddFAQDialogOpen(false)
    }
    const onAddFAQDialogConfirm = () => {
      onAddFAQDialogClose()
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const getFaqsQuery = useQuery({
      queryKey : ['get-faqs-from-server'],
      queryFn : getFAQsFromServer,
      refetchIntervalInBackground : true
    })

    if(getFaqsQuery.isLoading || addToServerMutation.isLoading){
      return <CubeLoader />
    }

    if(getFaqsQuery.isError){
      if(getFaqsQuery.error.response.status !== 401){
          getFaqsQuery.refetch()
          return
      }else{
          return <Typography color={'seashell'} variant='h1'>error</Typography>
      }
    }

  return (
    <>
        <Box>
            <AddButton color={randomColor} reactionFunction={onAddFAQDialogOpen} refetch={getFaqsQuery.refetch} />
            <Box>
              {
                getFaqsQuery?.data?.data?.qa.length === 0 && (
                  <Typography
                    sx={{
                      color : colors.pinkAccent[500],
                      textAlign : 'center'
                    }}
                    variant='h2'
                  >
                    No FAQs until now
                  </Typography>
                )
              }
              {
                getFaqsQuery?.data?.data?.qa?.map(faq => (
                  <QuestionCard faqData={faq} refetch={getFaqsQuery.refetch} />
                ))
              }
            </Box>
        </Box>
        <Dialog
          open={addFAQDialogOpen}
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
                    label="Question"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.question}
                    name="question"
                    error={!!touched.question && !!errors.question}
                    helperText={touched.question && errors.question}
                    sx={{ gridColumn: "span 4" }}
                />
                <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Answer"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.answer}
                    name="answer"
                    error={!!touched.answer && !!errors.answer}
                    helperText={touched.answer && errors.answer}
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
          <Button onClick={onAddFAQDialogClose} color="error">
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
    question :  Yup.string().required('question field is required'),
    answer :  Yup.string().required('answer field is required'),
  })
  
  const initialValues = {
    question : '',
    answer : '',
  }
  

export default FAQs
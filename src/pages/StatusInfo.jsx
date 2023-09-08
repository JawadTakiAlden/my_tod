import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router'
import AddButton from '../components/AddButton'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import StatusCard from '../components/StatusCard'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import * as Yup from 'yup'

const StatusInfo = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [deleteFAQDialogOpen , setDeleteFAQDialogOpen] = useState(false)
    const handleFormSubmit = (values) => {
        console.log(values)
    }
    const onDeleteFAQDialogOpen = () => {
        setDeleteFAQDialogOpen(true)
      }
      const onDeleteFAQDialogClose = () => {
        setDeleteFAQDialogOpen(false)
      }
      const onDeleteFAQDialogConfirm = () => {
        onDeleteFAQDialogClose()
      }
  return (
    <>
    <Box>
        <AddButton color={colors.indigoAccent[500]} reactionFunction={onDeleteFAQDialogOpen} />
        <GridBox
            spacing={1}
        >
            <GridItem xs={12} sm={6} md={4} lg={3}>
                <StatusCard />
            </GridItem>
            <GridItem xs={12} sm={6} md={4} lg={3}>
                <StatusCard />
            </GridItem>
            <GridItem xs={12} sm={6} md={4} lg={3}>
                <StatusCard />
            </GridItem>
            <GridItem xs={12} sm={6} md={4} lg={3}>
                <StatusCard />
            </GridItem>
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
            <Button onClick={onDeleteFAQDialogClose} color="error">
                Cancel
            </Button>
        </DialogActions>
        </Dialog>
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

export default StatusInfo
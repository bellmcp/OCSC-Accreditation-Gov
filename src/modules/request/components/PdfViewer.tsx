//@ts-nocheck
import React, { useState } from 'react'
import styled from 'styled-components'
import { Document, Page, pdfjs } from 'react-pdf'
import { Grid, Box, Typography, Button, ButtonGroup } from '@material-ui/core'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PDFDocumentWrapper = styled.div`
  canvas {
    width: 100% !important;
    height: auto !important;
  }
`

export default function PdfViewer({ url, setIsError }: any) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  return (
    <>
      <Grid
        container
        spacing={1}
        direction='column'
        justify='center'
        alignItems='center'
        alignContent='center'
        wrap='nowrap'
      >
        <Grid item>
          <PDFDocumentWrapper>
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={() => setIsError(true)}
            >
              <Page pageNumber={pageNumber} />
            </Document>
          </PDFDocumentWrapper>
        </Grid>
        <Grid item>
          <Box mt={2} mb={1}>
            <Typography variant='body2' color='textSecondary'>
              หน้า {pageNumber || (numPages ? 1 : '')} จาก {numPages || 1}
            </Typography>
          </Box>
        </Grid>
        <Grid container item direction='row' spacing={2} justify='center'>
          <Grid item>
            <ButtonGroup variant='outlined' color='default'>
              <Button disabled={pageNumber <= 1} onClick={previousPage}>
                {'<'}
              </Button>
              <Button disabled={pageNumber >= numPages} onClick={nextPage}>
                {'>'}
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

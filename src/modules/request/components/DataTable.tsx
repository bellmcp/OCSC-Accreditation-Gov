import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { get } from 'lodash'

import {
  DataGrid,
  GridColDef,
  bgBG,
  GridRenderCellParams,
  gridClasses,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid'
import {
  Box,
  Typography,
  Paper,
  Popper,
  Stack,
  Divider,
  Link,
  Button,
} from '@mui/material'

import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  WatchLater as PendingIcon,
  PlayCircleFilled as InProgressIcon,
  Description as XLSXIcon,
  InsertDriveFile as PDFIcon,
  Archive as ZipIcon,
} from '@material-ui/icons'
import { green, red, amber, lightBlue, purple } from '@material-ui/core/colors'
import { createTheme, ThemeProvider, alpha, styled } from '@mui/material/styles'
import ApproModal from './ApproModal'
import PreviewModal from './PreviewModal'
import PdfPreviewModal from './PdfPreviewModal'

import * as requestActions from 'modules/request/actions'

const ODD_OPACITY = 0.07

interface DataTableProps {
  data: any
  loading: boolean
}

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: 'transparent',
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.secondary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.secondary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
}))

const theme = createTheme(
  {
    typography: {
      fontFamily: ['Prompt', 'sans-serif'].join(','),
    },
    palette: {
      primary: { main: '#00695c' },
      secondary: { main: '#00bfa5' },
    },
  },
  bgBG
)

interface GridCellExpandProps {
  value: string
  width: number
}

function isOverflown(element: Element): boolean {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  )
}

const GridCellExpand = React.memo(function GridCellExpand(
  props: GridCellExpandProps
) {
  const { width, value } = props
  const wrapper = React.useRef<HTMLDivElement | null>(null)
  const cellDiv = React.useRef(null)
  const cellValue = React.useRef(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [showFullCell, setShowFullCell] = React.useState(false)
  const [showPopper, setShowPopper] = React.useState(false)

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current!)
    setShowPopper(isCurrentlyOverflown)
    setAnchorEl(cellDiv.current)
    setShowFullCell(true)
  }

  const handleMouseLeave = () => {
    setShowFullCell(false)
  }

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setShowFullCell, showFullCell])

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
          >
            <Typography variant='body2' style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  )
})

function renderCellExpand(params: GridRenderCellParams<string>) {
  return (
    <GridCellExpand
      value={params.value || ''}
      width={params.colDef.computedWidth}
    />
  )
}

export default function DataTable({ data, loading }: DataTableProps) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }
  const onCancel = () => {
    setIsOpen(false)
  }

  const handleClickViewAppro = (id: number) => {
    dispatch(requestActions.loadPersonLetter(id))
    openModal()
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          paddingLeft: '6px',
        }}
      >
        <Stack direction='row' spacing={2} alignItems='center'>
          <GridToolbarColumnsButton sx={{ lineHeight: '1.2' }} />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarFilterButton sx={{ lineHeight: '1.2' }} />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarDensitySelector sx={{ lineHeight: '1.2' }} />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarExport
            printOptions={{ disableToolbarButton: true }}
            csvOptions={{
              delimiter: ',',
              utf8WithBom: true,
              fileName: `การรับรองคุณวุฒิหลักสูตร_${format(
                new Date(),
                'yyyy-MM-dd-HH:mm:ss'
              ).toString()}`,
            }}
            sx={{ lineHeight: '1.2' }}
          />
        </Stack>
      </GridToolbarContainer>
    )
  }

  const [isOpenPreviewModal, setIsOpenPreviewModal] = useState(false)
  const [currentFilePath, setCurrentFilePath] = useState('')
  const handleOpenPreviewModal = (filePath: string) => {
    setIsOpenPreviewModal(true)
    setCurrentFilePath(filePath)
  }
  const handleClosePreviewModal = () => {
    setIsOpenPreviewModal(false)
  }

  const [isOpenPdfPreviewModal, setIsOpenPdfPreviewModal] = useState(false)
  const handleOpenPdfPreviewModal = (filePath: string) => {
    setIsOpenPdfPreviewModal(true)
    setCurrentFilePath(filePath)
  }
  const handleClosePdfPreviewModal = () => {
    setIsOpenPdfPreviewModal(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'order',
      headerName: 'ลำดับ',
      width: 80,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'letterNo',
      headerName: 'เลขที่',
      minWidth: 250,
      headerAlign: 'center',
      renderCell: renderCellExpand,
    },
    {
      field: 'letterDatePrint',
      headerName: 'วันที่',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'submitDate',
      headerName: 'วันที่ยื่นคำร้อง',
      width: 220,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'note',
      headerName:
        'ชื่อ-นามสกุล หมายเลขโทรศัพท์ หรือ อีเมล เจ้าหน้าที่ผู้รับผิดชอบ',
      width: 450,
      headerAlign: 'center',
      renderCell: renderCellExpand,
    },
    {
      field: 'xlsxFile',
      headerName: 'ไฟล์แนบสเปรดชีต XLSX',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      disableReorder: true,
      disableExport: true,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        const filePath = get(params, 'value', null)

        if (filePath === null || filePath === undefined) {
          return <></>
        } else {
          return (
            <Stack direction='row' alignItems='center' spacing={1}>
              <Link
                // href={filePath}
                // target='_blank'
                color='primary'
                underline='hover'
                onClick={() => handleOpenPreviewModal(filePath)}
                style={{ cursor: 'pointer' }}
              >
                <Stack direction='row' alignItems='center' spacing={1}>
                  <XLSXIcon fontSize='small' />
                  <div>XLSX</div>
                </Stack>
              </Link>
            </Stack>
          )
        }
      },
    },
    {
      field: 'pdfFile',
      headerName: 'ไฟล์แนบ PDF หรือ ZIP',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      disableReorder: true,
      disableExport: true,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        const filePath = get(params, 'value', null)
        const last3StrFilePath = filePath.slice(-3, filePath.length)
        const isPDF = last3StrFilePath === 'pdf' || last3StrFilePath === 'PDF'

        if (filePath === null || filePath === undefined) {
          return <></>
        } else {
          return (
            <Stack direction='row' alignItems='center' spacing={1}>
              <Link
                color='primary'
                underline='hover'
                onClick={() => {
                  isPDF
                    ? handleOpenPdfPreviewModal(filePath)
                    : window.open(filePath, '_blank')
                }}
                style={{ cursor: 'pointer' }}
              >
                <Stack direction='row' alignItems='center' spacing={1}>
                  {isPDF ? (
                    <PDFIcon fontSize='small' />
                  ) : (
                    <ZipIcon fontSize='small' />
                  )}
                  <div>{isPDF ? 'PDF' : 'ZIP'}</div>
                </Stack>
              </Link>
            </Stack>
          )
        }
      },
    },
    {
      field: 'status',
      headerName: 'สถานะ',
      headerAlign: 'center',
      width: 180,
      renderCell: (params) => {
        const value = get(params, 'value', '')

        switch (value) {
          case 'อยู่ระหว่างดำเนินการ':
            return (
              <Stack direction='row' alignItems='center' spacing={1}>
                <InProgressIcon
                  style={{
                    color: lightBlue[800],
                  }}
                />
                <Typography
                  variant='body2'
                  style={{ color: lightBlue[800], fontWeight: 600 }}
                >
                  อยู่ระหว่างดำเนินการ
                </Typography>
              </Stack>
            )
          case 'รออนุมัติ':
            return (
              <Stack direction='row' alignItems='center' spacing={1}>
                <PendingIcon
                  style={{
                    color: amber[800],
                  }}
                />
                <Typography
                  variant='body2'
                  style={{ color: amber[800], fontWeight: 600 }}
                >
                  รออนุมัติ
                </Typography>
              </Stack>
            )
          case 'เสร็จสิ้น':
            return (
              <Stack direction='row' alignItems='center' spacing={1}>
                <CheckIcon
                  style={{
                    color: green[800],
                  }}
                />
                <Typography
                  variant='body2'
                  style={{ color: green[800], fontWeight: 600 }}
                >
                  เสร็จสิ้น
                </Typography>
              </Stack>
            )
          case 'ยกเลิก':
            return (
              <Stack direction='row' alignItems='center' spacing={1}>
                <CancelIcon
                  style={{
                    color: red[800],
                  }}
                />
                <Typography
                  variant='body2'
                  style={{ color: red[800], fontWeight: 600 }}
                >
                  ยกเลิก
                </Typography>
              </Stack>
            )
          case 'ให้ยื่นคำร้องใหม่':
            return (
              <Stack direction='row' alignItems='center' spacing={1}>
                <CancelIcon
                  style={{
                    color: purple[800],
                  }}
                />
                <Typography
                  variant='body2'
                  style={{ color: purple[800], fontWeight: 600 }}
                >
                  ให้ยื่นคำร้องใหม่
                </Typography>
              </Stack>
            )
          default:
            return <></>
        }
      },
    },
    {
      field: 'appro',
      headerName: 'ผลการรับรอง',
      align: 'center',
      headerAlign: 'center',
      width: 200,
      renderCell: (params) => {
        const status = get(params, 'row.status', '')
        const id = get(params, 'row.id', null)

        if (status === 'เสร็จสิ้น') {
          return (
            <Button
              variant='contained'
              color='primary'
              size='small'
              sx={{ borderRadius: 24, padding: '4px 16px' }}
              onClick={() => handleClickViewAppro(id)}
            >
              ดูผลการรับรอง
            </Button>
          )
        } else {
          return <></>
        }
      },
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <div style={{ minHeight: 500 }}>
        <StripedDataGrid
          autoHeight
          initialState={{
            pagination: {
              pageSize: 50,
            },
          }}
          rowsPerPageOptions={[25, 50, 100, 250, 500, 1000]}
          loading={loading}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          rows={data}
          columns={columns}
          disableSelectionOnClick
          components={{ Toolbar: CustomToolbar }}
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={[
            {
              groupId: 'letter',
              headerName: 'หนังสือเข้า',
              headerAlign: 'center',
              children: [
                { field: 'id' },
                { field: 'letterDatePrint' },
                { field: 'submitDate' },
              ],
            },
          ]}
          localeText={{
            // Root
            noRowsLabel: 'ไม่มีข้อมูล',
            noResultsOverlayLabel: 'ไม่พบผลลัพธ์',
            errorOverlayDefaultLabel: 'เกิดข้อผิดพลาดบางอย่าง',

            // Density selector toolbar button text
            toolbarDensity: 'ขนาดของแถว',
            toolbarDensityLabel: 'ขนาดของแถว',
            toolbarDensityCompact: 'กะทัดรัด',
            toolbarDensityStandard: 'มาตรฐาน',
            toolbarDensityComfortable: 'สบายตา',

            // Columns selector toolbar button text
            toolbarColumns: 'จัดการคอลัมน์',
            toolbarColumnsLabel: 'เลือกคอลัมน์',

            // Filters toolbar button text
            toolbarFilters: 'ตัวกรอง',
            toolbarFiltersLabel: 'แสดงตัวกรอง',
            toolbarFiltersTooltipHide: 'ซ่อนตัวกรอง',
            toolbarFiltersTooltipShow: 'แสดงตัวกรอง',
            toolbarFiltersTooltipActive: (count) =>
              count !== 1
                ? `${count} ตัวกรองที่ใช้อยู่`
                : `${count} ตัวกรองที่ใช้อยู่`,

            // Quick filter toolbar field
            toolbarQuickFilterPlaceholder: 'ค้นหา...',
            toolbarQuickFilterLabel: 'ค้นหา',
            toolbarQuickFilterDeleteIconLabel: 'ล้าง',

            // Export selector toolbar button text
            toolbarExport: 'ส่งออก',
            toolbarExportLabel: 'ส่งออก',
            toolbarExportCSV: 'ส่งออกเป็นไฟล์ CSV',
            toolbarExportPrint: 'สั่งพิมพ์',
            toolbarExportExcel: 'ส่งออกเป็นไฟล์ Excel',

            // Columns panel text
            columnsPanelTextFieldLabel: 'ค้นหาคอลัมน์',
            columnsPanelTextFieldPlaceholder: 'ชื่อคอลัมน์',
            columnsPanelDragIconLabel: 'Reorder column',
            columnsPanelShowAllButton: 'แสดงทั้งหมด',
            columnsPanelHideAllButton: 'ซ่อนทั้งหมด',

            // Filter panel text
            filterPanelAddFilter: 'เพิ่มตัวกรอง',
            filterPanelDeleteIconLabel: 'ลบ',
            filterPanelLinkOperator: 'เงื่อนไข',
            filterPanelOperators: 'เงื่อนไข', // TODO v6: rename to filterPanelOperator
            filterPanelOperatorAnd: 'และ',
            filterPanelOperatorOr: 'หรือ',
            filterPanelColumns: 'คอลัมน์',
            filterPanelInputLabel: 'คำค้นหา',
            filterPanelInputPlaceholder: 'คำค้นหา',

            // Filter operators text
            filterOperatorContains: 'ประกอบด้วย',
            filterOperatorEquals: 'เท่ากับ',
            filterOperatorStartsWith: 'เริ่มต้นด้วย',
            filterOperatorEndsWith: 'ลงท้ายด้วย',
            filterOperatorIs: 'มีค่าเป็น',
            filterOperatorNot: 'ไม่ได้มีค่าเป็น',
            filterOperatorAfter: 'อยู่ถัดจาก',
            filterOperatorOnOrAfter: 'อยู่เท่ากับ หรือ ถัดจาก',
            filterOperatorBefore: 'อยู่ก่อนหน้า',
            filterOperatorOnOrBefore: 'อยู่เท่ากับ หรือ ก่อนหน้า',
            filterOperatorIsEmpty: 'ไม่มีค่า',
            filterOperatorIsNotEmpty: 'มีค่า',
            filterOperatorIsAnyOf: 'เป็นหนึ่งใน',

            // Filter values text
            filterValueAny: 'ใดๆ',
            filterValueTrue: 'ถูก',
            filterValueFalse: 'ผิด',

            // Column menu text
            columnMenuLabel: 'เมนู',
            columnMenuShowColumns: 'จัดการคอลัมน์',
            columnMenuFilter: 'ตัวกรอง',
            columnMenuHideColumn: 'ซ่อน',
            columnMenuUnsort: 'เลิกเรียงลำดับ',
            columnMenuSortAsc: 'เรียงน้อยไปมาก',
            columnMenuSortDesc: 'เรียงมากไปน้อย',

            // Column header text
            columnHeaderFiltersTooltipActive: (count) =>
              count !== 1
                ? `${count} ตัวกรองที่ใช้อยู่`
                : `${count} ตัวกรองที่ใช้อยู่`,
            columnHeaderFiltersLabel: 'แสดงตัวกรอง',
            columnHeaderSortIconLabel: 'เรียงลำดับ',

            // Rows selected footer text
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} แถวถูกเลือก`
                : `${count.toLocaleString()} แถวถูกเลือก`,

            // Total row amount footer text
            footerTotalRows: 'จำนวนแถวทั้งหมด',

            // Total visible row amount footer text
            footerTotalVisibleRows: (visibleCount, totalCount) =>
              `${visibleCount.toLocaleString()} จาก ${totalCount.toLocaleString()}`,

            // Checkbox selection text
            checkboxSelectionHeaderName: 'Checkbox selection',
            checkboxSelectionSelectAllRows: 'Select all rows',
            checkboxSelectionUnselectAllRows: 'Unselect all rows',
            checkboxSelectionSelectRow: 'Select row',
            checkboxSelectionUnselectRow: 'Unselect row',

            // Boolean cell text
            booleanCellTrueLabel: 'yes',
            booleanCellFalseLabel: 'no',

            // Actions cell more text
            actionsCellMore: 'more',

            // Column pinning text
            pinToLeft: 'Pin to left',
            pinToRight: 'Pin to right',
            unpin: 'Unpin',

            // Tree Data
            treeDataGroupingHeaderName: 'Group',
            treeDataExpand: 'see children',
            treeDataCollapse: 'hide children',

            // Grouping columns
            groupingColumnHeaderName: 'Group',
            groupColumn: (name) => `Group by ${name}`,
            unGroupColumn: (name) => `Stop grouping by ${name}`,

            // Master/detail
            expandDetailPanel: 'Expand',
            collapseDetailPanel: 'Collapse',

            // Used core components translation keys
            MuiTablePagination: {
              labelRowsPerPage: 'จำนวนแถวต่อหน้า',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} จาก ${count}`,
            },

            // Row reordering text
            rowReorderingHeaderName: 'Row reordering',
          }}
        />
      </div>
      <ApproModal isOpen={isOpen} onCancel={onCancel} />
      <PreviewModal
        open={isOpenPreviewModal}
        handleClose={handleClosePreviewModal}
        filePath={currentFilePath}
      />
      <PdfPreviewModal
        open={isOpenPdfPreviewModal}
        handleClose={handleClosePdfPreviewModal}
        filePath={currentFilePath}
      />
    </ThemeProvider>
  )
}

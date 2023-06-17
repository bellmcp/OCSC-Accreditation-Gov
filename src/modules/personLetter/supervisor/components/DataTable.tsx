import React, { useState } from 'react'
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
  // GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid'

import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { Link, Button, Typography, Paper, Divider } from '@material-ui/core'

import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  WatchLater as PendingIcon,
  PlayCircleFilled as InProgressIcon,
  Launch as LaunchIcon,
} from '@material-ui/icons'
import { createTheme, ThemeProvider, alpha, styled } from '@mui/material/styles'
import { green, red, amber, indigo } from '@material-ui/core/colors'

import PreviewModal from 'modules/preview/components/PreviewModal'

const ODD_OPACITY = 0.07
// const PATH = process.env.REACT_APP_BASE_PATH

interface DataTableProps {
  data: any
  loading: boolean
  handleOpenEditModal: () => void
  setCurrentEditData: any
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
      primary: { main: '#09348b' },
      secondary: { main: '#17aacf' },
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

export default function DataTable({
  data,
  loading,
  handleOpenEditModal,
  setCurrentEditData,
}: DataTableProps) {
  const [open, setOpen] = useState(false)
  const [currentFilePath, setCurrentFilePath] = useState('')

  const handleClickOpen = (filePath: string) => {
    setOpen(true)
    setCurrentFilePath(filePath)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleClickEdit = (row: any) => {
    setCurrentEditData(row)
    handleOpenEditModal()
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
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: renderCellExpand,
    },
    {
      field: 'letterDatePrint',
      headerName: 'วันที่',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'letterAgency',
      headerName: 'หน่วยงาน',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      renderCell: renderCellExpand,
    },
    {
      field: 'worker',
      headerName: 'ผู้ปฏิบัติงาน',
      headerAlign: 'center',
      width: 250,
      renderCell: renderCellExpand,
    },
    {
      field: 'numThDegs',
      headerName: 'ไทย',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => {
        const value = get(params, 'value', null)
        if (value === null || value === undefined) {
          return '-'
        } else {
          return value
        }
      },
    },
    {
      field: 'numNonThDegs',
      headerName: 'เทศ',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => {
        const value = get(params, 'value', null)
        if (value === null || value === undefined) {
          return '-'
        } else {
          return value
        }
      },
    },
    {
      field: 'status',
      headerName: 'สถานะ',
      width: 180,
      headerAlign: 'center',
      renderCell: (params) => {
        const value = get(params, 'value', '')

        switch (value) {
          case 'อยู่ระหว่างดำเนินการ':
            return (
              <Stack direction='row' alignItems='center' spacing={1}>
                <InProgressIcon
                  style={{
                    color: indigo[800],
                  }}
                />
                <Typography
                  variant='body2'
                  style={{ color: indigo[800], fontWeight: 600 }}
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
          default:
            return <></>
        }
      },
    },
    {
      field: 'replyNo',
      headerName: 'เลขที่',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: renderCellExpand,
    },
    {
      field: 'replyDatePrint',
      headerName: 'วันที่',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'note',
      headerName: 'หมายเหตุ',
      width: 250,
      headerAlign: 'center',
      renderCell: renderCellExpand,
    },
    {
      field: 'uploadFile',
      headerName: 'ลิงก์',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      disableReorder: true,
      disableExport: true,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        const filePath = get(params, 'value', '')

        if (filePath === null || filePath === undefined) {
          return <></>
        } else {
          return (
            <Stack direction='row' alignItems='center' spacing={1}>
              <Link
                // href={`${PATH}/preview?file=${filePath}`}
                // target='_blank'
                color='primary'
                underline='hover'
                onClick={() => handleClickOpen(filePath)}
                style={{ cursor: 'pointer' }}
              >
                <Stack direction='row' alignItems='center' spacing={1}>
                  <LaunchIcon fontSize='small' />
                  <div>เปิดไฟล์</div>
                </Stack>
              </Link>
            </Stack>
          )
        }
      },
    },
    {
      field: 'uploadDate',
      headerName: 'วันที่อัพโหลด',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'edit',
      headerName: '',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      disableReorder: true,
      disableExport: true,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        const row = get(params, 'row', {})
        return (
          <Button
            variant='contained'
            color='secondary'
            size='small'
            style={{ padding: '4px 16px' }}
            onClick={() => handleClickEdit(row)}
          >
            แก้ไข
          </Button>
        )
      },
    },
    // {
    //   field: 'id',
    //   headerName: 'เลขที่อ้างอิง',
    //   width: 120,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
  ]

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          paddingLeft: '6px',
          // paddingBottom: '4px',
          // borderBottom: '1px solid rgba(224, 224, 224, 1)',
        }}
      >
        <Stack direction='row' spacing={2} alignItems='center'>
          <GridToolbarColumnsButton sx={{ lineHeight: '1.2' }} />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarFilterButton sx={{ lineHeight: '1.2' }} />
          <Divider orientation='vertical' light flexItem />
          <GridToolbarDensitySelector sx={{ lineHeight: '1.2' }} />
          {/* <Divider orientation='vertical' light flexItem />
          <GridToolbarExport
            printOptions={{ disableToolbarButton: true }}
            csvOptions={{
              delimiter: ',',
              utf8WithBom: true,
              fileName: 'test',
            }}
            sx={{ lineHeight: '1.2' }}
          /> */}
        </Stack>
      </GridToolbarContainer>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ minHeight: 500 }}>
        <StripedDataGrid
          autoHeight
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={[
            {
              groupId: 'letter',
              headerName: 'หนังสือเข้า',
              headerAlign: 'center',
              children: [
                { field: 'letterNo' },
                { field: 'letterDatePrint' },
                { field: 'letterAgency' },
              ],
              renderHeaderGroup: () => (
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  หนังสือเข้า
                </Typography>
              ),
            },
            {
              groupId: 'numDegs',
              headerName: 'จำนวนคุณวุฒิ',
              headerAlign: 'center',
              children: [{ field: 'numThDegs' }, { field: 'numNonThDegs' }],
              renderHeaderGroup: () => (
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  จำนวนคุณวุฒิ
                </Typography>
              ),
            },
            {
              groupId: 'reply',
              headerName: 'หนังสือออก',
              headerAlign: 'center',
              children: [{ field: 'replyNo' }, { field: 'replyDatePrint' }],
              renderHeaderGroup: () => (
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  หนังสือออก
                </Typography>
              ),
            },
            {
              groupId: 'upload',
              headerName: 'ไฟล์งาน',
              headerAlign: 'center',
              children: [{ field: 'uploadFile' }, { field: 'uploadDate' }],
              renderHeaderGroup: () => (
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  ไฟล์งาน
                </Typography>
              ),
            },
          ]}
          initialState={{
            pagination: {
              pageSize: 100,
            },
          }}
          loading={loading}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          rows={data}
          columns={columns}
          disableSelectionOnClick
          rowsPerPageOptions={[25, 50, 100, 250, 500, 1000]}
          components={{ Toolbar: CustomToolbar }}
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
      <PreviewModal
        open={open}
        handleClose={handleClose}
        filePath={currentFilePath}
      />
    </ThemeProvider>
  )
}

import * as React from 'react'
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
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  WatchLater as PendingIcon,
  PlayCircleFilled as InProgressIcon,
  Launch as LaunchIcon,
  Visibility as ViewIcon,
  GridOn as XLSXIcon,
  InsertDriveFile as PDFIcon,
  Archive as ZipIcon,
} from '@material-ui/icons'
import { green, red, amber, indigo } from '@material-ui/core/colors'
import { createTheme, ThemeProvider, alpha, styled } from '@mui/material/styles'
import { Button } from '@mui/material'

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
      primary: { main: '#09348b' },
      secondary: { main: '#17aacf' },
    },
  },
  bgBG
)

const columns: GridColDef[] = [
  {
    field: 'order',
    headerName: 'ลำดับ',
    width: 80,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'id',
    headerName: 'เลขที่',
    width: 100,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'submitDate',
    headerName: 'วันที่ยื่นคำร้อง',
    width: 220,
    renderCell: renderCellExpand,
  },
  {
    field: 'note',
    headerName:
      'ชื่อ-นามสกุล หมายเลขโทรศัพท์ หรือ อีเมล เจ้าหน้าที่ผู้รับผิดชอบ',
    width: 450,
    renderCell: renderCellExpand,
  },
  {
    field: 'xlsxFile',
    headerName: 'ไฟล์แนบสเปรตชีต XLSX',
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
              href={filePath}
              target='_blank'
              color='primary'
              underline='hover'
              // onClick={() => handleClickOpen(filePath)}
              style={{ cursor: 'pointer' }}
            >
              <Stack direction='row' alignItems='center' spacing={1}>
                <XLSXIcon fontSize='small' />
                <div>เปิดไฟล์</div>
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
              href={filePath}
              target='_blank'
              color='primary'
              underline='hover'
              // onClick={() => handleClickOpen(filePath)}
              style={{ cursor: 'pointer' }}
            >
              <Stack direction='row' alignItems='center' spacing={1}>
                {isPDF ? (
                  <PDFIcon fontSize='small' />
                ) : (
                  <ZipIcon fontSize='small' />
                )}
                <div>เปิดไฟล์</div>
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
    field: 'appro',
    headerName: 'ผลการรับรอง',
    align: 'center',
    headerAlign: 'center',
    width: 200,
    renderCell: (params) => {
      const status = get(params, 'row.status', '')

      if (status === 'เสร็จสิ้น') {
        return (
          <Button
            variant='contained'
            color='primary'
            size='small'
            sx={{ borderRadius: 24 }}
            startIcon={<ViewIcon />}
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
    </ThemeProvider>
  )
}

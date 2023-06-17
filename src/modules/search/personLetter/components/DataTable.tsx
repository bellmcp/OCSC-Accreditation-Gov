import * as React from 'react'
import { get } from 'lodash'
import { format } from 'date-fns'

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
import { createTheme, ThemeProvider, alpha, styled } from '@mui/material/styles'

import WarningRoundedIcon from '@material-ui/icons/WarningRounded'

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
    field: 'warn',
    headerName: 'คำเตือน',
    renderHeader: () => {
      return <></>
    },
    width: 50,
    align: 'right',
    headerAlign: 'right',
    disableColumnMenu: true,
    disableReorder: true,
    filterable: false,
    renderCell: (params) => {
      const warn = get(params, 'row.warn', false)
      return warn ? <WarningRoundedIcon color='error' /> : <></>
    },
    valueFormatter: (params) => {
      return params.value ? 'มี' : 'ไม่มี'
    },
  },
  {
    field: 'order',
    headerName: 'ลำดับ',
    width: 80,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'nationalId',
    headerName: 'เลขประจำตัวประชาชน',
    width: 180,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'title',
    headerName: 'คำนำหน้า',
    width: 100,
  },
  {
    field: 'firstname',
    headerName: 'ชื่อ',
    width: 150,
    renderCell: renderCellExpand,
  },
  {
    field: 'lastname',
    headerName: 'นามสกุล',
    width: 150,
    renderCell: renderCellExpand,
  },
  {
    field: 'country',
    headerName: 'ประเทศ',
    width: 150,
    renderCell: renderCellExpand,
  },
  {
    field: 'level',
    headerName: 'ระดับการศึกษา',
    width: 120,
    renderCell: renderCellExpand,
  },
  {
    field: 'university',
    headerName: 'มหาวิทยาลัย/สถาบันการศึกษา',
    width: 220,
    renderCell: renderCellExpand,
  },
  {
    field: 'degree',
    headerName: 'ชื่อปริญญา/ประกาศนียบัตร',
    width: 220,
    renderCell: renderCellExpand,
  },
  {
    field: 'branch',
    headerName: 'สาขา/วิชาเอก',
    width: 220,
    renderCell: renderCellExpand,
  },
  {
    field: 'faculty',
    headerName: 'คณะ/หน่วยงาน',
    width: 200,
    renderCell: renderCellExpand,
  },
  {
    field: 'appro',
    headerName: 'ผลการรับรอง',
    width: 375,
    renderCell: renderCellExpand,
  },
  {
    field: 'note',
    headerName: 'หมายเหตุ',
    width: 300,
    renderCell: renderCellExpand,
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
    field: 'letterDate',
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
    field: 'replyNo',
    headerName: 'เลขที่',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderCell: renderCellExpand,
  },
  {
    field: 'replyDate',
    headerName: 'วันที่',
    width: 150,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'id',
    headerName: 'เลขที่อ้างอิง',
    width: 120,
    align: 'center',
    headerAlign: 'center',
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
              fileName: `การรับรองคุณวุฒิบุคคล_${format(
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
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={[
            {
              groupId: 'letter',
              headerName: 'หนังสือเข้า',
              headerAlign: 'center',
              children: [
                { field: 'letterNo' },
                { field: 'letterDate' },
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
              groupId: 'reply',
              headerName: 'หนังสือออก',
              headerAlign: 'center',
              children: [{ field: 'replyNo' }, { field: 'replyDate' }],
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
          ]}
          initialState={{
            pagination: {
              pageSize: 50,
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
    </ThemeProvider>
  )
}

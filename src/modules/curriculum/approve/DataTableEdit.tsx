import React, { useEffect, useState } from 'react'
import { get, isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  FindInPage as FillIcon,
} from '@material-ui/icons'
import {
  gridClasses,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  bgBG,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRenderEditCellParams,
  useGridApiContext,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles'

import RecommendationModal from './RecommendationModal'

import * as curriculumActions from 'modules/curriculum/actions'

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

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.deleted`]: {
    color: theme.palette.error.main,
    textDecoration: 'line-through',
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.error.main, 0.15),
      '@media (hover: none)': {
        backgroundColor: alpha(theme.palette.error.main, 0.15),
      },
    },
  },
  [`& .${gridClasses.row}.default`]: {
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.07),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  [`& .MuiInputBase-input`]: {
    padding: 0,
    fontSize: 14,
  },
}))

interface GridCellExpandProps {
  value: string
  width: number
}

interface SubmitData {
  id: number
  isDeleted: boolean
  university: string
  degree: string
  branch: string
  isGov: boolean
  level: number
  faculty: string
  appro: string
  note: string
}

export default function DataTableEdit({
  data,
  isLocked,
  isInEditMode,
  setIsInEditMode,
}: any) {
  const dispatch = useDispatch()

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )
  const [educationLevels, setEducationLevels] = useState([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectionModel, setSelectionModel] = useState<any>([])
  const [currentEditRowData, setCurrentEditRowData] = useState(null)

  const { educationLevels: initialEducationLevels = [] } = useSelector(
    (state: any) => state.info
  )
  const { recommendations = [] } = useSelector((state: any) => state.curriculum)

  const openModal = () => {
    setIsOpenModal(true)
  }
  const closeModal = () => {
    setIsOpenModal(false)
  }

  useEffect(() => {
    setRows(data)
  }, [data])

  useEffect(() => {
    const parsed = initialEducationLevels.map((item: any) => {
      return { value: item.id, label: item.level }
    })
    setEducationLevels(parsed)
  }, [initialEducationLevels])

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true
  }

  const handleEditClick = (id: GridRowId) => () => {
    setIsInEditMode(true)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    setSelectionModel([])
    setIsInEditMode(false)
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row: any) => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter((row: any) => row.id !== id))
    }
    setSelectionModel([])
    setIsInEditMode(false)
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const submitData: SubmitData = {
      id: newRow.id,
      isDeleted: newRow.isDeleted,
      university: newRow.university,
      degree: newRow.degree,
      branch: newRow.branch,
      isGov: newRow.isGov,
      level: newRow.levelId,
      faculty: newRow.faculty,
      appro: newRow.accreditation,
      note: newRow.note,
    }
    const {
      id,
      isDeleted,
      university,
      degree,
      branch,
      isGov,
      level,
      faculty,
      appro,
      note,
    } = submitData
    dispatch(
      curriculumActions.updateRow(
        id,
        isDeleted,
        university,
        degree,
        branch,
        isGov,
        level,
        faculty,
        appro,
        note
      )
    )
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row: any) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
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

  const renderAccreditationEditCell = (params: GridRenderEditCellParams) => {
    return <AccreditationEditInputCell {...params} />
  }

  function AccreditationEditInputCell(props: GridRenderEditCellParams) {
    const { id, value, field } = props
    const apiRef = useGridApiContext()
    const rowData = apiRef.current.getRow(id)

    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
      if (!isEmpty(selectionModel)) {
        const selected = get(recommendations, `[${selectionModel}]`)
        const value = get(selected, 'accreditation', '')
        setInputValue(value)
      }
    }, [selectionModel]) //eslint-disable-line

    useEffect(() => {
      apiRef.current.setEditCellValue({ id, field, value: inputValue })
    }, [inputValue]) //eslint-disable-line

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      setInputValue(newValue)
    }

    return (
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        spacing={1}
        sx={{ width: '100%', padding: '0 16px' }}
      >
        <StyledInputBase
          value={inputValue}
          onChange={handleValueChange}
          size='small'
          fullWidth
        />
        <Tooltip title='ขอคำแนะนำ'>
          <IconButton
            size='small'
            color='primary'
            onClick={() => handleClickRecommendation(rowData)}
          >
            <FillIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    )
  }

  const columns: GridColumns = [
    {
      field: 'order',
      headerName: 'ลำดับ',
      width: 80,
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
    {
      field: 'ref1',
      headerName: 'รหัสหลักสูตร',
      width: 140,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'ref2',
      headerName: 'รหัสอ้างอิงเพื่อการติดตามหลักสูตร',
      width: 250,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'isGov',
      headerName: 'รัฐ/เอกชน',
      width: 100,
      editable: !isLocked,
      type: 'singleSelect',
      valueOptions: [
        { value: true, label: 'รัฐ' },
        { value: false, label: 'เอกชน' },
      ],
      renderCell: (params) => {
        const isGov = get(params, 'value', false)
        return isGov ? 'รัฐ' : 'เอกชน'
      },
    },
    {
      field: 'levelId',
      headerName: 'ระดับการศึกษา',
      width: 120,
      editable: !isLocked,
      type: 'singleSelect',
      valueOptions: educationLevels,
      renderCell: (params) => {
        const id = get(params, 'value', 0)
        const res = educationLevels.find(
          (educationLevel: any) => educationLevel.value === id
        )
        const level = get(res, 'label', '')
        return level
      },
    },
    {
      field: 'university',
      headerName: 'มหาวิทยาลัย/สถาบันการศึกษา',
      width: 220,
      editable: !isLocked,
      renderCell: renderCellExpand,
    },
    {
      field: 'faculty',
      headerName: 'คณะ/หน่วยงาน',
      width: 200,
      editable: !isLocked,
      renderCell: renderCellExpand,
    },
    {
      field: 'degree',
      headerName: 'ชื่อปริญญา/ประกาศนียบัตร',
      width: 220,
      editable: !isLocked,
      renderCell: renderCellExpand,
    },
    {
      field: 'branch',
      headerName: 'สาขา/วิชาเอก',
      width: 220,
      editable: !isLocked,
      renderCell: renderCellExpand,
    },
    {
      field: 'accreditation',
      headerName: 'ผลการรับรอง',
      width: 375,
      editable: !isLocked,
      renderEditCell: renderAccreditationEditCell,
      renderCell: renderCellExpand,
    },
    {
      field: 'note',
      headerName: 'หมายเหตุ',
      width: 300,
      editable: !isLocked,
      renderCell: renderCellExpand,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'จัดการข้อมูล',
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInRowEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInRowEditMode) {
          return [
            <Tooltip title='บันทึก'>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label='Save'
                onClick={handleSaveClick(id)}
                color='primary'
                disabled={isLocked}
              />
            </Tooltip>,
            <Tooltip title='ยกเลิก'>
              <GridActionsCellItem
                icon={<CancelIcon />}
                label='Cancel'
                onClick={handleCancelClick(id)}
                color='default'
                disabled={isLocked}
              />
            </Tooltip>,
          ]
        }

        return [
          <Tooltip title='แก้ไข'>
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              onClick={handleEditClick(id)}
              color='primary'
              disabled={isLocked || isInEditMode}
            />
          </Tooltip>,
        ]
      },
    },
    {
      field: 'isDeleted',
      headerName: 'ลบ/ไม่ลบ',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const deleted = get(params, 'value', false)
        return deleted ? 'ลบ' : 'ไม่ลบ'
      },
      editable: !isLocked,
      type: 'singleSelect',
      valueOptions: [
        { value: true, label: 'ลบ' },
        { value: false, label: 'ไม่ลบ' },
      ],
    },
  ]

  const handleClickRecommendation = (rowData: any) => {
    const { university = '', faculty = '', degree = '', branch = '' } = rowData
    dispatch(
      curriculumActions.loadRecommendation(university, faculty, degree, branch)
    )
    setCurrentEditRowData(rowData)
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
        </Stack>
      </GridToolbarContainer>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ minHeight: 500 }}>
        <StripedDataGrid
          autoHeight
          rows={rows}
          columns={columns}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          getRowClassName={(params) =>
            params.row.isDeleted ? 'deleted' : 'default'
          }
          initialState={{
            pagination: {
              pageSize: 50,
            },
          }}
          rowsPerPageOptions={[25, 50, 100, 250, 500, 1000]}
          components={{
            Toolbar: CustomToolbar,
          }}
          componentsProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          experimentalFeatures={{ newEditingApi: true }}
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
      <RecommendationModal
        isOpen={isOpenModal}
        onClose={closeModal}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        currentEditRowData={currentEditRowData}
        setCurrentEditRowData={setCurrentEditRowData}
      />
    </ThemeProvider>
  )
}

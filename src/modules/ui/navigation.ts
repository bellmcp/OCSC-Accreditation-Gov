const PATH = process.env.REACT_APP_BASE_PATH

export const mainItems = [
  {
    id: 0,
    title: 'หนังสือเข้า',
    url: PATH,
  },
]

export const searchItems = [
  {
    id: 1,
    sectionTitle: 'ค้นหาการรับรอง',
    title: 'คุณวุฒิบุคคล',
    url: `${PATH}/search/person-letter`,
  },
  {
    id: 2,
    title: 'คุณวุฒิหลักสูตร',
    url: `${PATH}/search/curriculum`,
  },
]

export const menuItems = [...mainItems, ...searchItems]

export const curriculumItems = [
  {
    id: 3,
    sectionTitle: 'หนังสือเวียน',
    title: 'ความคืบหน้า',
    url: `${PATH}/curriculum/progress`,
  },
  {
    id: 4,
    title: 'รับรองหลักสูตรใหม่',
    url: `${PATH}/curriculum/approve`,
  },
  {
    id: 5,
    title: 'นำเข้าหลักสูตรใหม่',
    url: `${PATH}/curriculum/import`,
  },
  {
    id: 6,
    title: 'ออกหนังสือเวียน',
    url: `${PATH}/curriculum/export`,
  },
]

export const infoItems = [
  {
    id: 7,
    sectionTitle: 'ข้อมูลพื้นฐาน',
    title: 'ประเทศ',
    url: `${PATH}/info/country`,
  },
  {
    id: 8,
    title: 'กลุ่มเงินเดือน',
    url: `${PATH}/info/salary-group`,
  },
  {
    id: 9,
    title: 'ระดับการศึกษา',
    url: `${PATH}/info/education-level`,
  },
  {
    id: 10,
    title: 'มหาวิทยาลัย',
    url: `${PATH}/info/university`,
  },
]

export const navigationItems = [
  ...mainItems,
  ...searchItems,
  ...curriculumItems,
  ...infoItems,
]

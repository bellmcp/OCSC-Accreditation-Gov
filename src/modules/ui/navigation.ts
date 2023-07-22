const PATH = process.env.REACT_APP_BASE_PATH

export const navigationItems = [
  {
    id: 0,
    title: 'หน้าหลัก',
    url: PATH,
  },
  {
    id: 1,
    title: 'คำร้องขอตรวจสอบคุณวุฒิ',
    url: `${PATH}/aaa`,
  },
  {
    id: 2,
    title: 'ค้นหาหนังสือรับรองคุณวุฒิ',
    url: `${PATH}/bbb`,
  },
]

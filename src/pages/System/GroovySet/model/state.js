
const demoData = [
  {
    name: '脚本1',
    no: 'jiaoben1',
    online: false,
    createDate: '2019-11-11',
    updateDate: '2019-12-12',
    content: 'test',
  },
];

function getInitialState() {
  return {
    tableData: demoData,
    loading: false,
    onlineLoading: false,
    newModalVisible: false,
    recordLoding: false,
    newLoading: false,
    modalType: 'new', // edit, new, show
    modalNo: '', // 弹窗 标识
    modalData: {}, // 弹窗的数据
    pagination: {
      size: 'small',
      pageSize: 10,
      current: 1,
      total: 0,
      showSizeChanger: true,
    }
  };
}

export default getInitialState;

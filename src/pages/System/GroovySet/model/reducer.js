/** @typedef {import('types/store').AC<'GroovySet'>} AC */
/** @typedef {ReturnType<import('./state').default>} St */
import request from 'services/newRequest';

const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

/** 弹窗 */
export function openModal(data = {}, /**  @type St*/moduleState, /** @type AC*/ac) {
  const toSet = {
    newModalVisible: true,
    modalType: data.type,
    modalNo: data.no,
  };
  if (data.type === 'edit' || data.type === 'show') {
    ac.dispatch(qryDetail, data.no);
  } else {
    toSet.modalData = {};
  }
  return toSet;
}

/** 列表数据 */
export async function qryTableDate(payload = {}, /**  @type St*/moduleState, /** @type AC*/ac) {
  const { pagination } = moduleState;
  const page = payload.page || 1;
  const size = payload.size || pagination.pageSize;

  await ac.setState({ loading: true });
  const res = await request({
    url: '/script/page',
    method: 'post',
    data: { page, size },
  });
  await delay(5000);

  const toSet = { loading: false };
  if (res.success) {
    const resData = res.data || {};
    toSet.tableData = resData.listData || [];
    pagination.total = resData.total;
    pagination.current = page;
    pagination.pageSize = size;
    toSet.pagination = pagination;
  }
  return toSet;
}

/** 状态切换 */
export async function onlineChange({ type, record }, /**  @type St*/moduleState, /** @type AC*/ac) {
  await ac.setState({ onlineLoading: true });
  const res = await request({
    url: '/script/online',
    method: 'post',
    data: {
      no: record.no,
      online: type,
    },
  });
  if (res.success) {
    message.success('状态切换成功！');
    ac.dispatch(qryTableDate);
  }
  return { onlineLoading: false };
}

/** 新建脚本 */
export async function addEdit(data, /**  @type St*/moduleState, /** @type AC*/ac) {
  await ac.setState({ newLoading: true });
  const res = await request({
    url: '/script/add',
    method: 'post',
    data,
  });
  if (res.success) {
    message.success('新建成功！');
    await ac.setState({ newModalVisible: false });
    await ac.dispatch(qryTableDate);
  }
  return { newLoading: false };
}

/** 修改脚本 */
export async function modEdit(data, /**  @type St*/moduleState, /** @type AC*/ac) {
  await ac.setState({ newLoading: true });
  const res = await request({
    url: '/script/edit',
    method: 'post',
    data,
  });
  if (res.success) {
    message.success('修改成功！');
    await ac.setState({ newModalVisible: false });
    await ac.dispatch(qryTableDate);
  }
  return { newLoading: false };
}

/**  删除 */
export async function delOne(no, /**  @type St*/moduleState, /** @type AC*/ac) {
  await ac.setState({ recordLoding: true });
  const res = await request({
    url: '/script/delete',
    method: 'post',
    data: { no },
  });
  if (res.success) {
    message.success('删除成功！');
    await ac.dispatch(qryTableDate);
  }
  return { recordLoding: false };
}

export async function qryDetail(no, /**  @type St*/moduleState, /** @type AC*/ac) {
  await ac.setState({ loading: true });
  const res = await request({
    url: '/script',
    method: 'post',
    data: { no },
  });

  const toSet = { loading: false };
  if (res.success) {
    toSet.modalData = res.data || {};
  }
  return toSet;
}

import ccReducer from 'configs/ccReducer';

export function pagination({ pagination }) {
  const qryTableDate = (page, size) => {
    ccReducer.GroovySet.qryTableDate({ page, size })
  };

  return {
    onChange: qryTableDate,
    onShowSizeChange: qryTableDate,
    showTotal: (totalP) => `共 ${totalP} 条记录`,
    ...pagination,
  };
}

export function ModalTitle({ modalType }) {
  let res = 'Groovy脚本';
  if (modalType === 'edit') {
    res = `编辑${res}`;
  } else if (modalType === 'new') {
    res = `新增${res}`;
  }
  return res;
}

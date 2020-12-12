import React, { useContext, useEffect, useState, createRef } from 'react';
import { Form, Input, Modal, Icon, Spin, message } from 'antd';
import { observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';
import { groovyTemp } from 'utils/constant';
// import Store from './store';
import { useModGroovySet } from 'configs/useC2Module';

import 'codemirror/mode/groovy/groovy';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/selection/active-line';
// import 'codemirror/addon/display/fullscreen';
// import 'codemirror/addon/display/fullscreen.css';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';

import 'codemirror/addon/edit/matchbrackets';

const options = {
  lineNumbers: true, // 显示行
  mode: 'groovy', // 语法
  theme: 'material', // 主题风格
  readOnly: false, // 是否只可读
  extraKeys: { Ctrl: 'autocomplete' },
  foldGutter: true, // 代码折叠
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'], // 代码折叠
  matchBrackets: true, // 自动匹配括号
  styleActiveLine: true, // 当前行高亮
  // hintOptions: { completeSingle: true },
};

const myModal = () => {

  const codeRef = createRef();
  const [form] = Form.useForm();

  // useModGroovySet return render context of GroovySet module
  const { state, mr, moduleComputed: mcu } = useModGroovySet();
  const { modalData } = state;
  const [code, setCode] = useState(modalData.content || groovyTemp);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setCode(modalData.content || groovyTemp);
  }, [modalData]);

  // CodeMirror value={code}无效。 暂使用 ref setValue更新
  useEffect(() => {
    if (codeRef.current) {
      const mirror = codeRef.current.getCodeMirror();
      mirror.setValue(code);
    }
  }, [code]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const groovyCode = codeRef.current && codeRef.current.getCodeMirror().getValue();
      if (!groovyCode) {
        message.error('请输入groovy脚本!');
        return;
      }
      if (state.modalType === 'edit') {
        mr.modEdit({ no: values.no, name: values.name, content: groovyCode });
      }
      if (state.modalType === 'new') {
        mr.addEdit({ no: values.no, name: values.name, content: groovyCode });
      }
    });
  };

  const onCodeChange = () => {
    // console.log(code, codeRef);
    // setCode(code);
    // const mirror = codeRef.current.getCodeMirror();
    // mirror.setValue(code);
  };

  return (
    <Modal
      className={fullscreen ? 'code-mirror-modal code-mirror-modal-fullScreen' : 'code-mirror-modal'}
      title={mcu.ModalTitle}
      destroyOnClose
      width={700}
      visible={state.newModalVisible}
      onOk={handleSubmit}
      okText="保存"
      okButtonProps={{ loading: state.newLoading, disabled: state.modalType === 'show' }}
      onCancel={() => mr.setState({ newModalVisible: false })}
    >
      <Spin spinning={state.loading}>
        <Form layout="inline" className="form-area" form={form}>
          <Form.Item
            label="脚本名称"
            name="name"
            initialValue={modalData.name}
            rules={[{ required: true, whitespace: true, message: '请输入脚本名称' }]}
          >
            <Input placeholder="请输入脚本名称" maxLength={64} disabled={state.modalType !== 'new'} />
          </Form.Item>
          <Form.Item
            label="脚本标识"
            name="no"
            initialValue={modalData.no}
            rules={[
              { required: true, whitespace: true, message: '请输入脚本标识' },
              { pattern: /^[A-Za-z0-9_]+$/, message: '请输入字母、数字、下划线组合' },
            ]}
          >
            <Input placeholder="请输入脚本标识" maxLength={64} disabled={state.modalType !== 'new'} />
          </Form.Item>
        </Form>
        {fullscreen ? (
          <Icon type="fullscreen-exit" className="full-screen-exit-icon" onClick={() => setFullscreen(false)} />
        ) : (
          <Icon type="fullscreen" className="full-screen-icon" onClick={() => setFullscreen(true)} />
        )}

        <CodeMirror
          ref={codeRef}
          defaultValue={code}
          value={code}
          options={Object.assign(options, { readOnly: state.modalType === 'show' })}
          onChange={onCodeChange}
        />
      </Spin>
    </Modal>
  );
};

export default observer(myModal);

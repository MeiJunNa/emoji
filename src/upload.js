import React, { Component } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Modal, Upload,Button } from "antd";
import ImgCrop from "antd-img-crop";
import _ from "lodash";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "./App.css";
class BannerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      showUpload: false,
      visible: false
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    // console.log("event===", event);
    // if (event.file.status === "removed") {
    //   // let fileList = _.clone(this.state.fileList);
    //   let removeFileList = event.file;
    //   // fileList = _.remove(fileList, function (file) {
    //   //   return file.uid !== removeFileList.uid;
    //   // });
    //   this.props.removeFile(removeFileList)
    //   // fileList = _.remove(fileList, function (file) {
    //   //   return file.uid !== removeFileList.uid;
    //   // });
    //   // let clearRemoveFileList = _.clone(removeFileList);
    //   // clearRemoveFileList.url = "";
    //   // clearRemoveFileList.name = "";
    //   // fileList.push(clearRemoveFileList);
    //   // console.log("fileList,removeFileList===", fileList, removeFileList);
    //   this.setState({ showUpload: true });
    // }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  render() {
    console.log("imgArray",this.props.imgArray)
    return (
      <div className="edit_img_container">
        <EditOutlined className="edit_img_icon" onClick={this.showModal}/>
        <Modal
          title="编辑图片"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ImgCrop rotate>
            <Upload
              action="http://192.168.1.5:8081/index/uploadImage"
              listType="picture-card"
              fileList={this.state.fileList}
              onChange={this.onChange}
              onPreview={this.onPreview}
            >
              {this.state.fileList.length===0 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </Modal>
      </div>
    );
  }
}

export default BannerManage;
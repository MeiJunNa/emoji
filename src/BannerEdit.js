import React from "react";
import {
    Form, Input, Button, Upload, message, Tabs
} from "antd";
import { PlusSquareOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

class BannerEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [],
            activeKey: 1,
        };
    };
    componentDidMount() {
        this.setState({bannerList:this.props.bannerList})
    };
    handleChange = (info, index) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            let pic = {};
            if (info.file.response && 0 === info.file.response.result) {
                console.log('file', info.file);
                pic.uid = info.file.response.ret.slice(0, /\.{1}[a-z]{1,}$/.exec(info.file.response.ret).index);
                pic.name = info.file.name || info.file.response.ret;
                pic.status = 'done';
                pic.url = info.file.response.ret;
            }
            this.state.bannerList[index].uid = pic.uid;
            this.state.bannerList[index].name = pic.name;
            this.state.bannerList[index].url = pic.url;
            console.log('bannerList', this.state.bannerList);
            this.forceUpdate();
            this.props.getBanners && this.props.getBanners(this.state.bannerList);
        }
    };
    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
        if (!isJPG) {
            message.error('只能上传JPG、PNG或BMP格式的图片文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
            message.error('Image must smaller than 20MB!');
        }
        return isJPG && isLt2M;
    };
    onChange = activeKey => {
        console.log('activeKey', activeKey)
        this.setState({ activeKey });
    };
    onEdit = (targetKey, action) => {
        console.log('targetKey', targetKey, action)
        this[action](targetKey);
    };

    add = () => {
        const { bannerList } = this.state;
        const activeKey = new Date().getTime().toString();
        bannerList.push({ key: activeKey, bgColor: 'rgba(0,0,0,1)', color: '#000', alpha: 100 });
        this.setState({ bannerList, activeKey });
        this.props.getBanners && this.props.getBanners(bannerList);
    };

    remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.bannerList.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const bannerList = this.state.bannerList.filter(pane => pane.key !== targetKey);
        if (bannerList.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = bannerList[lastIndex].key;
            } else {
                activeKey = bannerList[0].key;
            }
        }
        this.setState({ bannerList, activeKey });
        this.props.getBanners && this.props.getBanners(bannerList);
    };
    render() {
        let { bannerList } = this.state;
        return (
            <Tabs
                onChange={this.onChange}
                activeKey={this.state.activeKey}
                type="editable-card"
                onEdit={this.onEdit}
            >
                {
                    bannerList.map((pane, index) => {
                        let imageView;
                        if (pane) {
                            imageView = (
                                <div key={"img"+index}>
                                    <img style={{ height: 360 }} src={pane} alt="avatar" />
                                </div>
                            );
                        } else {
                            imageView = (
                                <div key={"choiceImg"+index}>
                                    <PlusSquareOutlined />
                                    <div className="ant-upload-text">选择图片</div>
                                </div>
                            );
                        }
                        return (
                            <TabPane tab={"横幅" + (index + 1)} key={"uploadImg"+index} closable>
                                <div style={{ width: '100%', minHeight: 420 }}>
                                    <Upload
                                        accept={'.jpg,.jpeg,.png'}
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader orgCover"
                                        style={{ height: 360 }}
                                        showUploadList={false}
                                        showRemoveIcon
                                        // action={}
                                        beforeUpload={this.beforeUpload}
                                        onChange={(info) => this.handleChange(info, index)}
                                    >
                                        {imageView}
                                    </Upload>
                                </div>
                            </TabPane>
                        )
                    }
                    )
                }
            </Tabs>
        );
    }
}
export default BannerEdit;
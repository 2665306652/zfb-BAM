import React, { Component } from 'react';
import {
    Upload,
    Icon
} from "antd";
import styles from './index.less';
import Api from '../../utils/api';
import Url from '../../utils/url';
const { Dragger } = Upload;

/**
 * todo 上传缩略图
 */

class UploadImage extends Component {
    constructor() {
        super();
        this.state = {
            fileList: []
        }
    }

    handleChange({file, fileList, event}) {
        if (!fileList.length) return;
        let imgurl = fileList.slice(-1)[0].response;
        this.setState({
            imgUrl: file.url
        })

    }

    render() {
        const { fileList } = this.state;
        return (
            <div className={styles.upload}>
                <Upload
                    action={Url.uploadImage}
                    name='imageFile'
                    listType="picture-card"
                    fileList={fileList}
                    onChange={({file, fileList, event}) => this.handleChange({file, fileList, event})}
                    showUploadList={{
                        showPreviewIcon: false,
                        showRemoveIcon: false
                    }}
                >
                    <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                    </div>
                </Upload>
            </div>
        )
    }
}

export default UploadImage;

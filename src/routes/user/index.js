import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Input } from 'antd';
// import Api from '../../utils/api';

function mapStateToProps(state) {
    return {
        userName: state.user.userName,
        name: state.user.name,
        // phone : state.user.phone,
        userId: state.user.userId,
        // jurisdiction : state.user.jurisdiction
    };
}

class index extends Component {
    componentDidMount() {
        this.updateList()
    }
    updateList = () => {
        this
            .props
            .dispatch({ type: 'user/getLoginInfo', payload: {} })
    }
    render() {
        let { userName, name, userId } = this.props;
        // eslint-disable-next-line no-eval
        // jurisdiction = eval('['+ jurisdiction +']');
        // let jurisdictionText = Api._getJurisdiction(jurisdiction);
        // console.log(jurisdictionText)
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    用户中心
                </h2>
                <div className={styles.main}>
                    <div className={styles.mainItem}>
                        <span className={styles.itemTitle}>用户ID:</span>
                        <Input value={userId} className={styles.itemInput} disabled />
                    </div>
                    <div className={styles.mainItem}>
                        <span className={styles.itemTitle}>账号:</span>
                        <Input value={userName} className={styles.itemInput} disabled />
                    </div>
                    <div className={styles.mainItem}>
                        <span className={styles.itemTitle}>名字:</span>
                        <Input value={name} className={styles.itemInput} disabled />
                    </div>

                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(index);
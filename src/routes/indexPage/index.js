import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
// import { Button } from 'antd';

// import Api from '../../utils/api';

function IndexPage() {
    return (
        <div className={styles.normal}>
            <div className={styles.title}>游嵩山</div>
            <div className={styles.welcome} >独背焦桐访洞天，暂攀灵迹弃尘缘。</div>
            <div className={styles.welcome} >深逢野草皆疑药，静见樵人恐是仙。</div>
            <div className={styles.welcome} >翠木入云空自老，古碑横水莫知年。</div>
            <div className={styles.welcome} >可怜幽景堪长往，一任人间岁月迁。</div>
        </div>
    );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);

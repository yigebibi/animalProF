import React from 'react';
import InfoPage from '../components/InfoPage';

const ContactPage: React.FC = () => (
  <InfoPage
    title="联系我们"
    description="如果你在使用过程中遇到问题，或希望反馈建议，可以通过以下方式联系项目维护者。"
    sections={[
      { heading: '反馈方式', body: ['你可以通过项目仓库 issue 提交问题，也可以通过预留邮箱联系维护团队。'] },
      { heading: '响应范围', body: ['我们优先处理账户异常、内容访问问题、文件上传失败和数据错误等影响使用的问题。'] },
    ]}
  />
);

export default ContactPage;

import React from 'react';
import InfoPage from '../components/InfoPage';

const PrivacyPage: React.FC = () => (
  <InfoPage
    title="隐私政策"
    description="我们尊重并保护你的个人信息，只在提供论坛功能所必需的范围内收集和使用数据。"
    sections={[
      { heading: '信息收集', body: ['平台会保存账户资料、帖子内容、评论记录、上传文件和必要的系统日志，用于维持功能正常运行。'] },
      { heading: '信息使用', body: ['你的信息主要用于账户识别、内容展示、功能联动和安全审计，不会在未经授权的情况下用于无关用途。'] },
    ]}
  />
);

export default PrivacyPage;

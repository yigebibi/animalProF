import React from 'react';
import InfoPage from '../components/InfoPage';

const AboutPage: React.FC = () => (
  <InfoPage
    title="关于我们"
    description="宠物论坛是一个面向养宠人群的交流社区，专注分享养宠经验、健康知识与日常故事。"
    sections={[
      { heading: '我们的目标', body: ['帮助宠物主人更轻松地获取有价值的信息，也让每一段和宠物有关的生活都能被记录与分享。'] },
      { heading: '社区内容', body: ['社区支持发帖、评论、收藏、搜索与宠物资料管理，适合记录日常、求助讨论和经验沉淀。'] },
    ]}
  />
);

export default AboutPage;

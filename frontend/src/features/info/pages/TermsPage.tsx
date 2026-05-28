import React from 'react';
import InfoPage from '../components/InfoPage';

const TermsPage: React.FC = () => (
  <InfoPage
    title="服务条款"
    description="使用宠物论坛即表示你同意遵守社区的基本规则，并对自己发布的内容负责。"
    sections={[
      { heading: '内容规范', body: ['禁止发布违法、侵权、骚扰、虚假或恶意内容。请确保所分享的信息真实、适度并尊重他人。'] },
      { heading: '账户责任', body: ['请妥善保管你的登录凭证，不要将账户借给他人使用。因个人保管不善造成的风险由用户自行承担。'] },
    ]}
  />
);

export default TermsPage;

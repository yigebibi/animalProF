import React from 'react';

interface InfoPageProps {
  title: string;
  description: string;
  sections: Array<{ heading: string; body: string[] }>;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, description, sections }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 mb-8 leading-7">{description}</p>
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.heading}</h2>
                <div className="space-y-3 text-gray-700 leading-7">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;

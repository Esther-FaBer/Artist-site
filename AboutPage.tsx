import './AboutPage.css';


const cv = {
  born: '1991, Madrid, Spain',
  location: 'Lives and works in Madrid',
 
  education: [
    { year: '2017', detail: 'The Royal College of Art, MA Print' },
    { year: '2015', detail: 'University Complutense Madrid, Fine Arts BA (Hons),' },
    { year: '2011', detail: 'Scholarship Cátedra Francisco de Goya  awarded by University Complutense and Caja Ávila' },
  ],
 
  groupExhibitions: [
    { year: '', detail: '' },
    { year: '', detail: '' },
    { year: '', detail: '' },
  ],
 
  awards: [
    { year: '2023', detail: 'Award Name' },
    { year: '2022', detail: 'Residency Name, Location' },
  ],
  
  artistResidencies: [
    { year: '', detail: '' },
    { year: '', detail: '' },
    { year: '', detail: '' },
  ],
 
  collections: [
    'Ushaw Historic House, Chapels & Gardens',
    '',
  ],
  publications: [
    { year: '2018', detail: 'Artist Eye, Printmaking Today Magazine, Issue 107 Vol 27 no 3 Autumn 2018' }
  ]
};

// Sub-components
 
interface CvEntry {
  year: string;
  detail: string;
}
 
function CvSection({
  heading,
  entries,
}: {
  heading: string;
  entries: CvEntry[];
}) {
  return (
    <section className="cv-section">
      
    </section>
  );
}
 
 
export default AboutPage;
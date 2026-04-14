import PersonalData from './PersonalData';
import Certifications from '../profesional/Certifications';
import Experiences from '../profesional/Experiences';

export default function ManageGrid() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:max-h-3/4'>
      <PersonalData />
      <Certifications />
      <Experiences />
    </div>
  );
}

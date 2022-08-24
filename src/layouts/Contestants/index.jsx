import { useContext } from 'react';

import { useParams } from 'react-router-dom';
import Context from '../../context';
import Profile from './layout';
import Profiles from './layout/Profiles';

const Contestants = () => {
  const { contestants } = useContext(Context)
  const params = useParams();

  return (
    <div className='App-contestants'>
      {
        params.id ? <Profile reg={params.id} /> : <Profiles contestants={contestants} />
      }
    </div>
  )
}

export default Contestants
import { Link } from 'react-router-dom';
import { IText } from '../../components/DataTypes';

interface ITextElements {
  text: IText;
}

const TextElements = (props: ITextElements) => {
  return (
    <Link to={`/Text/${props.text.id}`} key={props.text.id}>
      <div className='text-list-element' key={props.text.id}>
        <div className='text-list-title-container'>
          {props.text.title}
          <p className='text-page-preview-language'>{props.text.language}</p>
        </div>
        <p className='text-list-user'>by {props.text.login}</p>
      </div>
    </Link>
  );
};

export default TextElements;

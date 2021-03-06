import Link from 'next/link';
//import Header from '../Layout/AppHead';

const IndexRow = props => (
  <tr>
    <td>
      <h3>
      <Link href={`/tasks/${props.id}`}>
        <a>{props.title}</a>
      </Link>
      </h3>
      {props.date} , ID: {props.id}
    </td>
    <td>
      <Link href={`/tasks/edit/${props.id}`}>
        <a className="btn btn-sm btn-outline-primary"> Edit</a>
      </Link>
    </td>
  </tr>
);
export default IndexRow;

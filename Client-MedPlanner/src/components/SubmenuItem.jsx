import { Link } from 'react-router-dom'

const SubmenuItem = (props) => {
    return (
        <Link to={props.to} className='flex align-baseline mr-4 text-gray-500 gap-2 hover:text-teal-700 items-center'>
            {props.icon}
            {props.text}
        </Link >

    )
}

export default SubmenuItem
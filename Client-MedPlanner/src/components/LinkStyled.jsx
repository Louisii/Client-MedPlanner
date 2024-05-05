import { Link } from 'react-router-dom'

const LinkStyled = (props) => {
    return (
        <Link to={props.to} target={props.target} className='inline-block underline align-baseline mr-20 text-sm text-gray-500 hover:text-blue-800'>
            {props.text}

        </Link >

    )
}

export default LinkStyled
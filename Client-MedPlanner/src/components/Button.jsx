const Button = (props) => {
    return (
        <button
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    )
}

export default Button

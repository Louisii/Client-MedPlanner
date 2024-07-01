const ButtonVermelho = (props) => {
    return (
        <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    )
}

export default ButtonVermelho

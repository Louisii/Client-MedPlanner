const InputDisabled = (props) => {
    return (
        <input className="h-[40px] m-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
            type={props.type}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onBlur={props.onBlur}
            value={props.value}
            disabled
        />
    )
}
export default InputDisabled


{/* <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                        <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
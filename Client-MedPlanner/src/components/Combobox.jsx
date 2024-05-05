const Combobox = (props) => {
    return (
        <div>
            <select
                id="estado-civil"
                onChange={props.onChange}
                className="h-[40px] m-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                name="estado civil"
            >
                {Array.isArray(props.opcoes) &&
                    Array.isArray(props.opcoesDisplay) &&
                    props.opcoes.map((opcao, i) => (
                        <option key={i} value={opcao}>
                            {props.opcoesDisplay[i]}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default Combobox;
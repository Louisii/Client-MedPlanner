// Combobox Component
import React from 'react';

const Combobox = ({ opcoes, value, onChange }) => {
    return (
        <select
            onChange={(e) => onChange(e.target.value)}
            className="h-[40px] m-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={value}
        >
            {opcoes.map((opcao, i) => (
                <option key={i} value={opcao}>
                    {opcao}
                </option>
            ))}
        </select>
    );
};

export default Combobox;

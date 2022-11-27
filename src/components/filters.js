import "./filter.css";

export const FilterBar = ({options, selected}) => (
    <div class="filter-bar">
        {options.map(opt => (
            <div key={opt} class={`filter-bar-option ${selected == opt && 'selected'}`}>
                {opt}
            </div>
        ))}
    </div>
);
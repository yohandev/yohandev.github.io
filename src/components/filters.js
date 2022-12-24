import "./filter.css";

export const FilterBar = ({options, selected, ...props}) => (
    <div class="filter-bar" {...props}>
        {options.map(opt => (
            <div key={opt} class={`filter-bar-option ${selected == opt && 'selected'}`}>
                {opt}
            </div>
        ))}
    </div>
);
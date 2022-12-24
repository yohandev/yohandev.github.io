import "./filter.css";

export const FilterBar = ({options, selected, onSelect, ...props}) => (
    <div class="filter-bar" {...props}>
        {options.map(opt => (
            <div
                key={opt}
                class={`filter-bar-option ${selected == opt && 'selected'}`}
                onclick={() => onSelect(opt)}
            >
                {opt}
            </div>
        ))}
    </div>
);
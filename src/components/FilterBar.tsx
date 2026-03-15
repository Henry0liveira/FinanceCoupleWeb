export default function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  dateRange,
  onDateChange,
  people,
  selectedPerson,
  onPersonChange
}: {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  dateRange: { from: string; to: string };
  onDateChange: (value: { from: string; to: string }) => void;
  people?: { id: string; name: string }[];
  selectedPerson?: string;
  onPersonChange?: (value: string) => void;
}) {
  return (
    <div className="card flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
      <div className="flex-1">
        <label className="label">Categoria</label>
        <select
          className="input mt-2"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {people && selectedPerson !== undefined && onPersonChange ? (
        <div className="flex-1">
          <label className="label">Pessoa</label>
          <select
            className="input mt-2"
            value={selectedPerson}
            onChange={(e) => onPersonChange(e.target.value)}
          >
            <option value="all">Todas as pessoas</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="flex flex-1 gap-4">
        <div className="flex-1">
          <label className="label">De</label>
          <input
            type="date"
            className="input mt-2"
            value={dateRange.from}
            onChange={(e) => onDateChange({ ...dateRange, from: e.target.value })}
          />
        </div>
        <div className="flex-1">
          <label className="label">Até</label>
          <input
            type="date"
            className="input mt-2"
            value={dateRange.to}
            onChange={(e) => onDateChange({ ...dateRange, to: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

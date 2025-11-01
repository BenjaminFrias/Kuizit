import { Button } from './ui/button';

type Option<T extends string | number> = {
	value: T;
	label: string | number;
};
type Props<T extends string | number> = {
	value: T;
	options: Option<T>[];
	size: 'sm' | 'md';
	onChange: (value: T) => void;
};

export function OptionGroup<T extends string | number>({
	value,
	options,
	size,
	onChange,
}: Props<T>) {
	return (
		<div role="radiogroup" className="flex gap-2 w-full">
			{options.map((opt) => {
				const isChecked = opt.value === value;
				return (
					<Button
						key={opt.value}
						type="button"
						aria-checked={isChecked}
						role="radio"
						size={size}
						variant={isChecked ? 'green' : 'minimal'}
						onClick={() => {
							onChange(opt.value);
						}}
						className="flex flex-1gap-2 w-full"
					>
						{opt.label}
					</Button>
				);
			})}
		</div>
	);
}

interface PopoverTriggerProps {
	id: string;
	type: 'button';
	role: 'button';
	tabindex: 0;
	'aria-expanded': boolean;
	'aria-haspopup': 'dialog';
}

interface PopoverContentProps {
	id: string;
	tabindex: -1;
}

interface SelectTriggerProps {
	id: string;
	type: 'button';
	role: 'combobox';
	tabindex: 0;
	'aria-autocomplete': 'list';
	'aria-controls': string;
	'aria-expanded': boolean;
}

interface SelectContentProps {
	id: string;
	tabindex: -1;
	role: 'listbox';
}

interface SelectGroupProps {
	role: 'group';
	'aria-labeledby': string;
}

interface SelectLabelProps {
	id: string;
}

interface SelectOptionProps {
	id: string;
	role: 'option';
	'aria-selected': string;
}

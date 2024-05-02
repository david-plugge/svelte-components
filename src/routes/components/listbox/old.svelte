<script lang="ts">
	class Listbox {
		listbox() {
			return {
				onkeydown: this.#handleKeydown,
				onfocus: this.#handleFocus,
				tabindex: 0,
				role: 'listbox'
			};
		}

		#handleKeydown = (e: KeyboardEvent) => {
			const listbox = e.currentTarget;
			if (!(listbox instanceof HTMLElement)) return;

			const multiselectable = listbox.getAttribute('aria-multiselectable') === 'true';

			const options = Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]'));
			let currentIndex = options.findIndex((el) => el.getAttribute('aria-selected') === 'true');
			if (!multiselectable && currentIndex === -1) {
				currentIndex = 0;
				options[0].setAttribute('aria-selected', 'true');
			}

			const setActive = (index: number) => {
				options[currentIndex].setAttribute('aria-selected', 'false');
				options[index].setAttribute('aria-selected', 'true');
			};

			switch (e.key) {
				case 'ArrowDown': {
					const newIndex = (currentIndex + 1) % options.length;
					setActive(newIndex);
					break;
				}
				case 'ArrowUp': {
					const newIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
					setActive(newIndex);
					break;
				}
				case 'Home': {
					setActive(0);
					break;
				}
				case 'End': {
					setActive(options.length - 1);
					break;
				}
				case 'a': {
					if (multiselectable && e.shiftKey) {
						options.forEach((option) => option.setAttribute('aria-selected', 'true'));
					}
					break;
				}
			}
		};

		#handleFocus = (e: FocusEvent) => {
			const el = e.currentTarget;
			if (!(el instanceof HTMLElement)) return;

			if (el.querySelector('[aria-selected="true"]')) return;

			el.querySelector('[role="option"]')?.setAttribute('aria-selected', 'true');
		};

		option() {
			return {
				role: 'option',
				'aria-selected': false,
				onclick: (e: Event) => {
					console.log(e);
				},
				onselect: (e: Event) => {
					console.log(e);
				}
			};
		}
	}

	const listbox = new Listbox();

	let show = $state(true);
</script>

<div class="p-24">
	<button onclick={() => (show = !show)}>Toggle</button>

	<div {...listbox.listbox()}>
		<div
			class="aria-selected:bg-blue-300"
			{...listbox.option()}
		>
			a
		</div>
		<div
			class="aria-selected:bg-blue-300"
			{...listbox.option()}
		>
			b
		</div>
		<div
			class="aria-selected:bg-blue-300"
			{...listbox.option()}
		>
			c
		</div>

		{#if show}
			<div
				class="aria-selected:bg-blue-300"
				{...listbox.option()}
			>
				d
			</div>
		{/if}
	</div>
</div>

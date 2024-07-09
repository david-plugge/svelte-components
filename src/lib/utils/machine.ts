interface Machine<States extends string> {
	initial: NoInfer<States>;
	states: {
		[K in States]: {
			on?: Record<
				string,
				{
					target: NoInfer<States>;
				}
			>;
		};
	};
}

function createMachine<States extends string>(machine: Machine<States>) {}

createMachine({
	initial: 'closed',
	states: {
		closed: {
			on: {
				TRIGGER_CLICK: {
					target: 'open'
				}
			}
		},
		open: {
			on: {
				TRIGGER_CLICK: {
					target: 'closed'
				}
			}
		}
	}
});

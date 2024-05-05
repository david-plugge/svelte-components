<script lang="ts">
	import { ReactiveObject } from '$lib/utils/reactivity';

	class A {
		a = $state('1');
		b = $state('1');

		get props() {
			const that = this;
			return {
				get aa() {
					return that.a;
				},
				get bb() {
					return that.b;
				}
			};
		}
	}

	class C extends A {
		c = $state('1');
		d = $state('1');

		get props() {
			const that = this;
			return ReactiveObject.merge(super.props, {
				get cc() {
					return that.c;
				},
				get dd() {
					return that.d;
				}
			});
		}
	}

	const a = new C();

	$inspect('a', a.props.aa);
	$inspect('b', a.props.bb);
	$inspect('c', a.props.cc);
	$inspect('d', a.props.dd);
</script>

<input bind:value={a.a} />
<input bind:value={a.b} />
<input bind:value={a.c} />
<input bind:value={a.d} />

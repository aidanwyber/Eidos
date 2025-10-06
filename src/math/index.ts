import { simplexNoise } from './simplexNoise';

export * from './simplexNoise';

console.log('simplexNoise...');
for (let i = 0; i < 100; i++) {
	const t = i / 100;
	console.log(simplexNoise(t, 0, 0, 0));
}

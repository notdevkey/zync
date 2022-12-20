interface Animal {
	name: string;
	color: string;
}
interface Cat {
	name: string;
	age?: number;
	parent: Animal;
	birthDate?: Date;
}

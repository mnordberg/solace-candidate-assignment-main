import db from "..";
import { advocates } from "../schema";

const specialties = [
	"Bipolar",
	"LGBTQ",
	"Medication/Prescribing",
	"Suicide History/Attempts",
	"General Mental Health (anxiety, depression, stress, grief, life transitions)",
	"Men's issues",
	"Relationship Issues (family, friends, couple, etc)",
	"Trauma & PTSD",
	"Personality disorders",
	"Personal growth",
	"Substance use/abuse",
	"Pediatrics",
	"Women's issues (post-partum, infertility, family planning)",
	"Chronic pain",
	"Weight loss & nutrition",
	"Eating disorders",
	"Diabetic Diet and nutrition",
	"Coaching (leadership, career, academic and wellness)",
	"Life coaching",
	"Obsessive-compulsive disorders",
	"Neuropsychological evaluations & testing (ADHD testing)",
	"Attention and Hyperactivity (ADHD)",
	"Sleep issues",
	"Schizophrenia and psychotic disorders",
	"Learning disorders",
	"Domestic abuse",
];

const firstNames = [
	"John", "Jane", "Michael", "Emily", "David", "Sarah", "James", "Jessica",
	"Robert", "Lisa", "William", "Jennifer", "Richard", "Amanda", "Joseph", "Ashley",
	"Thomas", "Melissa", "Charles", "Michelle", "Christopher", "Kimberly", "Daniel", "Amy",
	"Matthew", "Angela", "Anthony", "Stephanie", "Mark", "Rebecca", "Donald", "Laura",
	"Steven", "Sharon", "Paul", "Cynthia", "Andrew", "Kathleen", "Joshua", "Anna",
	"Kenneth", "Brenda", "Kevin", "Pamela", "Brian", "Nicole", "George", "Emma",
	"Timothy", "Samantha", "Ronald", "Katherine", "Edward", "Christine", "Jason", "Deborah",
	"Jeffrey", "Rachel", "Ryan", "Catherine", "Jacob", "Carolyn", "Gary", "Janet",
	"Nicholas", "Ruth", "Eric", "Maria", "Jonathan", "Heather", "Stephen", "Diane",
	"Larry", "Virginia", "Justin", "Julie", "Scott", "Joyce", "Brandon", "Victoria",
	"Benjamin", "Kelly", "Samuel", "Christina", "Raymond", "Lauren", "Gregory", "Joan",
	"Frank", "Evelyn", "Alexander", "Judith", "Patrick", "Megan", "Jack", "Andrea",
	"Dennis", "Cheryl", "Jerry", "Hannah", "Tyler", "Jacqueline", "Aaron", "Martha",
	"Jose", "Gloria", "Adam", "Teresa", "Nathan", "Ann", "Henry", "Sara",
	"Douglas", "Madison", "Zachary", "Frances", "Peter", "Kathryn", "Kyle", "Janice",
	"Noah", "Jean", "Ethan", "Abigail", "Jeremy", "Alice", "Walter", "Judy"
];

const lastNames = [
	"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
	"Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
	"Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
	"Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
	"Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
	"Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
	"Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
	"Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
	"Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey",
	"Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
	"Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza",
	"Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers",
	"Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell"
];

const cities = [
	"New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
	"San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
	"Fort Worth", "Columbus", "San Francisco", "Charlotte", "Indianapolis", "Seattle",
	"Denver", "Washington", "Boston", "El Paso", "Detroit", "Nashville", "Portland",
	"Memphis", "Oklahoma City", "Las Vegas", "Louisville", "Baltimore", "Milwaukee",
	"Albuquerque", "Tucson", "Fresno", "Mesa", "Sacramento", "Atlanta", "Kansas City",
	"Colorado Springs", "Miami", "Raleigh", "Omaha", "Long Beach", "Virginia Beach",
	"Oakland", "Minneapolis", "Tulsa", "Tampa", "Arlington", "New Orleans"
];

const degrees = ["MD", "PhD", "MSW", "PsyD", "LCSW", "LPC"];

const randomSpecialty = () => {
	const count = Math.floor(Math.random() * 5) + 1; // 1-5 specialties
	const selected = new Set<string>();
	while (selected.size < count) {
		const randomIndex = Math.floor(Math.random() * specialties.length);
		selected.add(specialties[randomIndex]);
	}
	return Array.from(selected);
};

const generatePhoneNumber = () => {
	const areaCode = Math.floor(Math.random() * 900) + 100;
	const prefix = Math.floor(Math.random() * 900) + 100;
	const lineNumber = Math.floor(Math.random() * 9000) + 1000;
	return `${areaCode}${prefix}${lineNumber}`;
};

const generateAdvocates = (count: number) => {
	const advocateData = [];
	for (let i = 0; i < count; i++) {
		advocateData.push({
			firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
			lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
			city: cities[Math.floor(Math.random() * cities.length)],
			degree: degrees[Math.floor(Math.random() * degrees.length)],
			specialties: randomSpecialty(),
			yearsOfExperience: Math.floor(Math.random() * 30) + 1, // 1-30 years
			phoneNumber: generatePhoneNumber(),
		});
	}
	return advocateData;
};

const seedDatabase = async () => {
	try {
		console.log("Generating 500 advocates...");
		const advocateData = generateAdvocates(500);

		console.log("Inserting into database...");
		await db.insert(advocates).values(advocateData);

		console.log("Successfully seeded 500 advocates!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};

seedDatabase();

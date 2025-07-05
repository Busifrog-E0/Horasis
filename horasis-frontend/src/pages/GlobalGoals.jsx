import React, { useState, useEffect, useMemo } from 'react';
import WorldMap from '../components/Map/WorldMap';
import EventPanel from '../components/Map/EventPanel';



const eventsData = [
	{
		"id": "1",
		"title": "Global Tech Summit 2025",
		"location": "San Francisco",
		"zone": "north-america",
		"date": "2025-03-15",
		"type": "Technology",
		"goals": [
			"Explore emerging trends in artificial intelligence and machine learning",
			"Foster collaboration between startups, corporations, and academia",
			"Promote ethical development of blockchain and digital technologies",
			"Highlight innovations driving digital transformation across industries"
		],
		"challenges": [
			"Addressing ethical concerns in AI deployment",
			"Bridging the digital divide globally",
			"Ensuring cybersecurity in an interconnected world",
			"Navigating regulatory uncertainty around blockchain and data privacy"
		],
		"description": "Annual gathering of tech leaders discussing AI, blockchain, and future innovations.",
		"attendees": 15000,
		"country": {
			"markerOffset": -25,
			"name": "United States",
			"coordinates": [
				-95.712891,
				37.09024
			]
		}
	},
	{
		"id": "2",
		"title": "Amazon Conservation Conference",
		"location": "Manaus",
		"zone": "south-america",
		"date": "2025-04-22",
		"type": "Environment",
		"description": "International conference on rainforest preservation and sustainable development.",
		"attendees": 3500,
		"goals": [
			"Promote sustainable practices in Amazon communities",
			"Enhance international cooperation for rainforest preservation",
			"Increase funding for conservation projects",
			"Share scientific research and data on Amazon biodiversity"
		],
		"challenges": [
			"Illegal logging and mining activities",
			"Lack of enforcement of environmental regulations",
			"Climate change impacts on rainforest ecosystems",
			"Balancing economic development with ecological preservation"
		],
		"country": {
			"markerOffset": -25,
			"name": "Brazil",
			"coordinates": [
				-51.9253,
				-14.2350
			]
		}
	},
	{
		"id": "3",
		"title": "European Innovation Forum",
		"location": "Berlin",
		"zone": "europe",
		"date": "2025-05-10",
		"type": "Innovation",
		"description": "Showcase of groundbreaking technologies and policy dialogue across the EU.",
		"attendees": 8000,
		"goals": [
			"Encourage cross-border startup collaborations",
			"Support tech infrastructure development in rural Europe",
			"Create policy frameworks for green innovation",
			"Connect academic research with real-world innovation"
		],
		"challenges": [
			"Varying innovation policies across member states",
			"Limited funding for early-stage deep-tech startups",
			"Data protection and digital sovereignty",
			"Retention of talent in competitive global markets"
		],
		"country": {
			"markerOffset": -25,
			"name": "Germany",
			"coordinates": [10.4515, 51.1657]
		}
	},

	// Event 4
	{
		"id": "4",
		"title": "Asia-Pacific Climate Forum",
		"location": "Jakarta",
		"zone": "asia-pacific",
		"date": "2025-06-08",
		"type": "Climate",
		"description": "Regional collaboration platform for addressing climate change and resilience strategies.",
		"attendees": 5000,
		"goals": [
			"Formulate unified action plans for rising sea levels",
			"Promote nature-based climate solutions",
			"Accelerate renewable energy adoption in the region",
			"Facilitate knowledge-sharing on disaster resilience"
		],
		"challenges": [
			"Displacement due to extreme weather events",
			"Dependency on coal and fossil fuels",
			"Limited resources for climate adaptation",
			"Complexity in regional cooperation and policy alignment"
		],
		"country": {
			"markerOffset": -25,
			"name": "Indonesia",
			"coordinates": [113.9213, -0.7893]
		}
	},

	// Event 5
	{
		"id": "5",
		"title": "Middle East Energy Expo",
		"location": "Dubai",
		"zone": "middle-east-africa",
		"date": "2025-09-14",
		"type": "Energy",
		"description": "Trade fair and summit on sustainable energy innovations and investments.",
		"attendees": 10000,
		"goals": [
			"Drive investment in solar and wind projects",
			"Promote hydrogen as a clean energy source",
			"Strengthen public-private partnerships",
			"Explore carbon capture technologies"
		],
		"challenges": [
			"Managing transition from oil-based economy",
			"Overcoming regulatory hurdles for clean energy projects",
			"Ensuring grid stability with renewable integration",
			"Public skepticism and lack of awareness"
		],
		"country": {
			"markerOffset": -25,
			"name": "United Arab Emirates",
			"coordinates": [53.8478, 23.4241]
		}
	},

	// Event 6
	{
		"id": "6",
		"title": "African Youth Innovation Summit",
		"location": "Nairobi",
		"zone": "middle-east-africa",
		"date": "2025-08-01",
		"type": "Youth & Innovation",
		"description": "Empowering the next generation of African entrepreneurs and innovators.",
		"attendees": 7000,
		"goals": [
			"Provide mentorship and funding for youth-led startups",
			"Strengthen STEM education across the continent",
			"Showcase grassroots innovations solving local problems",
			"Encourage inclusion of women and marginalized groups"
		],
		"challenges": [
			"High youth unemployment rates",
			"Lack of access to funding and internet connectivity",
			"Brain drain to Western nations",
			"Inadequate infrastructure for innovation hubs"
		],
		"country": {
			"markerOffset": -25,
			"name": "Kenya",
			"coordinates": [37.9062, -0.0236]
		}
	},
	{
		"id": "7",
		"title": "Global Health Equity Conference",
		"location": "Geneva",
		"zone": "europe",
		"date": "2025-11-05",
		"type": "Healthcare",
		"description": "A conference focused on reducing global health disparities through policy and innovation.",
		"attendees": 6000,
		"goals": [
			"Advance equitable access to healthcare services",
			"Support digital health transformation in low-income regions",
			"Facilitate international vaccine distribution frameworks",
			"Encourage mental health awareness and support"
		],
		"challenges": [
			"Uneven healthcare infrastructure",
			"Vaccine hesitancy and misinformation",
			"Shortage of skilled healthcare workers",
			"Cross-border collaboration on disease surveillance"
		],
		"country": {
			"markerOffset": -25,
			"name": "Switzerland",
			"coordinates": [8.2275, 46.8182]
		}
	},
	{
		"id": "8",
		"title": "AI in Education Symposium",
		"location": "Singapore",
		"zone": "asia-pacific",
		"date": "2025-10-12",
		"type": "Education",
		"description": "Forum on integrating AI into education for personalized learning and administrative efficiency.",
		"attendees": 4000,
		"goals": [
			"Promote ethical use of AI in classrooms",
			"Improve accessibility to education through EdTech",
			"Enable adaptive learning for diverse student needs",
			"Discuss policies on student data privacy"
		],
		"challenges": [
			"Over-reliance on technology in classrooms",
			"Bias in AI algorithms affecting students",
			"Teacher training and acceptance of AI tools",
			"Digital infrastructure in rural areas"
		],
		"country": {
			"markerOffset": -25,
			"name": "Singapore",
			"coordinates": [103.8198, 1.3521]
		}
	},
	{
		"id": "9",
		"title": "Arctic Sustainability Summit",
		"location": "Reykjavík",
		"zone": "europe",
		"date": "2025-07-18",
		"type": "Environment",
		"description": "International summit addressing the environmental and geopolitical challenges of the Arctic.",
		"attendees": 3000,
		"goals": [
			"Discuss melting ice impacts on global climate",
			"Protect indigenous communities and biodiversity",
			"Promote scientific cooperation in Arctic research",
			"Create responsible shipping and resource extraction guidelines"
		],
		"challenges": [
			"Rising geopolitical tensions in the Arctic",
			"Rapid ecosystem changes and species loss",
			"Limited access and harsh conditions for research",
			"Balancing economic interests with preservation"
		],
		"country": {
			"markerOffset": -25,
			"name": "Iceland",
			"coordinates": [-19.0208, 64.9631]
		}
	},
	{
		"id": "10",
		"title": "Global Food Innovation Expo",
		"location": "Cape Town",
		"zone": "middle-east-africa",
		"date": "2025-12-02",
		"type": "Agriculture",
		"description": "Expo showcasing food tech, sustainable farming, and future nutrition solutions.",
		"attendees": 4500,
		"goals": [
			"Advance agri-tech solutions in developing nations",
			"Promote vertical farming and urban agriculture",
			"Support startups solving food insecurity",
			"Encourage reduction of food waste in supply chains"
		],
		"challenges": [
			"Climate change affecting crop yields",
			"Lack of access to modern farming tools",
			"Food distribution and logistics inefficiencies",
			"Consumer acceptance of alternative proteins"
		],
		"country": {
			"markerOffset": -25,
			"name": "South Africa",
			"coordinates": [22.9375, -30.5595]
		}
	},
	{
		"id": "11",
		"title": "Fintech Future Conference",
		"location": "Toronto",
		"zone": "north-america",
		"date": "2025-10-20",
		"type": "Finance",
		"description": "Exploring the future of decentralized finance, digital currencies, and fintech regulation.",
		"attendees": 9000,
		"goals": [
			"Discuss global trends in DeFi and crypto adoption",
			"Facilitate dialogue between fintech startups and regulators",
			"Promote financial inclusion through digital banking",
			"Showcase innovations in cross-border payments"
		],
		"challenges": [
			"Regulatory uncertainty in fintech sector",
			"Security vulnerabilities in blockchain systems",
			"Digital identity and KYC challenges",
			"Financial literacy in digital-native platforms"
		],
		"country": {
			"markerOffset": -25,
			"name": "Canada",
			"coordinates": [-106.3468, 56.1304]
		}
	}
]

const zonesData = [
	{
		"id": "north-america",
		"name": "North America",
		"head": {
			"id": "head1",
			"name": "Kate Williams",
			"description": "Annual gathering of tech leaders discussing AI, blockchain, and future innovations.",
			"imageUrl": "https://cdn.pixabay.com/photo/2024/11/10/12/33/woman-9187737_640.jpg"
		},
		"countries": [
			"USA",
			"CAN",
			"MEX",
			"GTM",
			"BLZ",
			"CRI",
			"SLV",
			"HND",
			"NIC",
			"PAN",
			"CUB",
			"HTI",
			"DOM",
			"JAM",
			"PRI",
			"TTO",
			"BRB",
			"ATG",
			"LCA",
			"VCT",
			"GRD",
			"DMA",
			"KNA",
			"BHS",
			"GRL"
		],
		"color": "#6366F1",
		"description": "Technology and innovation hub with major economic centers"
	},
	{
		"id": "south-america",
		"name": "South America",
		"head": {
			"id": "head2",
			"name": "Korrey Nain",
			"description": "Annual gathering of tech leaders discussing AI, blockchain, and future innovations.",
			"imageUrl": "https://cdn.pixabay.com/photo/2024/11/10/12/33/woman-9187752_640.jpg"
		},
		"countries": [
			"ARG",
			"BOL",
			"BRA",
			"CHL",
			"COL",
			"ECU",
			"GUY",
			"PRY",
			"PER",
			"SUR",
			"URY",
			"VEN",
			"GUF"
		],
		"color": "#10B981",
		"description": "Resource-rich region with emerging markets and biodiversity"
	},
	{
		"id": "europe",
		"name": "Europe",
		"head": {
			"id": "head3",
			"name": "Brad Joseph",
			"description": "Annual gathering of tech leaders discussing AI, blockchain, and future innovations.",
			"imageUrl": "https://cdn.pixabay.com/photo/2024/11/10/12/33/businessman-9187782_640.jpg"
		},
		"countries": [
			"ALB",
			"AND",
			"AUT",
			"BEL",
			"BIH",
			"BGR",
			"BLR",
			"CHE",
			"CYP",
			"CZE",
			"DEU",
			"DNK",
			"ESP",
			"EST",
			"FIN",
			"FRA",
			"GBR",
			"GRC",
			"HRV",
			"HUN",
			"IRL",
			"ISL",
			"ITA",
			"LIE",
			"LTU",
			"LUX",
			"LVA",
			"MCO",
			"MDA",
			"MKD",
			"MLT",
			"MNE",
			"NLD",
			"NOR",
			"POL",
			"PRT",
			"ROU",
			"RUS",
			"SMR",
			"SRB",
			"SVK",
			"SVN",
			"SWE",
			"UKR",
			"XXK"
		],
		"color": "#A855F7",
		"description": "Historical and cultural center with strong economic integration"
	},
	{
		"id": "asia-pacific",
		"name": "Asia Pacific",
		"head": {
			"id": "head4",
			"name": "Travis Head",
			"description": "Annual gathering of tech leaders discussing AI, blockchain, and future innovations.",
			"imageUrl": "https://example.com/head-asia.jpg"
		},
		"countries": [
			"AFG",
			"ARM",
			"AZE",
			"BGD",
			"BRN",
			"BTN",
			"CHN",
			"GEO",
			"IDN",
			"IND",
			"IRN",
			"JPN",
			"KAZ",
			"KGZ",
			"KHM",
			"KOR",
			"LAO",
			"LKA",
			"MMR",
			"MNG",
			"MYS",
			"NPL",
			"PAK",
			"PHL",
			"PRK",
			"SGP",
			"THA",
			"TJK",
			"TKM",
			"TLS",
			"TWN",
			"UZB",
			"VNM",
			"PSX"
		],
		"color": "#f59e0b",
		"description": "Economic powerhouse with rapid technological advancement"
	},
	{
		"id": "middle-east-africa",
		"name": "Middle East & Africa",
		"head": {
			"id": "head5",
			"name": "Middle East & Africa Head",
			"description": "Annual gathering of tech leaders discussing AI, blockchain, and future innovations.",
			"imageUrl": "https://cdn.pixabay.com/photo/2022/01/20/17/51/office-desk-6952919_640.jpg"
		},
		"countries": [
			"DZA",
			"AGO",
			"BEN",
			"BFA",
			"BDI",
			"BWA",
			"CAF",
			"CIV",
			"CMR",
			"COD",
			"COG",
			"COM",
			"CPV",
			"DJI",
			"EGY",
			"ERI",
			"ETH",
			"GAB",
			"GHA",
			"GIN",
			"GMB",
			"GNB",
			"GNQ",
			"KEN",
			"LBR",
			"LBY",
			"LSO",
			"MAR",
			"MDG",
			"MDV",
			"MLI",
			"MOZ",
			"MRT",
			"MUS",
			"MWI",
			"NAM",
			"NER",
			"NGA",
			"RWA",
			"SDN",
			"SEN",
			"SLE",
			"SOM",
			"SSD",
			"STP",
			"SWZ",
			"SYC",
			"TCD",
			"TGO",
			"TUN",
			"TZA",
			"UGA",
			"ZAF",
			"ZMB",
			"ZWE",
			"ESH",
			"ARE",
			"BHR",
			"IRQ",
			"ISR",
			"JOR",
			"KWT",
			"LBN",
			"OMN",
			"QAT",
			"SAU",
			"SYR",
			"TUR",
			"YEM"
		],
		"color": "#F43F5E",
		"description": "Energy-rich region with diverse cultures and growing economies"
	},
	{
		"id": "oceania",
		"name": "Oceania",
		"head": {
			"id": "head6",
			"name": "Oceania Head",
			"description": "Annual gathering of tech leaders discussing AI, blockchain, and future innovations.",
			"imageUrl": "https://cdn.pixabay.com/photo/2023/04/28/07/16/man-7956041_640.jpg"
		},
		"countries": [
			"ATF",
			"AUS",
			"FJI",
			"FSM",
			"KIR",
			"MHL",
			"NRU",
			"NZL",
			"PLW",
			"PNG",
			"SLB",
			"TON",
			"TUV",
			"VUT",
			"WSM",
			"NCL"
		],
		"color": "#0EA5E9",
		"description": "Island nations with vibrant cultures and ecosystems"
	}
]


function GlobalGoals() {
	const [selectedZone, setSelectedZone] = useState(null);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [data, setData] = useState({ zones: [], events: [] });

	useEffect(() => {
		setData({ zones: zonesData, events: eventsData });
	}, []);

	const filteredEvents = useMemo(() => {
		let events = data.events;
		return events;
	}, [data.events]);

	const handleZoneSelect = (zoneId) => {
		setSelectedZone(zoneId);
		setSelectedEvent(null);
	};

	const handleEventSelect = (event) => {
		setSelectedEvent(event);
	};

	return (
		<div className="bg-white">

			<main className="max-w-7xl mx-auto px-3 py-3">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
					<div className="lg:col-span-2 h-full">
						<WorldMap
							zones={data.zones}
							events={filteredEvents}
							selectedZone={selectedZone}
							selectedEvent={selectedEvent}
							onZoneSelect={handleZoneSelect}
							onEventSelect={handleEventSelect}
						/>
					</div>
					<div className="h-full">
						<EventPanel
							events={filteredEvents}
							selectedZone={selectedZone}
							selectedEvent={selectedEvent}
							zones={data.zones}
							onEventSelect={handleEventSelect}
							onZoneSelect={handleZoneSelect}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}


export default GlobalGoals

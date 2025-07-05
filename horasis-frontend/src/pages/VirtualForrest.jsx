import React, { useState, useEffect } from 'react';
import ChoroplethChart from '../components/Map/ChoroplethChart';
import TreePanel from '../components/Map/TreePanel';


const treesData = [
	{
		"no": "20",
		"ISO3": "AGO",
		"name": "Angola",
		"zone": "middle-east-africa"
	},
	{
		"no": "68",
		"ISO3": "ATG",
		"name": "Antigua and Barbuda",
		"zone": "north-america"
	},
	{
		"no": "86",
		"ISO3": "ARG",
		"name": "Argentina",
		"zone": "south-america"
	},
	{
		"no": "3476",
		"ISO3": "ARM",
		"name": "Armenia",
		"zone": "middle-east-africa"
	},
	{
		"no": "26701",
		"ISO3": "AUS",
		"name": "Australia",
		"zone": "asia-pacific"
	},
	{
		"no": "90693",
		"ISO3": "AUT",
		"name": "Austria",
		"zone": "europe"
	},
	{
		"no": "76337",
		"ISO3": "AZE",
		"name": "Azerbaijan",
		"zone": "middle-east-africa"
	},
	{
		"no": "8166",
		"ISO3": "BHS",
		"name": "Bahamas",
		"zone": "north-america"
	},
	{
		"no": "556",
		"ISO3": "BHR",
		"name": "Bahrain",
		"zone": "middle-east-africa"
	},
	{
		"no": "6984",
		"ISO3": "BGD",
		"name": "Bangladesh",
		"zone": "russia-central-asia"
	},
	{
		"no": "354",
		"ISO3": "BRB",
		"name": "Barbados",
		"zone": "north-america"
	},
	{
		"no": "72901",
		"ISO3": "BLR",
		"name": "Belarus",
		"zone": "europe"
	},
	{
		"no": "62455",
		"ISO3": "BEL",
		"name": "Belgium",
		"zone": "europe"
	},
	{
		"no": "1458",
		"ISO3": "BLZ",
		"name": "Belize",
		"zone": "north-america"
	},
	{
		"no": "7639",
		"ISO3": "BEN",
		"name": "Benin",
		"zone": "middle-east-africa"
	},
	{
		"no": "9051",
		"ISO3": "BTN",
		"name": "Bhutan",
		"zone": "russia-central-asia"
	},
	{
		"no": "48101",
		"ISO3": "BOL",
		"name": "Bolivia",
		"zone": "south-america"
	},
	{
		"no": "49230",
		"ISO3": "BIH",
		"name": "Bosnia and Herzegovina",
		"zone": "europe"
	},
	{
		"no": "12540",
		"ISO3": "BWA",
		"name": "Botswana",
		"zone": "middle-east-africa"
	},
	{
		"no": "88121",
		"ISO3": "BRA",
		"name": "Brazil",
		"zone": "south-america"
	},
	{
		"no": "5489",
		"ISO3": "BRN",
		"name": "Brunei",
		"zone": "asia-pacific"
	},
	{
		"no": "21456",
		"ISO3": "BGR",
		"name": "Bulgaria",
		"zone": "europe"
	},
	{
		"no": "31565",
		"ISO3": "BFA",
		"name": "Burkina Faso",
		"zone": "middle-east-africa"
	},
	{
		"no": "14006",
		"ISO3": "BDI",
		"name": "Burundi",
		"zone": "middle-east-africa"
	},
	{
		"no": "9348",
		"ISO3": "KHM",
		"name": "Cambodia",
		"zone": "asia-pacific"
	},
	{
		"no": "23890",
		"ISO3": "CMR",
		"name": "Cameroon",
		"zone": "middle-east-africa"
	},
	{
		"no": "167890",
		"ISO3": "CAN",
		"name": "Canada",
		"zone": "north-america"
	},
	{
		"no": "7891",
		"ISO3": "CPV",
		"name": "Cape Verde",
		"zone": "middle-east-africa"
	},
	{
		"no": "52981",
		"ISO3": "CAF",
		"name": "Central African Republic",
		"zone": "middle-east-africa"
	},
	{
		"no": "30879",
		"ISO3": "TCD",
		"name": "Chad",
		"zone": "middle-east-africa"
	},
	{
		"no": "71802",
		"ISO3": "CHL",
		"name": "Chile",
		"zone": "south-america"
	},
	{
		"no": "132455",
		"ISO3": "CHN",
		"name": "China",
		"zone": "asia-pacific"
	},
	{
		"no": "3241",
		"ISO3": "COL",
		"name": "Colombia",
		"zone": "south-america"
	},
	{
		"no": "5922",
		"ISO3": "COM",
		"name": "Comoros",
		"zone": "middle-east-africa"
	},
	{
		"no": "11035",
		"ISO3": "COG",
		"name": "Congo (Brazzaville)",
		"zone": "middle-east-africa"
	},
	{
		"no": "34289",
		"ISO3": "COD",
		"name": "Congo (Kinshasa)",
		"zone": "middle-east-africa"
	},
	{
		"no": "6583",
		"ISO3": "CRI",
		"name": "Costa Rica",
		"zone": "north-america"
	},
	{
		"no": "10843",
		"ISO3": "HRV",
		"name": "Croatia",
		"zone": "europe"
	},
	{
		"no": "2849",
		"ISO3": "CUB",
		"name": "Cuba",
		"zone": "north-america"
	},
	{
		"no": "12746",
		"ISO3": "CYP",
		"name": "Cyprus",
		"zone": "europe"
	},
	{
		"no": "56910",
		"ISO3": "CZE",
		"name": "Czech Republic",
		"zone": "europe"
	},
	{
		"no": "84628",
		"ISO3": "DNK",
		"name": "Denmark",
		"zone": "europe"
	},
	{
		"no": "44109",
		"ISO3": "DJI",
		"name": "Djibouti",
		"zone": "middle-east-africa"
	},
	{
		"no": "59929",
		"ISO3": "DMA",
		"name": "Dominica",
		"zone": "north-america"
	},
	{
		"no": "95861",
		"ISO3": "DOM",
		"name": "Dominican Republic",
		"zone": "north-america"
	},
	{
		"no": "47917",
		"ISO3": "ECU",
		"name": "Ecuador",
		"zone": "south-america"
	},
	{
		"no": "7271",
		"ISO3": "EGY",
		"name": "Egypt",
		"zone": "middle-east-africa"
	},
	{
		"no": "43508",
		"ISO3": "SLV",
		"name": "El Salvador",
		"zone": "north-america"
	},
	{
		"no": "75546",
		"ISO3": "GNQ",
		"name": "Equatorial Guinea",
		"zone": "middle-east-africa"
	},
	{
		"no": "32129",
		"ISO3": "ERI",
		"name": "Eritrea",
		"zone": "middle-east-africa"
	},
	{
		"no": "80743",
		"ISO3": "EST",
		"name": "Estonia",
		"zone": "europe"
	},
	{
		"no": "63950",
		"ISO3": "SWZ",
		"name": "Eswatini",
		"zone": "middle-east-africa"
	},
	{
		"no": "3408",
		"ISO3": "ETH",
		"name": "Ethiopia",
		"zone": "middle-east-africa"
	},
	{
		"no": "93787",
		"ISO3": "FJI",
		"name": "Fiji",
		"zone": "asia-pacific"
	},
	{
		"no": "61888",
		"ISO3": "FIN",
		"name": "Finland",
		"zone": "europe"
	},
	{
		"no": "56571",
		"ISO3": "FRA",
		"name": "France",
		"zone": "europe"
	},
	{
		"no": "39651",
		"ISO3": "GAB",
		"name": "Gabon",
		"zone": "middle-east-africa"
	},
	{
		"no": "99369",
		"ISO3": "GMB",
		"name": "Gambia",
		"zone": "middle-east-africa"
	},
	{
		"no": "95357",
		"ISO3": "GEO",
		"name": "Georgia",
		"zone": "middle-east-africa"
	},
	{
		"no": "99085",
		"ISO3": "DEU",
		"name": "Germany",
		"zone": "europe"
	},
	{
		"no": "19626",
		"ISO3": "GHA",
		"name": "Ghana",
		"zone": "middle-east-africa"
	},
	{
		"no": "23152",
		"ISO3": "GRC",
		"name": "Greece",
		"zone": "europe"
	},
	{
		"no": "75326",
		"ISO3": "GRD",
		"name": "Grenada",
		"zone": "north-america"
	},
	{
		"no": "52404",
		"ISO3": "GTM",
		"name": "Guatemala",
		"zone": "north-america"
	},
	{
		"no": "41932",
		"ISO3": "GIN",
		"name": "Guinea",
		"zone": "middle-east-africa"
	},
	{
		"no": "75943",
		"ISO3": "GNB",
		"name": "Guinea-Bissau",
		"zone": "middle-east-africa"
	},
	{
		"no": "51035",
		"ISO3": "GUY",
		"name": "Guyana",
		"zone": "south-america"
	},
	{
		"no": "97842",
		"ISO3": "HTI",
		"name": "Haiti",
		"zone": "north-america"
	},
	{
		"no": "40195",
		"ISO3": "HND",
		"name": "Honduras",
		"zone": "north-america"
	},
	{
		"no": "80528",
		"ISO3": "HUN",
		"name": "Hungary",
		"zone": "europe"
	},
	{
		"no": "98669",
		"ISO3": "ISL",
		"name": "Iceland",
		"zone": "europe"
	},
	{
		"no": "82066",
		"ISO3": "IND",
		"name": "India",
		"zone": "asia-pacific"
	},
	{
		"no": "99805",
		"ISO3": "IDN",
		"name": "Indonesia",
		"zone": "asia-pacific"
	},
	{
		"no": "49251",
		"ISO3": "IRN",
		"name": "Iran",
		"zone": "middle-east-africa"
	},
	{
		"no": "71111",
		"ISO3": "IRQ",
		"name": "Iraq",
		"zone": "middle-east-africa"
	},
	{
		"no": "53538",
		"ISO3": "IRL",
		"name": "Ireland",
		"zone": "europe"
	},
	{
		"no": "85720",
		"ISO3": "ISR",
		"name": "Israel",
		"zone": "middle-east-africa"
	},
	{
		"no": "29564",
		"ISO3": "ITA",
		"name": "Italy",
		"zone": "europe"
	},
	{
		"no": "32278",
		"ISO3": "JAM",
		"name": "Jamaica",
		"zone": "north-america"
	},
	{
		"no": "48216",
		"ISO3": "JPN",
		"name": "Japan",
		"zone": "asia-pacific"
	},
	{
		"no": "25284",
		"ISO3": "JOR",
		"name": "Jordan",
		"zone": "middle-east-africa"
	},
	{
		"no": "70004",
		"ISO3": "KAZ",
		"name": "Kazakhstan",
		"zone": "russia-central-asia"
	},
	{
		"no": "68597",
		"ISO3": "KEN",
		"name": "Kenya",
		"zone": "middle-east-africa"
	},
	{
		"no": "51966",
		"ISO3": "KIR",
		"name": "Kiribati",
		"zone": "asia-pacific"
	},
	{
		"no": "69440",
		"ISO3": "KWT",
		"name": "Kuwait",
		"zone": "middle-east-africa"
	},
	{
		"no": "43828",
		"ISO3": "KGZ",
		"name": "Kyrgyzstan",
		"zone": "russia-central-asia"
	},
	{
		"no": "3149",
		"ISO3": "LAO",
		"name": "Laos",
		"zone": "asia-pacific"
	},
	{
		"no": "29695",
		"ISO3": "LVA",
		"name": "Latvia",
		"zone": "europe"
	},
	{
		"no": "51997",
		"ISO3": "LBN",
		"name": "Lebanon",
		"zone": "middle-east-africa"
	},
	{
		"no": "28327",
		"ISO3": "LSO",
		"name": "Lesotho",
		"zone": "middle-east-africa"
	},
	{
		"no": "10789",
		"ISO3": "LBR",
		"name": "Liberia",
		"zone": "middle-east-africa"
	},
	{
		"no": "49151",
		"ISO3": "LBY",
		"name": "Libya",
		"zone": "middle-east-africa"
	},
	{
		"no": "56275",
		"ISO3": "LIE",
		"name": "Liechtenstein",
		"zone": "europe"
	},
	{
		"no": "95845",
		"ISO3": "LTU",
		"name": "Lithuania",
		"zone": "europe"
	},
	{
		"no": "43073",
		"ISO3": "LUX",
		"name": "Luxembourg",
		"zone": "europe"
	},
	{
		"no": "51240",
		"ISO3": "MDG",
		"name": "Madagascar",
		"zone": "middle-east-africa"
	},
	{
		"no": "42728",
		"ISO3": "MWI",
		"name": "Malawi",
		"zone": "middle-east-africa"
	},
	{
		"no": "65377",
		"ISO3": "MYS",
		"name": "Malaysia",
		"zone": "asia-pacific"
	},
	{
		"no": "3354",
		"ISO3": "MDV",
		"name": "Maldives",
		"zone": "russia-central-asia"
	},
	{
		"no": "55765",
		"ISO3": "MLI",
		"name": "Mali",
		"zone": "middle-east-africa"
	},
	{
		"no": "84957",
		"ISO3": "MLT",
		"name": "Malta",
		"zone": "europe"
	},
	{
		"no": "92675",
		"ISO3": "MHL",
		"name": "Marshall Islands",
		"zone": "asia-pacific"
	},
	{
		"no": "29446",
		"ISO3": "MRT",
		"name": "Mauritania",
		"zone": "middle-east-africa"
	},
	{
		"no": "1889",
		"ISO3": "MUS",
		"name": "Mauritius",
		"zone": "middle-east-africa"
	},
	{
		"no": "2171",
		"ISO3": "MEX",
		"name": "Mexico",
		"zone": "north-america"
	},
	{
		"no": "54011",
		"ISO3": "MDA",
		"name": "Moldova",
		"zone": "europe"
	},
	{
		"no": "45425",
		"ISO3": "MCO",
		"name": "Monaco",
		"zone": "europe"
	},
	{
		"no": "89408",
		"ISO3": "MNG",
		"name": "Mongolia",
		"zone": "russia-central-asia"
	},
	{
		"no": "68704",
		"ISO3": "MNE",
		"name": "Montenegro",
		"zone": "europe"
	},
	{
		"no": "83978",
		"ISO3": "MAR",
		"name": "Morocco",
		"zone": "middle-east-africa"
	},
	{
		"no": "59979",
		"ISO3": "MOZ",
		"name": "Mozambique",
		"zone": "middle-east-africa"
	},
	{
		"no": "67874",
		"ISO3": "MMR",
		"name": "Myanmar",
		"zone": "asia-pacific"
	},
	{
		"no": "48996",
		"ISO3": "NAM",
		"name": "Namibia",
		"zone": "middle-east-africa"
	},
	{
		"no": "69956",
		"ISO3": "NRU",
		"name": "Nauru",
		"zone": "asia-pacific"
	},
	{
		"no": "95588",
		"ISO3": "NPL",
		"name": "Nepal",
		"zone": "russia-central-asia"
	},
	{
		"no": "55424",
		"ISO3": "NLD",
		"name": "Netherlands",
		"zone": "europe"
	},
	{
		"no": "14027",
		"ISO3": "NZL",
		"name": "New Zealand",
		"zone": "asia-pacific"
	},
	{
		"no": "41279",
		"ISO3": "NIC",
		"name": "Nicaragua",
		"zone": "north-america"
	},
	{
		"no": "30007",
		"ISO3": "NER",
		"name": "Niger",
		"zone": "middle-east-africa"
	},
	{
		"no": "42570",
		"ISO3": "NGA",
		"name": "Nigeria",
		"zone": "middle-east-africa"
	},
	{
		"no": "47633",
		"ISO3": "PRK",
		"name": "North Korea",
		"zone": "asia-pacific"
	},
	{
		"no": "14526",
		"ISO3": "MKD",
		"name": "North Macedonia",
		"zone": "europe"
	},
	{
		"no": "94713",
		"ISO3": "NOR",
		"name": "Norway",
		"zone": "europe"
	},
	{
		"no": "51383",
		"ISO3": "OMN",
		"name": "Oman",
		"zone": "middle-east-africa"
	},
	{
		"no": "31375",
		"ISO3": "PAK",
		"name": "Pakistan",
		"zone": "russia-central-asia"
	},
	{
		"no": "93537",
		"ISO3": "PLW",
		"name": "Palau",
		"zone": "asia-pacific"
	},
	{
		"no": "79893",
		"ISO3": "PAN",
		"name": "Panama",
		"zone": "north-america"
	},
	{
		"no": "12901",
		"ISO3": "PNG",
		"name": "Papua New Guinea",
		"zone": "asia-pacific"
	},
	{
		"no": "87826",
		"ISO3": "PRY",
		"name": "Paraguay",
		"zone": "south-america"
	},
	{
		"no": "85284",
		"ISO3": "PER",
		"name": "Peru",
		"zone": "south-america"
	},
	{
		"no": "58611",
		"ISO3": "PHL",
		"name": "Philippines",
		"zone": "asia-pacific"
	},
	{
		"no": "58878",
		"ISO3": "POL",
		"name": "Poland",
		"zone": "europe"
	},
	{
		"no": "60039",
		"ISO3": "PRT",
		"name": "Portugal",
		"zone": "europe"
	},
	{
		"no": "37696",
		"ISO3": "QAT",
		"name": "Qatar",
		"zone": "middle-east-africa"
	},
	{
		"no": "60508",
		"ISO3": "ROU",
		"name": "Romania",
		"zone": "europe"
	},
	{
		"no": "19740",
		"ISO3": "RUS",
		"name": "Russia",
		"zone": "russia-central-asia"
	},
	{
		"no": "84928",
		"ISO3": "RWA",
		"name": "Rwanda",
		"zone": "middle-east-africa"
	},
	{
		"no": "10496",
		"ISO3": "KNA",
		"name": "Saint Kitts and Nevis",
		"zone": "north-america"
	},
	{
		"no": "41553",
		"ISO3": "LCA",
		"name": "Saint Lucia",
		"zone": "north-america"
	},
	{
		"no": "22586",
		"ISO3": "VCT",
		"name": "Saint Vincent and the Grenadines",
		"zone": "north-america"
	},
	{
		"no": "82413",
		"ISO3": "WSM",
		"name": "Samoa",
		"zone": "asia-pacific"
	},
	{
		"no": "86242",
		"ISO3": "SMR",
		"name": "San Marino",
		"zone": "europe"
	},
	{
		"no": "50198",
		"ISO3": "STP",
		"name": "Sao Tome and Principe",
		"zone": "middle-east-africa"
	},
	{
		"no": "79397",
		"ISO3": "SAU",
		"name": "Saudi Arabia",
		"zone": "middle-east-africa"
	},
	{
		"no": "55547",
		"ISO3": "SEN",
		"name": "Senegal",
		"zone": "middle-east-africa"
	},
	{
		"no": "28825",
		"ISO3": "SRB",
		"name": "Serbia",
		"zone": "europe"
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


function VirtualForrest() {
	const [selectedTree, setSelectedTree] = useState(null);
	const [selectedZone, setSelectedZone] = useState(null);
	const [data, setData] = useState({ zones: [], trees: [] });

	useEffect(() => {
		setData({ zones: zonesData, trees: treesData });
	}, []);

	const handleZoneSelect = (zoneId) => {
		setSelectedZone(zoneId);
		setSelectedTree(null);
	};


	const handleTreeSelect = (tree) => {
		setSelectedTree(tree);
	};

	return (
		<div className="bg-white">

			<main className="max-w-7xl mx-auto px-3 py-3">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
					<div className="lg:col-span-2 h-full">
						<ChoroplethChart
							zones={data.zones}
							trees={data.trees}
							selectedZone={selectedZone}
							selectedTree={selectedTree}
							onZoneSelect={handleZoneSelect}
							onTreeSelect={handleTreeSelect}
						/>
					</div>
					<div className="h-full">
						<TreePanel
							trees={data.trees}
							selectedZone={selectedZone}
							selectedTree={selectedTree}
							zones={data.zones}
							onTreeSelect={handleTreeSelect}
							onZoneSelect={handleZoneSelect}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}


export default VirtualForrest

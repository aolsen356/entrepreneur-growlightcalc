/**
 * Grow Light Calculator
 * Calculates DLI, wattage requirements, costs, and provides recommendations
 */

// Plant DLI requirements (mol/m2/day)
const plantDLI = {
    leafy: {
        seedling: { min: 8, target: 12, max: 15 },
        vegetative: { min: 12, target: 17, max: 22 },
        flowering: { min: 15, target: 20, max: 25 }
    },
    fruiting: {
        seedling: { min: 10, target: 15, max: 18 },
        vegetative: { min: 20, target: 30, max: 40 },
        flowering: { min: 30, target: 40, max: 50 }
    },
    flowering: {
        seedling: { min: 10, target: 15, max: 20 },
        vegetative: { min: 25, target: 35, max: 45 },
        flowering: { min: 40, target: 55, max: 65 }
    },
    seedlings: {
        seedling: { min: 6, target: 10, max: 15 },
        vegetative: { min: 10, target: 15, max: 20 },
        flowering: { min: 15, target: 20, max: 25 }
    },
    houseplants: {
        seedling: { min: 4, target: 6, max: 10 },
        vegetative: { min: 6, target: 10, max: 15 },
        flowering: { min: 10, target: 15, max: 20 }
    },
    succulents: {
        seedling: { min: 8, target: 12, max: 16 },
        vegetative: { min: 15, target: 20, max: 30 },
        flowering: { min: 20, target: 30, max: 40 }
    }
};

// Light efficiency (umol/J) - higher is better
const lightEfficiency = {
    led: 2.5,        // Modern LEDs: 2.0-3.0 umol/J
    hps: 1.7,        // HPS: 1.5-1.9 umol/J
    fluorescent: 1.0, // Fluorescent: 0.8-1.2 umol/J
    cmh: 1.9         // CMH: 1.7-2.1 umol/J
};

// Watts per square foot recommendations
const wattsPerSqFt = {
    led: {
        leafy: 25,
        fruiting: 35,
        flowering: 40,
        seedlings: 20,
        houseplants: 15,
        succulents: 25
    },
    hps: {
        leafy: 40,
        fruiting: 55,
        flowering: 65,
        seedlings: 30,
        houseplants: 25,
        succulents: 40
    },
    fluorescent: {
        leafy: 35,
        fruiting: 50,
        flowering: 55,
        seedlings: 25,
        houseplants: 20,
        succulents: 35
    },
    cmh: {
        leafy: 35,
        fruiting: 50,
        flowering: 55,
        seedlings: 25,
        houseplants: 22,
        succulents: 35
    }
};

// Hanging distance recommendations (inches)
const hangingDistance = {
    led: {
        seedling: { min: 24, optimal: 30, max: 36 },
        vegetative: { min: 18, optimal: 24, max: 30 },
        flowering: { min: 12, optimal: 18, max: 24 }
    },
    hps: {
        seedling: { min: 30, optimal: 36, max: 48 },
        vegetative: { min: 24, optimal: 30, max: 36 },
        flowering: { min: 18, optimal: 24, max: 30 }
    },
    fluorescent: {
        seedling: { min: 6, optimal: 8, max: 12 },
        vegetative: { min: 4, optimal: 6, max: 10 },
        flowering: { min: 3, optimal: 4, max: 6 }
    },
    cmh: {
        seedling: { min: 28, optimal: 34, max: 42 },
        vegetative: { min: 22, optimal: 28, max: 34 },
        flowering: { min: 16, optimal: 22, max: 28 }
    }
};

// Product recommendations with affiliate links
const productRecommendations = {
    small: [ // Up to 4 sq ft
        {
            name: "Mars Hydro TS 600",
            wattage: 100,
            coverage: "2x2 ft",
            price: "$70-90",
            rating: 4.6,
            link: "https://www.amazon.com/dp/B07VL8FZS1?tag=kcwd-20",
            features: ["Full spectrum", "Dimmable", "Low heat", "Daisy chain"]
        },
        {
            name: "Spider Farmer SF-300",
            wattage: 33,
            coverage: "2x2 ft seedlings",
            price: "$35-50",
            rating: 4.5,
            link: "https://www.amazon.com/dp/B08DKGW2P1?tag=kcwd-20",
            features: ["Samsung LM301", "Seedlings ideal", "Ultra quiet", "Energy efficient"]
        }
    ],
    medium: [ // 4-16 sq ft
        {
            name: "Mars Hydro TS 1000",
            wattage: 150,
            coverage: "3x3 ft",
            price: "$100-130",
            rating: 4.7,
            link: "https://www.amazon.com/dp/B07PLYR5HG?tag=kcwd-20",
            features: ["Full spectrum", "Dimmable", "Sunlike light", "5-year warranty"]
        },
        {
            name: "Spider Farmer SF-1000",
            wattage: 100,
            coverage: "3x3 ft veg / 2x2 ft flower",
            price: "$110-140",
            rating: 4.7,
            link: "https://www.amazon.com/dp/B07TS82HWB?tag=kcwd-20",
            features: ["Samsung LM301B", "Mean Well driver", "High efficiency", "No fan noise"]
        },
        {
            name: "AC Infinity IONFRAME EVO4",
            wattage: 300,
            coverage: "4x4 ft",
            price: "$280-320",
            rating: 4.8,
            link: "https://www.amazon.com/dp/B0BW9VVQZQ?tag=kcwd-20",
            features: ["Samsung LM301H", "2.9 umol/J", "Controller ready", "Commercial grade"]
        }
    ],
    large: [ // 16+ sq ft
        {
            name: "Mars Hydro FC-E4800",
            wattage: 480,
            coverage: "4x4 ft",
            price: "$350-400",
            rating: 4.8,
            link: "https://www.amazon.com/dp/B097QYX2PH?tag=kcwd-20",
            features: ["Samsung LM301B", "2.8 umol/J", "Detachable driver", "Full spectrum"]
        },
        {
            name: "Spider Farmer SE7000",
            wattage: 730,
            coverage: "5x5 ft",
            price: "$650-750",
            rating: 4.9,
            link: "https://www.amazon.com/dp/B09NNGLFBD?tag=kcwd-20",
            features: ["Samsung LM301B EVO", "2.9 umol/J", "Commercial grade", "6-bar design"]
        },
        {
            name: "HLG 650R",
            wattage: 630,
            coverage: "5x5 ft",
            price: "$900-1000",
            rating: 4.9,
            link: "https://www.amazon.com/dp/B08D5T8VRT?tag=kcwd-20",
            features: ["Samsung LM301H", "Deep red 660nm", "Made in USA", "Industry leading"]
        }
    ],
    hps: [
        {
            name: "VIVOSUN 600W HPS Kit",
            wattage: 600,
            coverage: "4x4 ft",
            price: "$110-140",
            rating: 4.5,
            link: "https://www.amazon.com/dp/B0108I8LB2?tag=kcwd-20",
            features: ["Digital ballast", "Cool tube reflector", "Complete kit", "High output"]
        },
        {
            name: "iPower 1000W HPS Kit",
            wattage: 1000,
            coverage: "5x5 ft",
            price: "$150-180",
            rating: 4.4,
            link: "https://www.amazon.com/dp/B005HG8UQ2?tag=kcwd-20",
            features: ["Dimmable ballast", "Wing reflector", "High intensity", "Budget friendly"]
        }
    ]
};

// Calculate function
function calculate() {
    // Get inputs
    const plantType = document.getElementById('plantType').value;
    const growthStage = document.getElementById('growthStage').value;
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const lightType = document.getElementById('lightType').value;
    const electricityCost = parseFloat(document.getElementById('electricityCost').value);
    const hoursPerDay = parseInt(document.getElementById('hoursPerDay').value);

    // Calculate area
    const area = length * width;

    // Get DLI requirements
    const dliReq = plantDLI[plantType][growthStage];

    // Calculate target PPFD from DLI
    // DLI = PPFD * hours * 3600 / 1000000
    // PPFD = DLI * 1000000 / (hours * 3600)
    const targetPPFD = Math.round(dliReq.target * 1000000 / (hoursPerDay * 3600));
    const minPPFD = Math.round(dliReq.min * 1000000 / (hoursPerDay * 3600));
    const maxPPFD = Math.round(dliReq.max * 1000000 / (hoursPerDay * 3600));

    // Calculate wattage needed
    const wpSqFt = wattsPerSqFt[lightType][plantType];
    const totalWattage = Math.round(area * wpSqFt);

    // Calculate costs
    const dailyKwh = (totalWattage * hoursPerDay) / 1000;
    const dailyCost = dailyKwh * electricityCost;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;

    // Get hanging distance
    const distance = hangingDistance[lightType][growthStage];

    // Update results
    document.getElementById('resultArea').textContent = `${area} sq ft`;
    document.getElementById('resultWattage').textContent = `${totalWattage}W`;
    document.getElementById('resultWpSqFt').textContent = `${wpSqFt}W`;
    document.getElementById('resultDLI').textContent = `${dliReq.target} mol/m2/d`;
    document.getElementById('resultDLIRange').textContent = `${dliReq.min}-${dliReq.max} mol/m2/d`;
    document.getElementById('resultPPFD').textContent = `${targetPPFD} umol/m2/s`;
    document.getElementById('resultDailyCost').textContent = `$${dailyCost.toFixed(2)}`;
    document.getElementById('resultMonthlyCost').textContent = `$${monthlyCost.toFixed(2)}`;
    document.getElementById('resultYearlyCost').textContent = `$${yearlyCost.toFixed(2)}`;
    document.getElementById('resultDistance').textContent = `${distance.optimal} inches`;
    document.getElementById('resultDistanceRange').textContent = `${distance.min}-${distance.max} inches`;

    // Generate product recommendations
    generateRecommendations(area, totalWattage, lightType);

    // Generate tips
    generateTips(plantType, growthStage, lightType, area);

    // Show results
    document.getElementById('results').classList.remove('hidden');

    // Smooth scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateRecommendations(area, wattage, lightType) {
    const container = document.getElementById('recommendedProducts');
    container.innerHTML = '';

    let products;
    if (lightType === 'hps') {
        products = productRecommendations.hps;
    } else if (area <= 4) {
        products = productRecommendations.small;
    } else if (area <= 16) {
        products = productRecommendations.medium;
    } else {
        products = productRecommendations.large;
    }

    // Filter and sort by closest wattage match
    const sortedProducts = [...products].sort((a, b) => {
        return Math.abs(a.wattage - wattage) - Math.abs(b.wattage - wattage);
    });

    // Show top 3 recommendations
    sortedProducts.slice(0, 3).forEach((product, index) => {
        const isTopPick = index === 0;
        const html = `
            <div class="bg-white p-4 rounded-lg border ${isTopPick ? 'border-primary border-2' : 'border-gray-200'}">
                ${isTopPick ? '<span class="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">Top Pick</span>' : ''}
                <div class="flex justify-between items-start mb-2">
                    <h5 class="font-semibold text-gray-900">${product.name}</h5>
                    <span class="text-primary font-bold">${product.price}</span>
                </div>
                <div class="text-sm text-gray-600 mb-3">
                    <span class="mr-4">${product.wattage}W</span>
                    <span class="mr-4">Coverage: ${product.coverage}</span>
                    <span>Rating: ${product.rating}/5</span>
                </div>
                <div class="flex flex-wrap gap-2 mb-3">
                    ${product.features.map(f => `<span class="text-xs bg-gray-100 px-2 py-1 rounded">${f}</span>`).join('')}
                </div>
                <a href="${product.link}" target="_blank" rel="noopener sponsored"
                   class="inline-block bg-primary text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition">
                    Check Price on Amazon
                </a>
            </div>
        `;
        container.innerHTML += html;
    });
}

function generateTips(plantType, growthStage, lightType, area) {
    const tipsContainer = document.getElementById('resultTips');
    const tips = [];

    // Light type specific tips
    if (lightType === 'led') {
        tips.push('LED lights run cooler than HPS, so you can position them closer to plants without heat stress.');
        tips.push('Most LED grow lights are dimmable - start at 50-75% for new plants and increase gradually.');
    } else if (lightType === 'hps') {
        tips.push('HPS lights generate significant heat - ensure good ventilation and consider a cool tube reflector.');
        tips.push('Replace HPS bulbs every 12-18 months as output decreases over time.');
    }

    // Plant type specific tips
    if (plantType === 'flowering') {
        tips.push('During flowering, ensure your light schedule is consistent - light leaks can cause stress and hermaphroditism.');
        tips.push('Consider adding far-red (730nm) spectrum during the last 2 weeks for enhanced ripening.');
    } else if (plantType === 'leafy') {
        tips.push('Leafy greens prefer blue-heavy spectrum (5000-6500K) for compact, leafy growth.');
        tips.push('Keep temperatures between 60-75F for optimal lettuce and herb production.');
    }

    // Growth stage tips
    if (growthStage === 'seedling') {
        tips.push('Seedlings need less light intensity - keep lights at maximum distance initially.');
        tips.push('Consider a humidity dome for the first 1-2 weeks to maintain 70-80% humidity.');
    } else if (growthStage === 'flowering') {
        tips.push('Increase red spectrum during flowering for better bud/fruit development.');
    }

    // General tips
    tips.push('Use a PAR meter or phone app to verify actual light levels reaching your canopy.');
    tips.push('Position reflective material (mylar, white paint) on walls to maximize light efficiency.');

    // Render tips
    tipsContainer.innerHTML = tips.slice(0, 5).map(tip => `<li class="flex items-start">
        <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        ${tip}
    </li>`).join('');
}

// Event listener
document.getElementById('growLightForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
});

// Auto-update hours based on growth stage
document.getElementById('growthStage').addEventListener('change', function(e) {
    const hoursSelect = document.getElementById('hoursPerDay');
    switch(e.target.value) {
        case 'seedling':
            hoursSelect.value = '18';
            break;
        case 'vegetative':
            hoursSelect.value = '18';
            break;
        case 'flowering':
            hoursSelect.value = '12';
            break;
    }
});

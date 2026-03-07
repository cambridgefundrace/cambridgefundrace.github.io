// Function to parse CSV data
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {};
        headers.forEach((header, index) => {
            entry[header.trim()] = values[index].trim();
        });
        data.push(entry);
    }
    
    return data;
}

// Function to get college abbreviation for logo filename
function getCollegeAbbrev(collegeName) {
    const abbrevMap = {
        "Christ's College": "CH",
        "Churchill College": "CHU",
        "Clare College": "CL",
        "Clare Hall": "CLH",
        "Corpus Christi College": "CC",
        "Darwin College": "DAR",
        "Downing College": "DOW",
        "Emmanuel College": "EM",
        "Fitzwilliam College": "FIT",
        "Girton College": "GIR",
        "Gonville & Caius College": "CAI",
        "Homerton College": "HOM",
        "Hughes Hall": "HUG",
        "Jesus College": "JES",
        "King's College": "K",
        "Lucy Cavendish College": "LUC",
        "Magdalene College": "MAG",
        "Murray Edwards College": "MUR",
        "Newnham College": "NEW",
        "Pembroke College": "PEM",
        "Peterhouse": "PET",
        "Queens' College": "Q",
        "Robinson College": "ROB",
        "Selwyn College": "SEL",
        "Sidney Sussex College": "SID",
        "St Catharine's College": "CAT",
        "St Edmund's College": "ED",
        "St John's College": "JN",
        "Trinity College": "T",
        "Trinity Hall": "TH",
        "Wolfson College": "W"
    };
    return abbrevMap[collegeName] || collegeName.substring(0, 3).toUpperCase();
}

const OVERALL_GOAL = 15000;      // £ target shown in the goal banner
const COLLEGE_GOAL = 500;        // £ target for each college's progress bar

// ── INLINE FUND DATA ─────────────────────────────────────────────────────────
// Update the amounts here directly instead of editing funds.csv.
// Format: { college: "College Name", raised_funds: NUMBER }
const FUNDS_DATA = [
    { college: "Christ's College",        raised_funds: 655 },
    { college: "Churchill College",        raised_funds: 115 },
    { college: "Clare College",            raised_funds: 26  },
    { college: "Clare Hall",               raised_funds: 760 },
    { college: "Corpus Christi College",   raised_funds: 282 },
    { college: "Darwin College",           raised_funds: 251 },
    { college: "Downing College",          raised_funds: 229 },
    { college: "Emmanuel College",         raised_funds: 143 },
    { college: "Fitzwilliam College",      raised_funds: 755 },
    { college: "Girton College",           raised_funds: 105 },
    { college: "Gonville & Caius College", raised_funds: 693 },
    { college: "Homerton College",         raised_funds: 759 },
    { college: "Hughes Hall",              raised_funds: 914 },
    { college: "Jesus College",            raised_funds: 559 },
    { college: "King's College",           raised_funds: 90  },
    { college: "Lucy Cavendish College",   raised_funds: 605 },
    { college: "Magdalene College",        raised_funds: 433 },
    { college: "Murray Edwards College",   raised_funds: 33  },
    { college: "Newnham College",          raised_funds: 31  },
    { college: "Pembroke College",         raised_funds: 96  },
    { college: "Peterhouse",               raised_funds: 224 },
    { college: "Queens' College",          raised_funds: 239 },
    { college: "Robinson College",         raised_funds: 518 },
    { college: "Selwyn College",           raised_funds: 617 },
    { college: "Sidney Sussex College",    raised_funds: 28  },
    { college: "St Catharine's College",   raised_funds: 575 },
    { college: "St Edmund's College",      raised_funds: 204 },
    { college: "St John's College",        raised_funds: 734 },
    { college: "Trinity College",          raised_funds: 666 },
    { college: "Trinity Hall",             raised_funds: 719 },
    { college: "Wolfson College",          raised_funds: 559 },
];

// Function to load and display leaderboard
function loadLeaderboard() {
    const data = FUNDS_DATA;

    // Sort by raised_funds in descending order
    data.sort((a, b) => b.raised_funds - a.raised_funds);

    // Calculate overall total
    const totalRaised = data.reduce((sum, c) => sum + c.raised_funds, 0);

    // Get leaderboard container
    const leaderboard = document.querySelector('.leaderboard');
    leaderboard.innerHTML = '';

    // ── OVERALL GOAL BANNER ──────────────────────────────────────────
    const overallPct = Math.min((totalRaised / OVERALL_GOAL) * 100, 100);
    const goalBanner = document.createElement('div');
    goalBanner.className = 'goal-banner';
    goalBanner.innerHTML = `
        <div class="goal-banner-top">
            <span class="goal-label">🎯 Overall Goal</span>
            <span class="goal-amounts">
                <span class="goal-raised">£${totalRaised.toLocaleString()}</span>
                <span class="goal-sep"> / </span>
                <span class="goal-target">£${OVERALL_GOAL.toLocaleString()}</span>
            </span>
        </div>
        <div class="goal-track">
            <div class="goal-fill" style="width: ${overallPct}%"></div>
        </div>
        <div class="goal-pct">${overallPct >= 100 ? '🏁 Goal reached!' : Math.round(overallPct) + '% of goal'}</div>
    `;
    leaderboard.appendChild(goalBanner);

    // Create leaderboard items
    data.forEach((college, index) => {
        const rank = index + 1;
        const amount = college.raised_funds;
        const abbrev = getCollegeAbbrev(college.college);

        // Determine class based on rank
        let itemClass = 'college-item';
        if (rank === 1) itemClass += ' top-1';
        else if (rank <= 5) itemClass += ' top-5';

        // Create college item
        const item = document.createElement('div');
        item.className = itemClass;

        // College progress bar — full-row background via CSS variable
        const collegePct = Math.min((amount / COLLEGE_GOAL) * 100, 100);
        item.style.setProperty('--bar-pct', `${collegePct}%`);

        // Create logo element
        const logoDiv = document.createElement('div');
        logoDiv.className = 'logo';

        const logoImg = document.createElement('img');
        logoImg.src = `logos/${abbrev}.png`;
        logoImg.alt = college.college;
        logoImg.style.width = '100%';
        logoImg.style.height = '100%';
        logoImg.style.objectFit = 'contain';

        logoImg.onerror = function() {
            logoDiv.textContent = abbrev;
            logoImg.remove();
        };
        logoDiv.appendChild(logoImg);

        const rankDiv = document.createElement('div');
        rankDiv.className = 'rank';
        rankDiv.textContent = `${rank}.`;

        const middleDiv = document.createElement('div');
        middleDiv.className = 'college-middle';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'college-name';
        nameDiv.textContent = college.college;

        middleDiv.appendChild(nameDiv);

        const amountDiv = document.createElement('div');
        amountDiv.className = 'amount';
        amountDiv.textContent = `£${amount.toLocaleString()}`;

        item.appendChild(rankDiv);
        item.appendChild(logoDiv);
        item.appendChild(middleDiv);
        item.appendChild(amountDiv);

        leaderboard.appendChild(item);
    });
}

// Load leaderboard when page loads
window.addEventListener('DOMContentLoaded', loadLeaderboard);
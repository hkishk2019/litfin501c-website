/* =====================================================================
   panels.js — content manifest. Edit this when copy or photos change.

   Schema:
     PANELS_BY_ROOM[]:
       id           "theater" | "crown" | ...
       themeClass   "pg-theme-light" | "pg-theme-dark"
       eyebrow      Small caps line above the room title
       title        Italic Playfair room title
       subtitle     One sentence
       panels[]     Panel objects (see below)

     panel:
       id           url-slug, becomes "panel-<id>" anchor
       eyebrow      "PANEL X · ROOM"
       title        Hermès-style poetic title (italic Playfair)
       subtitle     One sentence — the "Beyond silk" line
       hero         Path to the hero JPG, or null for placeholder
       heroAlt      Alt text
       secondaries  Array of { photo: {src, alt}, card: {...} } pairs.
                    Each pair becomes one full-width row beneath the hero;
                    rows alternate left/right. Photos are NEVER side-by-side.
                    `card` may be omitted for a photo-only row, but keep
                    secondaries short — 2 photos total per panel is plenty.

     card:
       eyebrow   Small caps label, e.g. "ON THE PANEL"
       list[]    [{ name, role }, ...]   panelist roster
       name+role single panelist (alternative to list)
       quote     Optional Playfair-italic pull quote

   Panelist names + titles are taken from the official agenda + speakers
   grid at https://litfin501c.com — that page is the source of truth.
   ===================================================================== */

window.PANELS_BY_ROOM = [
    /* ====================== THEATER (dark) ====================== */
    {
        id: "theater",
        themeClass: "pg-theme-dark",
        eyebrow: "FLOOR ONE",
        title: "The Theater",
        subtitle:
            "The bigger room — where the welcome was given, the deans spoke, and the day's two halves were stitched together by music.",
        panels: [
            {
                id: "opening",
                eyebrow: "OPENING CEREMONY · THEATER",
                title: "Where the Science of Law & Finance Meets Art",
                subtitle:
                    "A welcome from the stage, and the only kind of opening worthy of the Museum of Contemporary Art — a single sentence on the screen, and the room hushes.",
                hero: "photos/opening/img_0941-hero.jpg",
                heroAlt: "Opening welcome — the stage at the Museum of Contemporary Art Theater",
                secondaries: [
                    {
                        photo: {
                            src: "photos/opening/img_0944-thumb.jpg",
                            alt: "Charles Zuo at the podium with the conference title on screen",
                        },
                        card: {
                            eyebrow: "OPENING WELCOME",
                            name: "Donald Rebstock",
                            role: "Assistant Dean · Northwestern University Pritzker School of Law",
                        },
                    },
                ],
            },
            {
                id: "opening-economy",
                eyebrow: "OPENING PANEL · THEATER",
                title: "A Snapshot of the World",
                subtitle:
                    "Macro, private equity, venture, and secondaries — the four winds blowing through legal finance, charted in a single hour.",
                hero: "photos/opening-economy/img_0940-hero.jpg",
                heroAlt: "Opening Panel — A Snapshot of Today's World Economy",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Mitchell Green", role: "ex-Senior Portfolio Officer, Illinois Firefighters' Pension Fund" },
                                { name: "Mark Shore", role: "Director and Economist · CME Group" },
                                { name: "Benjamin Blum", role: "Managing Director · Flexpoint Ford" },
                                { name: "Michele Gambera", role: "Private Investor (ex-Head of Strategic Asset Allocation, UBS Asset Management)" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "antitrust",
                eyebrow: "PANEL 1 · THEATER",
                title: "High-Stakes Disputes",
                subtitle:
                    "Antitrust and complex litigation, where the size of the case and the size of the capital have grown up together.",
                hero: "photos/antitrust/img_0939-hero.jpg",
                heroAlt: "Antitrust & Complex Litigation panel",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Will Marra", role: "Director, Certum Group" },
                                { name: "Jason Levine", role: "Partner · Foley & Lardner LLP" },
                                { name: "Steven Nachtwey", role: "Partner · Bartlit Beck LLP" },
                                { name: "Andrew Stulce", role: "Director · Longford Capital" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "matchmakers",
                eyebrow: "PANEL 2 · THEATER",
                title: "The Matchmakers",
                subtitle:
                    "Advisors and intermediaries — the quiet hands that shape deal flow and the prices that nobody sees set.",
                hero: "photos/matchmakers/img_0938-hero.jpg",
                heroAlt: "The Matchmakers panel",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Michael Kelley", role: "Parker Poe / University of Chicago Law School" },
                                { name: "Charles Agee", role: "CEO · Westfleet Advisors" },
                                { name: "Sarah Jacobson", role: "Investment Manager / Legal Counsel · Omni Bridgeway" },
                                { name: "Matt Leland", role: "Co-Founder & Principal · Backlit Capital" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "judiciary",
                eyebrow: "PANEL 3 · THEATER",
                title: "From the Bench",
                subtitle:
                    "Judicial gatekeeping in third-party-funded litigation — and how the courtroom learns to read a capital stack.",
                hero: "photos/judiciary/img_0937-hero.jpg",
                heroAlt: "From the Bench — judges and scholars on stage",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Virginia M. Kendall", role: "Chief Judge · U.S. District Court, Northern District of Illinois" },
                                { name: "Heather K. McShain", role: "U.S. Magistrate Judge · U.S. District Court, Northern District of Illinois" },
                                { name: "J. Samuel Tenenbaum", role: "Clinical Professor · Northwestern Pritzker School of Law" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "dean-remarks",
                eyebrow: "REMARK & DIALOGUE · THEATER",
                title: "A Word from the Dean",
                subtitle:
                    "Zachary D. Clopton, Dean of Northwestern Pritzker School of Law, opens the lunch hour with a welcome to the room.",
                hero: "photos/dean-remarks/img_0935-hero.jpg",
                heroAlt: "Dean Zachary Clopton at the theater podium",
                secondaries: [
                    {
                        photo: {
                            src: "photos/dean-remarks/img_0936-thumb.jpg",
                            alt: "Dean Clopton in conversation on stage",
                            halfWidth: true,
                        },
                        card: {
                            name: "Zachary D. Clopton",
                            role: "Dean · Northwestern Pritzker School of Law",
                        },
                    },
                ],
            },
            {
                id: "fireside",
                eyebrow: "FIRESIDE CHAT · THEATER",
                title: "The Long Game of an Am Law Chairman",
                subtitle:
                    "Craig C. Martin, Chairman, Americas of Willkie Farr & Gallagher LLP, on opening Chicago, leading globally, and what AI is about to do to the practice.",
                hero: "photos/fireside/img_8307-hero.jpg",
                heroAlt: "Fireside Chat — Craig C. Martin and Bruce Markell on the Theater stage",
            },
            {
                id: "regulation",
                eyebrow: "POLICY PANEL · THEATER",
                title: "Rules of the Game",
                subtitle:
                    "Disclosure, regulation, and the political future of legal funding — where the loudest debates are still being written.",
                hero: "photos/regulation/img_0934-hero.jpg",
                heroAlt: "Rules of the Game policy panel",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Albert Chang", role: "Adjunct Professor / Senior Director · Northwestern Pritzker School of Law / Fannie Mae" },
                                { name: "Jack Kelly", role: "Managing Director · American Legal Finance Association (ALFA)" },
                                { name: "Paul Kong", role: "Executive Director & President · International Legal Finance Association (ILFA)" },
                                { name: "Eric Schuller", role: "President · Alliance for Responsible Consumer Legal Funding (ARC)" },
                                { name: "Kacey Wolmer", role: "Chief Operating Officer · Contingency Capital" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "bankruptcy",
                eyebrow: "PANEL 4 · THEATER",
                title: "Capital in Crisis",
                subtitle:
                    "Litigation funding at the edge of solvency — bankruptcy estates, post-confirmation disputes, and the value that survives.",
                hero: "photos/bankruptcy/img_0933-hero.jpg",
                heroAlt: "Capital in Crisis bankruptcy panel",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Marc Carmel", role: "Managing Member, McDonald Hopkins LLC" },
                                { name: "Marvin Isgur", role: "U.S. Bankruptcy Judge · S.D. Texas" },
                                { name: "Bruce Markell", role: "Retired U.S. Bankruptcy Judge / Professor · Northwestern Pritzker School of Law" },
                                { name: "Ken Epstein", role: "Co-Founder & Principal · Backlit Capital" },
                                { name: "Jeffery Lula", role: "Managing Director · GLS Capital" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "ip",
                eyebrow: "PANEL 5 · THEATER",
                title: "Patent to Payout",
                subtitle:
                    "IP monetization through third-party capital — the long arc from invention to enforcement to liquidity.",
                hero: "photos/ip/img_0931-hero.jpg",
                heroAlt: "Patent to Payout IP panel",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Ryan N. Phelan", role: "Partner, Marshall, Gerstein & Borun LLP" },
                                { name: "Eric Carlson", role: "Managing Director, Global Patent · Burford Capital" },
                                { name: "Josh Gammon", role: "Founder / Instructor · WealthDocket / Northwestern Pritzker School of Law" },
                                { name: "Joel Merkin", role: "Managing Director · GLS Capital" },
                                { name: "Mark York", role: "Editor in Chief · LegalCast" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "mso",
                eyebrow: "PANEL 6 · THEATER",
                title: "Beyond Funding",
                subtitle:
                    "The current landscape and future trends of legal-asset investment and the management services organization model.",
                hero: "photos/mso/img_0930-hero.jpg",
                heroAlt: "Beyond Funding MSO panel",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Ed Gehres", role: "Managing Partner, Invenio LLP" },
                                { name: "Marc Carmel", role: "Managing Member · McDonald Hopkins LLC" },
                                { name: "Seth Deutsch", role: "Co-Founder · Samson Partners Group" },
                                { name: "William Henderson", role: "Professor · Indiana University Maurer School of Law" },
                                { name: "Leonard Brahin", role: "Associate · Holland & Knight LLP" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "intermission",
                eyebrow: "INTERMISSION · THEATER",
                title: "A Pause for Music",
                subtitle:
                    "Piano and violin, beneath a single line on the screen — the day's quietest minute, and the most photographed.",
                hero: "photos/intermission/img_0946-hero.jpg",
                heroAlt: "Piano and violin duo on the theater stage",
                secondaries: [
                    {
                        photo: {
                            src: "photos/intermission/img_0945-thumb.jpg",
                            alt: "Wide view of the performers — piano, violin, and the theater in stillness",
                        },
                        card: null,
                    },
                ],
            },
            {
                id: "sponsors",
                eyebrow: "WITH GRATITUDE · THEATER",
                title: "Our Generous Sponsors",
                subtitle:
                    "The day was built by everyone whose name is on the screen.",
                hero: "photos/sponsors/img_0943-hero.jpg",
                heroAlt: "Sponsor wall slide on the theater stage",
                secondaries: [
                    {
                        photo: {
                            src: "photos/sponsors/img_0942-thumb.jpg",
                            alt: "Thank you to Northwestern Pritzker School of Law — on screen",
                        },
                        card: null,
                    },
                ],
            },
            {
                id: "volunteers",
                eyebrow: "WITH GRATITUDE · THEATER",
                title: "The Volunteer Team",
                subtitle:
                    "Ten-plus graduate students, five hundred hours.",
                hero: "photos/volunteers/img_0948-hero.jpg",
                heroAlt: "Volunteer team thank-you slide",
                secondaries: null,
            },
        ],
    },

    /* ====================== CROWN ROOM (light) ====================== */
    {
        id: "crown",
        themeClass: "pg-theme-light",
        eyebrow: "FLOOR THREE",
        title: "The Crown Room",
        subtitle:
            "Six panels in the round — the closer track, where the glass walls let the afternoon sun in.",
        panels: [
            {
                id: "ai",
                eyebrow: "PANEL A · CROWN ROOM",
                title: "When Code Meets Claims",
                subtitle:
                    "Algorithms now sit at the funder's table. Diligence learns to read itself, and the next generation of funded litigation begins to take shape.",
                hero: "photos/ai/mj6a7599-hero.jpg",
                heroAlt: "AI panel — full stage at the Crown Room",
                secondaries: [
                    {
                        photo: null,
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Daniel Linna", role: "Senior Lecturer & Director of Law and Technology Initiatives, Northwestern Pritzker School of Law" },
                                { name: "Ed Gehres", role: "Managing Partner · Invenio LLP" },
                                { name: "David Jang", role: "Portfolio Manager · Legalist" },
                                { name: "Alex Sha", role: "Co-Founder · Bridge Legal" },
                                { name: "Daniel Wolfe", role: "Managing Director · Magna Legal Services" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "insurance",
                eyebrow: "PANEL B · CROWN ROOM",
                title: "The Risk Transfer Layer",
                subtitle:
                    "Where verdicts meet underwriters. Litigation insurance, judgment preservation, and the quiet machinery of portfolio protection.",
                hero: "photos/insurance/mj6a7670-hero.jpg",
                heroAlt: "Insurance panel — full stage with title slide",
                secondaries: [
                    {
                        photo: {
                            src: "photos/insurance/mj6a7704-thumb.jpg",
                            alt: "Max Bernstein laughing with the panel",
                        },
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Max Bernstein", role: "Senior Vice President, CAC Group" },
                                { name: "Matthew Blumenstein", role: "Head of Underwriting · Statera Capital" },
                                { name: "Daniel Bond", role: "Managing Director, North America · Litica" },
                                { name: "Jackson Schaap", role: "Vice President & Partner · Signal Peak Partners" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "international",
                eyebrow: "PANEL C · CROWN ROOM",
                title: "Global Playbook",
                subtitle:
                    "Capital crosses borders before the verdict does. International litigation, arbitration, and the long arm of cross-border enforcement.",
                hero: "photos/international/mj6a7797-hero.jpg",
                heroAlt: "International panel — full stage",
                secondaries: [
                    {
                        photo: {
                            src: "photos/international/mj6a7803-thumb.jpg",
                            alt: "International panel during the moderator's question",
                        },
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Michael Kelley", role: "Parker Poe / University of Chicago Law School" },
                                { name: "Erika Levin", role: "Partner · Fox Rothschild LLP" },
                                { name: "Matt Oxman", role: "Vice President of Underwriting · Bench Walk Advisors" },
                                { name: "Victoria Sahani", role: "Professor · Boston University School of Law" },
                            ],
                            quote:
                                "Cross-border enforcement is where litigation finance stops being theory and starts being plumbing.",
                        },
                    },
                ],
            },
            {
                id: "academic",
                eyebrow: "PANEL D · CROWN ROOM",
                title: "The Research Frontier",
                subtitle:
                    "What the data quietly says — before the market catches up. Scholars working at the edge of what is known about litigation finance.",
                hero: "photos/academic/mj6a7812-hero.jpg",
                heroAlt: "Research Frontier panel — five scholars on stage",
                secondaries: [
                    {
                        photo: {
                            src: "photos/academic/mj6a7844-thumb.jpg",
                            alt: "Research Frontier panel — scholars in conversation",
                        },
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Suneal Bedi", role: "Associate Professor · Indiana University Kelley School of Business" },
                                { name: "Maria Glover", role: "Carmack Waterhouse Professor of Law · Georgetown University Law Center" },
                                { name: "Will Marra", role: "Director · Certum Group" },
                                { name: "Victoria Sahani", role: "Professor · Boston University School of Law" },
                                { name: "Anthony Sebok", role: "Professor · Benjamin N. Cardozo School of Law / NYU" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "private-credit",
                eyebrow: "PANEL E · CROWN ROOM",
                title: "Asset-Backed, Lawyer-Made",
                subtitle:
                    "Credit finds the law firm. The law firm finds its balance sheet. A new lending discipline takes root in legal risk.",
                hero: "photos/private-credit/mj6a7930-hero.jpg",
                heroAlt: "Private Credit panel — full stage with title slide",
                secondaries: [
                    {
                        photo: {
                            src: "photos/private-credit/mj6a7954-thumb.jpg",
                            alt: "Justin Maleson speaks at the Private Credit panel",
                        },
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Patrick Dempsey", role: "Director of Commercial Litigation Strategy, Certum Group" },
                                { name: "Joshua Libling", role: "Founder & Managing Director · Arcadia Finance" },
                                { name: "Justin Maleson", role: "Managing Director & Assistant General Counsel · Victory Park Capital" },
                                { name: "Ryan Schultz", role: "Head of Business Development · Pine Valley Capital Partners" },
                            ],
                        },
                    },
                ],
            },
            {
                id: "secondaries",
                eyebrow: "PANEL F · CROWN ROOM",
                title: "The Secondary Market",
                subtitle:
                    "Patient money meets impatient money. Liquidity, continuation funds, and the slow art of price discovery in legal assets.",
                hero: "photos/secondaries/mj6a7988-hero.jpg",
                heroAlt: "Secondaries panel — full stage with title slide",
                secondaries: [
                    {
                        photo: {
                            src: "photos/secondaries/mj6a8087-thumb.jpg",
                            alt: "Michael Kelley moderates the Secondaries panel",
                        },
                        card: {
                            eyebrow: "ON THE PANEL",
                            list: [
                                { name: "Michael Kelley", role: "Parker Poe / University of Chicago Law School" },
                                { name: "Timothy Bennett", role: "General Counsel · Fulcrum" },
                                { name: "Kelly Daley", role: "Founder · Celsia Capital" },
                                { name: "Chris Dore", role: "Chief Strategy Officer · Bridge Legal" },
                                { name: "Adam Levitt", role: "Founding Partner · DiCello Levitt LLP" },
                            ],
                        },
                    },
                ],
            },
        ],
    },
];

import { Candidate } from "../services/geminiService";

export const BOOTSTRAP_CANDIDATES: Record<'Texas City' | 'La Marque', Candidate[]> = {
  'Texas City': [
    {
      name: "Keith Henry",
      position: "Mayor",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      background: "Veteran candidate with a focus on local governance and infrastructure.",
      stances: ["Economic Development", "Infrastructure", "Public Safety", "Transparency"],
      highlights: ["Long-time resident", "Business experience", "Community volunteer"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/KeithForMayor" },
        { platform: "Website", url: "https://keithfortexascity.com" }
      ],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Dedrick D. Johnson",
      position: "Mayor",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      background: "Incumbent Mayor pursuing a second term to continue ongoing city projects.",
      stances: ["System Improvements", "Community Engagement", "Fiscal Responsibility", "Sustainable Growth"],
      highlights: ["Incumbent", "Policy expert", "Local leadership"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/MayorDedrickJohnson" },
        { platform: "Website", url: "https://dedrickjohnson.com" }
      ],
      sources: [
        { title: "TC Mayor's Office - Dedrick Johnson", url: "https://www.texascitytx.gov/435/Mayor" },
        { title: "Voter Guide - 2026 Admin Goals", url: "https://galvestonvotes.org" }
      ]
    },
    {
      name: "Abel Garza Jr.",
      position: "Mayor",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      background: "Challenger focusing on accessibility and modernizing city services.",
      stances: ["Youth Programs", "Technology", "Traffic Management", "Environment"],
      highlights: ["Educational advocate", "Process innovation", "Civic activist"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/AbelGarzaJrForMayor" }
      ],
      sources: [{ title: "Voter Guide", url: "https://galvestonvotes.org" }]
    },
    // Commissioner At-Large
    {
      name: "Brian Goetschius",
      position: "Commissioner At-Large",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      background: "Retired Captain with the Texas City Police Department and advocate for government transparency.",
      stances: ["Public Comment Access", "Voter Approval for Debt", "Fiscal Accountability"],
      highlights: ["Forensic Files Investigator", "Led successful 2025 legal injunction against city debt"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/BrianForTexasCity" }
      ],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Thelma Bowie",
      position: "Commissioner At-Large",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      background: "Advocate for community resources and inclusive representation.",
      stances: ["Housing", "Social Services", "Equity"],
      highlights: ["Community organizer", "Active volunteer"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/BowieAtLarge" },
        { platform: "Website", url: "https://bowieatlarge.com" }
      ],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Tim Herd",
      position: "Commissioner At-Large",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400",
      background: "Focused on economic revitalization and small business support.",
      stances: ["Local Business", "Tourism", "Jobs"],
      highlights: ["Business owner", "Economic advisor"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/TimHerdForTexasCity" }
      ],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Wade Johnson",
      position: "Commissioner At-Large",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1540560086596-114b2d5fbfbc?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Texas City Commissioner At-Large.",
      stances: ["Community Development", "Infrastructure", "Public Safety"],
      highlights: ["Local involvement", "Candidate for 2026"],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Elias Ramirez",
      position: "Commissioner At-Large",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Texas City Commissioner At-Large.",
      stances: ["Fiscal Stewardship", "Neighborhood Safety", "Service Efficiency"],
      highlights: ["Civic advocate", "Local resident"],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Kevin Yackley",
      position: "Commissioner At-Large",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Texas City Commissioner At-Large.",
      stances: ["Infrastructure Maintenance", "Budget Transparency", "Citizen Engagement"],
      highlights: ["Process improvement focused", "Committed to TC growth"],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    // District 1
    {
      name: "DeAndre’ Knoxson",
      position: "District 1 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      background: "Dedicated to improving residential services in District 1.",
      stances: ["Lighting", "Drainage", "Security", "Parks"],
      highlights: ["Local champion", "Neighborhood advocate", "Public service"],
      socials: [
        { platform: "Website", url: "https://voteknoxson.org" }
      ],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Paul Courville-Morgan Jr.",
      position: "District 1 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?auto=format&fit=crop&q=80&w=400",
      background: "Focusing on community safety and youth development.",
      stances: ["Youth Mentorship", "Police Relations", "Waste Management", "Public Spaces"],
      highlights: ["Educator", "Community leader", "District resident"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/PaulForDistrict1" }
      ],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Alex Thompson",
      position: "District 1 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      background: "Passionate about sustainable urban planning and community voice.",
      stances: ["Urban Planning", "Sustainability", "Voice", "Transparency"],
      highlights: ["Modern thinker", "Resident voice", "Planning background"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/AlexThompsonDistrict1" }
      ],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    // District 2
    {
      name: "Barbie Tucker",
      position: "District 2 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      background: "Focused on preserving the unique character of District 2 while modernizing infrastructure.",
      stances: ["Old TC Preservation", "Infrastructure", "Safety", "Beautification"],
      highlights: ["Local historian", "Community pillar", "Committed leader"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/BarbieTuckerForTexasCity" }
      ],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "David Zacherl",
      position: "District 2 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&q=80&w=400",
      background: "Advocating for smart growth and increased neighborhood connectivity.",
      stances: ["Connectedness", "Growth", "Neighborhood Safety", "Service Access"],
      highlights: ["Strategic thinker", "Engaged resident", "Solutions-oriented"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/DavidZacherlForTC" }
      ],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    // District 3
    {
      name: "Dorthea Jones-Pointer",
      position: "District 3 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
      background: "Focused on health accessibility and community welfare.",
      stances: ["Health", "Elderly Care", "Welfare", "Safety"],
      highlights: ["Healthcare background", "Community activist", "Voice of reason"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/DortheaJonesPointerForTexasCity" }
      ],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Chris Sharp",
      position: "District 3 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400",
      background: "Prioritizing economic stability and transparent governance.",
      stances: ["Stability", "Honesty", "Growth", "Taxes"],
      highlights: ["Fiscal advisor", "Proven record", "Lifelong resident"],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Judith Silva",
      position: "District 3 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
      background: "Advocating for inclusive education and neighborhood improvements.",
      stances: ["Schools", "Safety", "Lighting", "Community PR"],
      highlights: ["Parent advocate", "District leader", "Action-oriented"],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    // District 4
    {
      name: "Christopher Walters",
      position: "District 4 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400",
      background: "Focused on modernizing District 4 infrastructure and public services.",
      stances: ["Drainage", "Innovation", "Safety", "Service Efficiency"],
      highlights: ["Tech background", "Energetic leadership", "Focus on results"],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Jami Clark",
      position: "District 4 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=400",
      background: "Advocating for neighborhood safety and increased resident participation.",
      stances: ["Engagement", "Public Safety", "Parks", "Transparency"],
      highlights: ["Engaged parent", "Community advocate", "Focused on the future"],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Jason Delgado",
      position: "District 4 Commissioner",
      location: "Texas City",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=400",
      background: "Committed to fiscal responsibility and strategic long-term planning.",
      stances: ["Fiscal Health", "Planning", "Economic Growth", "Sustainability"],
      highlights: ["Analytical approach", "Business sense", "Committed to growth"],
      sources: [{ title: "Galveston Votes", url: "https://galvestonvotes.org" }]
    }
  ],
  'La Marque': [
    {
      name: "Joe Compian",
      position: "Councilmember District B",
      location: "La Marque",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Councilmember District B in La Marque.",
      stances: ["Community Welfare", "District Services", "Local Representation"],
      highlights: ["Candidate for Seat B", "Official 2026 Contestant"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/JoeCompianForCouncil" }
      ],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Felix Brown",
      position: "Councilmember District B",
      location: "La Marque",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Councilmember District B in La Marque.",
      stances: ["Public Oversight", "District Safety", "Economic Support"],
      highlights: ["Candidate for Seat B", "Official 2026 Contestant"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/FelixBrownForLaMarque" }
      ],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Sade Williams",
      position: "Councilmember District B",
      location: "La Marque",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Councilmember District B in La Marque.",
      stances: ["Youth Engagement", "Strategic Growth", "Transparency"],
      highlights: ["Candidate for Seat B", "Official 2026 Contestant"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/SadeWilliamsForLaMarque" }
      ],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Jody Richards",
      position: "Councilmember District B",
      location: "La Marque",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1507591064344-4c6b005bb1ac?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Councilmember District B in La Marque.",
      stances: ["Fiscal Discipline", "Infrastructure", "Resident Voice"],
      highlights: ["Candidate for Seat B", "Official 2026 Contestant"],
      socials: [
        { platform: "Facebook", url: "https://www.facebook.com/JodyRichardsForLaMarque" }
      ],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Sarah Lowry",
      position: "Councilmember District D",
      location: "La Marque",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Councilmember District D in La Marque.",
      stances: ["District Focus", "Accountability", "Modernization"],
      highlights: ["Candidate for Seat D", "Official 2026 Contestant"],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    },
    {
      name: "Tonia Griffin",
      position: "Councilmember District D",
      location: "La Marque",
      sourceVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400",
      background: "Candidate for Councilmember District D in La Marque.",
      stances: ["Neighborhood Uplift", "Safety Standards", "Communication"],
      highlights: ["Candidate for Seat D", "Official 2026 Contestant"],
      sources: [{ title: "Official Ballot", url: "https://galvestonvotes.org" }]
    }
  ]
};

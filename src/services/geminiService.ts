import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, query, where, writeBatch } from "firebase/firestore";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export interface SentimentAnalysis {
  positive: number;
  negative: number;
  neutral: number;
  summary: string;
}

export interface Candidate {
  id?: string;
  name: string;
  position: string;
  location: 'Texas City' | 'La Marque';
  district?: string;
  imageUrl: string;
  background: string;
  stances: string[];
  highlights: string[];
  sources: { title: string; url: string }[];
  socials?: { platform: string; url: string }[];
  sourceVerified: boolean;
  socialsVerified?: boolean;
  lastUpdated?: any;
}

export interface CalendarEvent {
  date: string;
  event: string;
  description: string;
}

export interface DeepDiveInsight {
  topic: string;
  analysis: string;
  impact: string;
}

export interface ElectionData {
  news: SearchResult[];
  sentiment: SentimentAnalysis;
  trends: { date: string; mentions: number }[];
  patterns: string[];
  candidates: Candidate[];
  calendar: CalendarEvent[];
  deepDive: DeepDiveInsight;
}

const ELECTION_DATA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    news: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, snippet: { type: Type.STRING }, url: { type: Type.STRING }, source: { type: Type.STRING } }, required: ["title", "snippet", "url", "source"] } },
    sentiment: { type: Type.OBJECT, properties: { positive: { type: Type.NUMBER }, negative: { type: Type.NUMBER }, neutral: { type: Type.NUMBER }, summary: { type: Type.STRING } }, required: ["positive", "negative", "neutral", "summary"] },
    trends: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, mentions: { type: Type.NUMBER } }, required: ["date", "mentions"] } },
    patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
    candidates: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, position: { type: Type.STRING }, location: { type: Type.STRING }, district: { type: Type.STRING }, imageUrl: { type: Type.STRING }, background: { type: Type.STRING }, stances: { type: Type.ARRAY, items: { type: Type.STRING } }, highlights: { type: Type.ARRAY, items: { type: Type.STRING } }, sourceVerified: { type: Type.BOOLEAN }, socialsVerified: { type: Type.BOOLEAN }, sources: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, url: { type: Type.STRING } }, required: ["title", "url"] } }, socials: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, url: { type: Type.STRING } }, required: ["platform", "url"] } } }, required: ["name", "position", "location", "imageUrl", "background", "stances", "highlights", "sources", "sourceVerified"] } },
    calendar: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, event: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["date", "event", "description"] } },
    deepDive: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, analysis: { type: Type.STRING }, impact: { type: Type.STRING } }, required: ["topic", "analysis", "impact"] }
  },
  required: ["news", "sentiment", "trends", "patterns", "candidates", "calendar", "deepDive"]
};

/**
 * Fetches all candidates for a specific city from the stable database.
 */
export async function getCandidatesFromDB(loc: 'Texas City' | 'La Marque'): Promise<Candidate[]> {
  const q = query(collection(db, "candidates"), where("location", "==", loc));
  const querySnapshot = await getDocs(q);
  const candidates: Candidate[] = [];
  querySnapshot.forEach((doc) => {
    candidates.push({ id: doc.id, ...doc.data() } as Candidate);
  });
  return candidates;
}

/**
 * Saves or updates a candidate profile in the database.
 */
export async function upsertCandidate(candidate: Candidate) {
  const loc = candidate.location || 'Unknown';
  const name = candidate.name || 'Unknown';
  const candidateId = `${loc.replace(' ', '_')}_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const docRef = doc(db, "candidates", candidateId);
  await setDoc(docRef, {
    ...candidate,
    id: candidateId,
    lastUpdated: serverTimestamp()
  }, { merge: true });
}

/**
 * Marks a candidate's socials as verified.
 */
export async function verifyCandidateSocials(candidateId: string) {
  const docRef = doc(db, "candidates", candidateId);
  await setDoc(docRef, {
    socialsVerified: true,
    lastUpdated: serverTimestamp()
  }, { merge: true });
}

import { BOOTSTRAP_CANDIDATES } from "../constants/electionData";

/**
 * Seeds the Firestore database with the initial bootstrap candidates.
 * Only runs if the database for that location is empty.
 */
export async function seedDatabaseIfEmpty(loc: 'Texas City' | 'La Marque') {
  try {
    const existing = await getCandidatesFromDB(loc);
    if (existing.length === 0) {
      console.log(`Seeding database for ${loc}...`);
      const batch = writeBatch(db);
      BOOTSTRAP_CANDIDATES[loc].forEach((cand) => {
        const candidateId = `${loc.replace(' ', '_')}_${cand.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const candRef = doc(db, "candidates", candidateId);
        batch.set(candRef, {
          ...cand,
          id: candidateId,
          lastUpdated: serverTimestamp()
        });
      });
      await batch.commit();
      console.log(`Seeding complete for ${loc}.`);
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

export async function trackElectionData(loc: 'Texas City' | 'La Marque', bypassCache = false): Promise<ElectionData> {
  const queryBase = `${loc} local elections May 2026`;
  const queryId = loc.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cacheRef = doc(db, "electionIntelligence", queryId);

  try {
    // 0. Ensure database is seeded with baseline if first run
    await seedDatabaseIfEmpty(loc);

    // 1. Load Stable Profiles from DB first
    const dbCandidates = await getCandidatesFromDB(loc);
    
    // 2. Check Intelligence Cache (Dynamic Data)
    if (!bypassCache) {
      const cacheSnap = await getDoc(cacheRef);
      if (cacheSnap.exists()) {
        const cacheData = cacheSnap.data();
        const updatedAt = cacheData.updatedAt?.toDate();
        // Dynamic Intelligence Cache valid for 3 hours
        if (updatedAt && (Date.now() - updatedAt.getTime()) < 3 * 60 * 60 * 1000) {
          const intel = JSON.parse(cacheData.data);
          // Only use DB candidates if they exist, otherwise fallback to cache
          return { ...intel, candidates: dbCandidates.length > 0 ? dbCandidates : intel.candidates };
        }
      }
    }

    // 3. Fallback to AI for Dynamic Intelligence and discovery
    const ai = getAI();
    
    const ROSTER_TC = `
- MAYOR: Keith Henry, Dedrick D. Johnson (INCUMBENT), Abel Garza Jr.
- COMMISSIONER AT-LARGE: Brian Goetschius (RETIRED TCPD, Fiscal Focus), Thelma Bowie, Tim Herd
- DISTRICT 1: DeAndre’ Knoxson, Paul Courville-Morgan Jr., Alex Thompson
- DISTRICT 2: Barbie Tucker, David Zacherl
- DISTRICT 3: Dorthea Jones-Pointer, Chris Sharp, Judith Silva
- DISTRICT 4: Christopher Walters, Jami Clark, Jason Delgado`;

    const ROSTER_LM = `
- COUNCIL DISTRICT B: Joe Compian, Felix Brown, Sade Williams, Jody Richards
- COUNCIL DISTRICT D: Sarah Lowry, Tonia Griffin`;

    const activeRoster = loc === 'Texas City' ? ROSTER_TC : ROSTER_LM;

    const prompt = `Analyze current local elections, campaigns, and public sentiment for strictly: ${loc}, TX.
DO NOT include data for other cities.

SENTIMENT SOURCE MONITORING (MANDATORY):
You must aggregate and weigh data from:
1. Facebook (Local community groups like 'Texas City Talk')
2. X/Twitter (Search hashtags #TexasCity #LaMarque #GalvestonCounty)
3. Nextdoor (Neighborhood specific sentiment)
4. Instagram & TikTok (Youth/Visual campaign engagement)
5. Telegram & Discord (Grassroots/Community chat servers)
6. Galveston County Daily News (Comment sections and editorial letters)
7. Mastodon & Bluesky (Decentralized local discussion)
8. Public City Commission/Council Meeting recordings and public comment logs.

SEARCH & VERIFICATION PROTOCOL (ABSOLUTE TRUTH ONLY):
1. FACTUAL ACCURACY: You are a record-keeping bot. Fictionalizing is a failure. 
2. DEEP LINKING (MANDATORY): Do NOT provide general city or county homepages. 
   - Every source URL MUST be a direct link to a document, official campaign page, or specific news article.
   - If a specific link is not found, state "Direct official source pending."
3. INCUMBENT IDENTITY:
   - TEXAS CITY MAYOR: DEDRICK D. JOHNSON (Incumbent).
   - LA MARQUE MAYOR: KEITH BELL (Incumbent).
4. BIOGRAPHY ACCURACY:
   - BRIAN GOETSCHIUS (Texas City): RETIRED. Focus on Texas Killing Fields (Krystal Baker case) and 2026 campaign stance against CITY DEBT/TRANSPARENCY.
5. LABELLING: Set sourceVerified to true ONLY if confirmed against specific evidence.

CRITICAL CANDIDATE ROSTER FOR ${loc}:
${activeRoster}

For EVERY candidate in the roster, YOU MUST RETURN:
1. name, position, and location: "${loc}".
2. Verified BACKGROUND (approx 80-100 words).
3. EXACTLY 3 specific POLICY STANCES.
4. EXACTLY 2 campaign HIGHLIGHTS.
5. socials (Facebook/Twitter/etc).
6. sources (URLs).
7. sourceVerified: true/false.

CONCISENESS RULES:
- Limit News to EXACTLY 5 high-quality items.
- Limit Patterns and Trends to 4 items each.
- Limit all descriptions to 150 characters max. 
- Keep background summaries dense and factual (approx 80 words).
- Ensure the JSON is valid and fits within standard capacity.

ORGANIZATION: Return as JSON. Use GOOGLE_SEARCH to verify against GalvestonVotes.org and candidate Facebook videos.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: ELECTION_DATA_SCHEMA,
      }
    });

    if (!response.text) {
      throw new Error("No intelligence data received from the model.");
    }

    const freshData = JSON.parse(response.text);

    // 4. Update the Stable Source of Truth (Candidates Collection)
    // We do this asynchronously to keep the UI snappy
    const updateStableStore = async () => {
      try {
        const batch = writeBatch(db);
        freshData.candidates.forEach((cand: Candidate) => {
          const cLoc = cand.location || loc; // Fallback to current city context
          const cName = cand.name || 'Unknown';
          const candidateId = `${cLoc.replace(' ', '_')}_${cName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          const candRef = doc(db, "candidates", candidateId);
          batch.set(candRef, {
            ...cand,
            id: candidateId,
            lastUpdated: serverTimestamp()
          }, { merge: true });
        });
        await batch.commit();
        console.log(`Database synchronized with stable truth for ${freshData.candidates.length} candidates.`);
      } catch (err) {
        console.error("Failed to sync candidate database:", err);
      }
    };
    
    updateStableStore();

    // 5. MERGE LOGIC: Ensure no candidates "disappear" if the AI response is partial
    const mergedCandidates = [...dbCandidates];
    freshData.candidates.forEach((fresh: Candidate) => {
      const idx = mergedCandidates.findIndex(c => c.name === fresh.name);
      if (idx !== -1) {
        mergedCandidates[idx] = { ...mergedCandidates[idx], ...fresh };
      } else {
        mergedCandidates.push(fresh);
      }
    });

    const finalData = { ...freshData, candidates: mergedCandidates };

    // Save to Intel Cache (Dynamic portions)
    await setDoc(cacheRef, {
      query: queryBase,
      data: JSON.stringify(finalData),
      updatedAt: serverTimestamp()
    });

    return finalData;
  } catch (error) {
    console.error("Gemini Intel Error:", error);
    throw error;
  }
}

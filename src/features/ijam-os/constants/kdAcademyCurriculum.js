export const KD_ACADEMY_TRACKS = [
  {
    id: 'builders_sprint',
    title: 'Builders Sprint',
    summary: 'A seven-day fast-start campaign for first-time vibecoders who want to go from zero to shipped prototype.',
    audience: 'General learners, creators, freelancers, and self-starters',
    sourceFolder: 'KDSyllabus/Documents/KDA_Builders',
    completionMode: 'sprint',
    chapters: [
      {
        id: 'builders-awakening',
        title: 'Awakening of the Builder',
        summary: 'Learn the mindset of vibecoding and how to turn ideas into a real build journey.',
        sourceDoc: 'KDA_7Day_Sprint_Builder_Official_Handbook.pdf',
        required: true,
        quests: [
          {
            id: 'mindset-first-build',
            title: 'The First Oath',
            summary: 'Understand why functionality comes before cosmetic polish.',
            lessonId: 'function-over-form',
            objectiveType: 'read',
            xpReward: 15,
            required: true,
            workshopPrompt: 'Ringkaskan mindset utama untuk builder baru dan beri 3 tindakan pertama.'
          },
          {
            id: 'mindset-system-breakdown',
            title: 'Break the Giant',
            summary: 'Learn how to split huge app ideas into smaller systems.',
            lessonId: 'app-vibe-quality',
            objectiveType: 'reflect',
            xpReward: 20,
            required: true,
            unlocksAfter: ['mindset-first-build'],
            workshopPrompt: 'Bantu aku pecahkan idea aplikasi kepada frontend, backend, dan data flow.'
          }
        ]
      },
      {
        id: 'builders-forge',
        title: 'Forge of Setup',
        summary: 'Prepare the developer environment and connect the AI tools that power the academy workflow.',
        sourceDoc: 'KDA_7Day_Sprint_Builder_Program_Summary.docx',
        required: true,
        quests: [
          {
            id: 'builders-setup-node',
            title: 'Forge the Toolkit',
            summary: 'Install the base build environment and confirm the workstation is ready.',
            lessonId: 'setup-environment',
            objectiveType: 'build',
            xpReward: 25,
            required: true,
            workshopPrompt: 'Guide me to verify Node.js and environment setup like a first-time builder.'
          },
          {
            id: 'builders-setup-ai',
            title: 'Bind the AI Core',
            summary: 'Connect the AI key and workflow to your build environment.',
            lessonId: 'setup-ai-api-key',
            objectiveType: 'build',
            xpReward: 25,
            required: true,
            unlocksAfter: ['builders-setup-node'],
            workshopPrompt: 'Explain the safest way to set up the AI API key and verify the connection.'
          }
        ]
      },
      {
        id: 'builders-ship',
        title: 'Path to Launch',
        summary: 'Turn prompts into product output, version the work, and ship it live.',
        sourceDoc: '03-sprint-syllabus-day-by-day.pdf',
        required: true,
        quests: [
          {
            id: 'builders-master-prompt',
            title: 'Summon the Master Prompt',
            summary: 'Craft the core prompt that drives the build workflow.',
            lessonId: 'chatgpt-master-prompt',
            objectiveType: 'build',
            xpReward: 30,
            required: true,
            workshopPrompt: 'Generate a powerful master prompt for my product idea.'
          },
          {
            id: 'builders-antigravity',
            title: 'Enter the Workshop',
            summary: 'Move the plan into the build tool and start generating output.',
            lessonId: 'antigravity-sonnet',
            objectiveType: 'build',
            xpReward: 35,
            required: true,
            unlocksAfter: ['builders-master-prompt'],
            workshopPrompt: 'What should I do right after I paste the master prompt into the coding workspace?'
          },
          {
            id: 'builders-launch',
            title: 'Raise the Skygate',
            summary: 'Push the project to version control and deploy it to the world.',
            lessonId: 'vercel-deploy',
            objectiveType: 'launch',
            xpReward: 50,
            required: true,
            unlocksAfter: ['builders-antigravity'],
            workshopPrompt: 'Help me deploy my first KD Academy project and explain the launch sequence.'
          }
        ]
      }
    ]
  },
  {
    id: 'founder_lab',
    title: 'Founder Lab',
    summary: 'A strategic campaign for builders who want to transform products into ventures and demo-ready prototypes.',
    audience: 'Founders, startup-minded builders, and launch-focused operators',
    sourceFolder: 'KDSyllabus/Documents/KDA_FounderLab',
    completionMode: 'lab',
    chapters: [
      {
        id: 'founder-lab-core',
        title: 'Founder Signals',
        summary: 'Translate builder momentum into a product with strategic clarity.',
        sourceDoc: 'KDA_National_Curriculum_Master_Document.docx',
        required: true,
        quests: [
          {
            id: 'founder-ux-flow',
            title: 'Shape the User Journey',
            summary: 'Design a product flow users can understand and act on.',
            lessonId: 'ux-flow',
            objectiveType: 'build',
            xpReward: 30,
            required: true,
            workshopPrompt: 'Show me how to design the user flow like a founder preparing for launch.'
          },
          {
            id: 'founder-content-copy',
            title: 'Pitch Through Copy',
            summary: 'Write interface copy that explains the product and converts users.',
            lessonId: 'content-copy',
            objectiveType: 'reflect',
            xpReward: 25,
            required: true,
            unlocksAfter: ['founder-ux-flow'],
            workshopPrompt: 'Rewrite my value proposition so it sounds clear and launch-ready.'
          },
          {
            id: 'founder-production',
            title: 'Production Threshold',
            summary: 'Move from preview to production and think like a launch owner.',
            lessonId: 'vercel-production',
            objectiveType: 'launch',
            xpReward: 45,
            required: true,
            unlocksAfter: ['founder-content-copy'],
            workshopPrompt: 'What does a founder need to check before switching a product from preview to production?'
          }
        ]
      }
    ]
  },
  {
    id: 'junior_track',
    title: 'Junior Track',
    summary: 'A friendlier, guided campaign for younger learners and absolute beginners entering digital building for the first time.',
    audience: 'Junior learners and first-time digital makers',
    sourceFolder: 'KDSyllabus/Documents/KDA_Junior',
    completionMode: 'cohort',
    chapters: [
      {
        id: 'junior-basics',
        title: 'First Steps in the Realm',
        summary: 'Understand what an app is, how prompts work, and how interfaces are made.',
        sourceDoc: 'KDA_Junior_Digital_Builder_Track_Handbook.pdf',
        required: true,
        quests: [
          {
            id: 'junior-basic-prompting',
            title: 'Speak to the Machine',
            summary: 'Learn to give simple and effective instructions to AI.',
            lessonId: 'basic-prompting',
            objectiveType: 'read',
            xpReward: 15,
            required: true,
            workshopPrompt: 'Teach me basic prompting like I am brand new to building apps.'
          },
          {
            id: 'junior-asset-basics',
            title: 'Choose the Right Artifact',
            summary: 'Understand the difference between common asset formats used in apps.',
            lessonId: 'asset-format-basics',
            objectiveType: 'read',
            xpReward: 20,
            required: true,
            unlocksAfter: ['junior-basic-prompting'],
            workshopPrompt: 'Explain JPG, PNG, and SVG like I am a beginner in KD Academy.'
          }
        ]
      }
    ]
  },
  {
    id: 'secondary_track',
    title: 'Secondary Track',
    summary: 'A structured, quest-based school progression with more advanced systems, research, and build accountability.',
    audience: 'Secondary students and structured cohorts',
    sourceFolder: 'KDSyllabus/Documents/KDA_Secondary',
    completionMode: 'cohort',
    chapters: [
      {
        id: 'secondary-systems',
        title: 'Systems of the Academy',
        summary: 'Move from visual building into logic, data, and integration.',
        sourceDoc: 'KDA_Secondary_12Week_Teacher_Lesson_Plan.docx',
        required: true,
        quests: [
          {
            id: 'secondary-api-basics',
            title: 'Open the Data Gate',
            summary: 'Learn what an API is and how data moves into an application.',
            lessonId: 'api-basics',
            objectiveType: 'read',
            xpReward: 20,
            required: true,
            workshopPrompt: 'Explain APIs and data flow to a KD Academy secondary learner.'
          },
          {
            id: 'secondary-fetching',
            title: 'Summon Remote Knowledge',
            summary: 'Fetch data into the app and understand response handling.',
            lessonId: 'fetching-basics',
            objectiveType: 'build',
            xpReward: 25,
            required: true,
            unlocksAfter: ['secondary-api-basics'],
            workshopPrompt: 'Show me the beginner workflow for fetching data in an app.'
          },
          {
            id: 'secondary-database',
            title: 'Seal the Data Sanctum',
            summary: 'Connect the product to a database and understand safe key handling.',
            lessonId: 'connect-database',
            objectiveType: 'build',
            xpReward: 35,
            required: true,
            unlocksAfter: ['secondary-fetching'],
            workshopPrompt: 'Guide me through connecting a frontend to a database safely.'
          }
        ]
      }
    ]
  }
];

export const KD_TRACK_ORDER = KD_ACADEMY_TRACKS.map((track) => track.id);

export const KD_JOB_PROFILES = {
  spellcrafter: {
    id: 'spellcrafter',
    title: 'Spellcrafter',
    description: 'A visual tactician who shapes interfaces, motion, and the final feel of a product.',
    recommendedTrackId: 'builders_sprint',
    accent: '#7c3aed'
  },
  runesmith: {
    id: 'runesmith',
    title: 'Runesmith',
    description: 'A systems-minded coder who forges logic, APIs, and data structures into working products.',
    recommendedTrackId: 'founder_lab',
    accent: '#0f766e'
  },
  promptblade: {
    id: 'promptblade',
    title: 'Promptblade',
    description: 'A strategist who knows how to direct AI, shape intent, and turn ambiguity into build momentum.',
    recommendedTrackId: 'builders_sprint',
    accent: '#1d4ed8'
  },
  launchwarden: {
    id: 'launchwarden',
    title: 'Launchwarden',
    description: 'A finisher who turns prototypes into real, public, production-ready experiences.',
    recommendedTrackId: 'founder_lab',
    accent: '#ea580c'
  },
  flowkeeper: {
    id: 'flowkeeper',
    title: 'Flowkeeper',
    description: 'An orchestrator who sees the full system and keeps product, data, and execution aligned.',
    recommendedTrackId: 'secondary_track',
    accent: '#2563eb'
  }
};

export function getTrackById(trackId) {
  return KD_ACADEMY_TRACKS.find((track) => track.id === trackId) || KD_ACADEMY_TRACKS[0];
}

export function getQuestById(questId) {
  for (const track of KD_ACADEMY_TRACKS) {
    for (const chapter of track.chapters) {
      const quest = chapter.quests.find((item) => item.id === questId);
      if (quest) return { quest, chapter, track };
    }
  }
  return null;
}

export function getFirstQuestForTrack(trackId) {
  const track = getTrackById(trackId);
  return track.chapters[0]?.quests[0] || null;
}

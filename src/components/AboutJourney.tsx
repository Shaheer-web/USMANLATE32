import React from 'react';
import { 
  BookOpen, 
  Compass, 
  MapPin, 
  Phone, 
  Users, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Heart,
  Globe2
} from 'lucide-react';

export const AboutJourney: React.FC = () => {
  const MAPS_URL = 'https://www.google.com/maps?ll=24.917996,67.036175&z=17&t=h&hl=en&gl=US&mapclient=embed&cid=11437611818856333896';

  const coreValues = [
    {
      num: 1,
      title: 'Taqwa (Fear of Allah)',
      arabic: 'تَقْوَىٰ',
      content:
        'Being a Muslim it is our responsibility that we will try to achieve highest degree of تقوی ٰ in ourselves which may be displayed in our actions, attitudes and thoughts. We will instil love for Allah, fear of Allah, obedience to Allah only and seek His pleasure. Therefore we abstain every kind of evils and enjoin good deeds. All the members of UPSS will try to achieve highest degree of تقوی ٰ in themselves.',
      icon: Award,
    },
    {
      num: 2,
      title: 'Following Prophet Muhammad خاتم النبیین ﷺ as Role Model',
      arabic: 'أُسْوَةٌ حَسَنَةٌ',
      content:
        'The Rasoolullah صلى الله عليه وسلم carried out the moral revolution and presented himself as model before Ummah. Today the Muslim Ummah can revive its acme by following the role model of Seerat e Tayyaba. All members of UPSS must be following the way of Rasoolullah صلى الله عليه وسلم in their daily life to revive his Sunnah. They will try to develop his personality traits such as honesty, modesty, humility, trustworthiness, dignity.',
      icon: Compass,
    },
    {
      num: 3,
      title: 'Enjoining good and forbidding evil',
      arabic: 'الْأَمْرُ بِالْمَعْرُوفِ وَالنَّهْيُ عَنِ الْمُنكَرِ',
      content:
        'It is the prime objective of Muslim Ummah to enjoin what is good and forbid what is evil. We will achieve this goal by fostering sincerity, courage, determination, straightforwardness and required capability. All members of UPSS will try to enjoin good deeds and spread the message of Allah.',
      icon: ShieldCheck,
    },
    {
      num: 4,
      title: 'Research and Explore',
      arabic: 'البحث والاستكشاف',
      content:
        'People who rule the world are those who act according to research and exploration instead of static thought. Allah SWT has instructed every one to ponder over His creations to be able to compete with the rest of the World. All members of UPSS will improve their skills and competencies like creative and critical thinking, problem solving skills, collaborative and communication skills.',
      icon: BookOpen,
    },
    {
      num: 5,
      title: 'Service of Mankind',
      arabic: 'خِدْمَةُ الْإِنْسَانِيَّةِ',
      content:
        'Every creation is member of Allah’s family. Allah loves those who care for all of His creations. We will develop an environment of cooperation and collaboration among each other. All the members of UPSS will value humanity. They will help others and donate generously in the way of Allah.',
      icon: Heart,
    },
    {
      num: 6,
      title: 'Protection of Ideology of Pakistan',
      arabic: 'حِمَايَةُ فِكْرَةِ بَاكِسْتَان',
      content:
        'Pakistan was founded on the basis of Islamic ideology. Therefore Muslim Ummah sees Pakistan as Fort of Islam. All members of UPSS will strive for the protection of Ideology of Pakistan. They will practically work for the establishment of the Islamic society in Pakistan.',
      icon: Globe2,
    },
  ];

  const disciplineRules = [
    'Punctuality is mandatory; students must cross the main gate before the morning assembly bell.',
    'Uniform must strictly adhere to the designated campus code with complete modesty.',
    'Maintaining perfect ethics, respectful speech, and clean behavior in accordance with Islamic values is essential.',
  ];

  return (
    <div className="space-y-10">
      {/* Historical Background & Journey Banner */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-emerald-100/50 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Building className="w-3.5 h-3.5" />
              <span>Legacy of Islamic Academic Excellence</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-serif text-emerald-950 mb-4 tracking-tight">
              ABOUT OUR JOURNEY
            </h2>

            <p className="text-slate-700 text-sm md:text-base leading-relaxed font-normal">
              "The first campus of Usman Public School System was established in 1989. Alhamdulillah, at present, it has 53 running campuses and more than 24500 students. The Usman Public School System is an establishment where great emphasis is given to Islamic moral values and basic ethics without compromising on high academic standards."
            </p>
          </div>

          {/* Official Circular Logo & Channel Badge */}
          <div className="flex-shrink-0 flex flex-col items-center p-4 bg-emerald-950 text-white rounded-2xl border-2 border-amber-500 shadow-lg text-center max-w-xs w-full lg:w-auto">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-white shadow-md mb-2">
              <img
                src="/upss-logo.jpg"
                alt="Usman Public School System Official Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://yt3.googleusercontent.com/5hpubYiQhsYGv5Z0TQeT4QC2eG1W84B9IpUHQh0vZFmPfnkDTeiY04SWdsgJm04yfbFpbxaYew=s900-c-k-c0x00ffffff-no-rj';
                }}
              />
            </div>
            <span className="font-serif font-bold text-sm text-white">Usman Public School System</span>
            <span className="text-[11px] text-amber-300 font-medium">Campus 32 &bull; Nazimabad</span>
            <a
              href="https://www.youtube.com/c/UsmanPublicSchoolSystem"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
            >
              <span>YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#f5f8f5] border border-emerald-900/10">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Founded</span>
              <span className="text-xl font-bold text-emerald-950 font-serif">1989</span>
              <span className="text-[11px] text-emerald-700 block mt-0.5">37+ Years of Service</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f5f8f5] border border-emerald-900/10">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Active Campuses</span>
              <span className="text-xl font-bold text-emerald-950 font-serif">53 Campuses</span>
              <span className="text-[11px] text-emerald-700 block mt-0.5">Karachi & Regions</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f5f8f5] border border-emerald-900/10">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Student Body</span>
              <span className="text-xl font-bold text-emerald-950 font-serif">24,500+</span>
              <span className="text-[11px] text-emerald-700 block mt-0.5">Enrolled Learners</span>
            </div>
          </div>
      </section>

      {/* Core Values Section */}
      <section className="space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Foundational Pillars</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-emerald-950 mt-1">
            Core Values
          </h2>
          <p className="text-xs text-slate-500">
            The philosophical and ethical framework guiding every teacher, administrator, and student at UPSS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coreValues.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.num}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                        0{value.num}
                      </div>
                      <h3 className="font-bold text-base text-emerald-950 font-serif">
                        {value.title}
                      </h3>
                    </div>
                    <span className="text-xs font-serif text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 whitespace-nowrap">
                      {value.arabic}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
                    {value.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Campus 32 Information & Map Integration */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-amber-500/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
              <Building className="w-3.5 h-3.5" />
              <span>Dedicated Campus Details</span>
            </div>

            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
              Campus 32 Information
            </h2>

            <div className="space-y-3 text-sm text-emerald-100">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-emerald-300 uppercase font-bold block">Address</span>
                  <p className="font-semibold text-white">4-G 9/6, Nazimabad No. 4, Karachi</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-emerald-300 uppercase font-bold block">Telephone</span>
                  <p className="font-semibold text-white font-mono">021-37445245</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                <Users className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-emerald-300 uppercase font-bold block">Academic Scope</span>
                  <p className="font-semibold text-white">Class VI to Class X (Girls Only)</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs md:text-sm shadow-md transition cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-950" />
                <span>Open Campus 32 in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-950 ml-1" />
              </a>
            </div>
          </div>

          {/* Map Preview Graphic & Quick Coordinates card */}
          <div className="lg:col-span-5 bg-emerald-900/70 border border-emerald-600/40 rounded-2xl p-5 backdrop-blur-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Geographical Location
              </span>
              <span className="text-[11px] font-mono text-emerald-300">24.917996, 67.036175</span>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-emerald-700/80 bg-emerald-950 h-44 flex items-center justify-center p-4 text-center">
              {/* Decorative map grid background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px]"></div>
              
              <div className="relative z-10 space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mx-auto shadow-md">
                  <MapPin className="w-6 h-6 text-amber-300 animate-bounce" />
                </div>
                <div className="text-xs font-bold text-white font-serif">
                  Usman Public School System (Campus 32)
                </div>
                <p className="text-[11px] text-emerald-200">
                  Nazimabad No. 4, Karachi, Pakistan
                </p>
              </div>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-600/40 text-xs font-semibold text-emerald-200 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span>View Satellite & Street Navigation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* School Environment & Discipline Rules */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-900/10">
        <div className="border-b border-slate-200 pb-3 mb-6">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Campus Code of Conduct</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-emerald-950 mt-1">
            School Environment & Discipline Rules
          </h2>
          <p className="text-xs text-slate-500">
            Strict adherence is mandated for all enrolled students across morning arrivals and campus sessions.
          </p>
        </div>

        <div className="space-y-3">
          {disciplineRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-3.5"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                {idx + 1}
              </div>
              <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

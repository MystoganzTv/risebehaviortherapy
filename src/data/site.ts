/**
 * Single source of truth for all business information on the site.
 * Edit values here and they update everywhere (header, footer, schema.org, forms).
 */

export const site = {
  name: 'Rise Behavior Therapy',
  legalName: 'Rise Behavior Therapy LLC',
  tagline: 'Building Potential. Inspiring Futures.',
  url: 'https://risebehaviortherapy.com',
  description:
    'BCBA-owned ABA therapy in Florida and Virginia, with locations in Miami Lakes, FL and Herndon, VA. Individualized care and family support. Most insurance accepted.',
};

export const contact = {
  phone: '+1 (786) 566-5863',
  phoneHref: 'tel:+17865665863',
  phoneRaw: '+17865665863',
  fax: '+1 (786) 551-5931',
  email: 'Info@risebehaviortherapy.com',
  emailHref: 'mailto:Info@risebehaviortherapy.com',
  address: {
    street: '5901 NW 151st Street, Suite 206',
    city: 'Miami Lakes',
    state: 'FL',
    zip: '33014',
    full: '5901 NW 151st Street, Suite 206, Miami Lakes, FL 33014',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=5901+NW+151st+Street+Suite+206+Miami+Lakes+FL+33014',
    embedUrl:
      'https://www.google.com/maps?q=5901+NW+151st+St+Suite+206,+Miami+Lakes,+FL+33014&output=embed',
  },
  hours: [
    { days: 'Monday – Friday', time: '9:00 AM – 5:00 PM' },
    { days: 'Saturday – Sunday', time: 'Closed' },
  ],
  social: {
    instagram: '', // e.g. https://instagram.com/risebehaviortherapy
    facebook: '',
    linkedin: '',
  },
};

export const locations = [
  {
    id: 'miami-lakes',
    city: 'Miami Lakes',
    stateName: 'Florida',
    address: contact.address,
  },
  {
    id: 'herndon',
    city: 'Herndon',
    stateName: 'Virginia',
    address: {
      street: '205 Van Buren St',
      city: 'Herndon',
      state: 'VA',
      zip: '20170',
      full: '205 Van Buren St, Herndon, VA 20170',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=205+Van+Buren+St+Herndon+VA+20170',
      embedUrl:
        'https://www.google.com/maps?q=205+Van+Buren+St+Herndon+VA+20170&output=embed',
    },
  },
];

/**
 * Form handling. Free endpoint from https://web3forms.com — create an access key
 * with Info@risebehaviortherapy.com and paste it below. Until then, forms fall
 * back to opening the visitor's email client so no lead is ever lost.
 */
export const forms = {
  accessKey: '', // <-- paste Web3Forms access key here
};

export const founders = [
  {
    name: 'Mauricio Marti Padron',
    credentials: 'BCBA',
    role: 'Co-Founder & Clinical Director',
    photo: 'male' as const,
    bio: [
      'Board Certified Behavior Analyst and Clinical Director of Rise Behavior Therapy, with a career built on one belief: every child deserves a program designed around who they actually are, not around a template.',
      'Mauricio leads clinical quality across the practice — program design, caregiver training and staff development for our center-based, in-home and school-based services.',
    ],
  },
  {
    name: 'Adamarys Valdes Martinez',
    credentials: 'BCBA',
    role: 'Co-Founder',
    photo: 'female' as const,
    bio: [
      'Board Certified Behavior Analyst and Co-Founder of Rise Behavior Therapy, working alongside families from the first phone call through every milestone that follows.',
      'Adamarys keeps the family experience at the center of the practice — intake, insurance authorization and communication — so parents can focus on their child instead of on paperwork.',
    ],
  },
];

export const facts = {
  ages: '2 to 20 years old',
  agesShort: 'Ages 2–20',
  serviceArea: 'Florida and Virginia',
  serviceAreaLong:
    'We serve families across Florida, with our center located in Miami Lakes.',
};

export const services = [
  {
    slug: 'aba-therapy',
    title: 'ABA Therapy',
    short: 'Individualized ABA programs designed to build skills and increase independence.',
    icon: 'aba',
    body: 'Every program starts with a comprehensive assessment and is written for one child — never copied from a template. Goals are measurable, reviewed continuously, and adjusted as your child grows. All programming is designed and supervised by a Board Certified Behavior Analyst.',
    points: [
      'Comprehensive functional and skills assessment',
      'Individualized treatment plan with measurable goals',
      'Weekly BCBA supervision and data review',
      'Progress reports and reauthorization support',
    ],
  },
  {
    slug: 'early-intervention',
    title: 'Early Intervention',
    short: 'Supporting children in their early years for a strong start and brighter future.',
    icon: 'early',
    body: 'The earlier we start, the more we can change. Our early intervention programming focuses on communication, joint attention, play, imitation and tolerance — the foundational repertoires that make everything after them possible.',
    points: [
      'Naturalistic, play-based teaching',
      'Communication and requesting from day one',
      'Parent coaching built into every session',
      'School-readiness and transition planning',
    ],
  },
  {
    slug: 'skill-building',
    title: 'Skill Building',
    short:
      'Focused work on communication, social skills, behavior management, academics and daily living.',
    icon: 'skills',
    body: 'Skills are taught where they will actually be used. We break long-term outcomes into teachable steps, then generalize them across people, settings and materials so progress holds up outside of a session.',
    points: [
      'Functional communication and language',
      'Social skills and peer interaction',
      'Daily living, self-care and independence',
      'Academic readiness and attending',
    ],
  },
  {
    slug: 'parent-training',
    title: 'Parent & Caregiver Training',
    short:
      'Empowering families with tools and strategies to support their child’s success at home.',
    icon: 'parent',
    body: 'You are with your child far more than we are, and that is an advantage. Caregiver training gives you the same strategies our team uses — explained plainly, practiced together, and adapted to your actual routines.',
    points: [
      'Hands-on coaching, not lectures',
      'Strategies for mealtimes, bedtime and transitions',
      'Behavior support plans you can actually run',
      'Ongoing check-ins and adjustments',
    ],
  },
  {
    slug: 'compassionate-care',
    title: 'Compassionate Care',
    short:
      'A caring team dedicated to creating meaningful progress and lasting impact.',
    icon: 'heart',
    body: 'Assent-based, dignity-first practice is not a marketing line here — it is how we train our team. We follow the child’s lead, prioritize rapport before demands, and choose goals that matter to the family, not just to a data sheet.',
    points: [
      'Assent-based, trauma-informed practice',
      'Goals chosen with the family, not for them',
      'Low caseloads and consistent staffing',
      'Open communication with your whole care team',
    ],
  },
];

export const settings = [
  {
    title: 'Center-Based',
    short: 'At our clinic',
    body: 'A structured, low-distraction environment purpose-built for learning, with natural opportunities for peer interaction and school-readiness practice.',
    icon: 'center',
  },
  {
    title: 'In-Home',
    short: 'At your home',
    body: 'Therapy in the environment where skills matter most — mealtimes, routines, siblings, and the real triggers of a real day. Caregivers are part of every session.',
    icon: 'home',
  },
  {
    title: 'School & Community',
    short: 'Where their day happens',
    body: 'Support in the classroom and in the community, coordinated with teachers and school staff so strategies stay consistent across every setting.',
    icon: 'school',
  },
];

export const steps = [
  {
    n: '01',
    title: 'Reach out',
    body: 'Call us or send the form. We will ask a few short questions about your child, your schedule and your insurance — usually under ten minutes.',
  },
  {
    n: '02',
    title: 'We verify your benefits',
    body: 'We check your coverage and explain, in plain language, what is covered and what your out-of-pocket looks like. There is no cost for this step.',
  },
  {
    n: '03',
    title: 'Assessment',
    body: 'A BCBA meets with you and your child, completes a comprehensive assessment, and builds an individualized treatment plan with goals you help choose.',
  },
  {
    n: '04',
    title: 'Therapy begins',
    body: 'Sessions start in the setting that fits your family. You get regular updates, ongoing caregiver training, and a BCBA who is genuinely reachable.',
  },
];

export const insurances = [
  'Medicaid',
  'Sunshine Health',
  'Simply Healthcare',
  'Molina Healthcare',
  'Aetna',
  'Cigna',
  'UnitedHealthcare / Optum',
  'Florida Blue / BCBS',
  'Humana',
  'Private Pay',
];

// General ABA overview: https://www.cdc.gov/autism/treatment/index.html
// Plan-specific coverage and location-specific availability are confirmed at intake.
export const faqs = [
  {
    q: 'What is ABA therapy?',
    a: 'Applied Behavior Analysis (ABA) is an approach to understanding learning and behavior. It uses structured teaching and positive reinforcement to work on skills such as communication and daily routines. At Rise, goals are chosen around individual needs, and progress is reviewed to guide the plan.',
  },
  {
    q: 'What ages do you serve?',
    a: 'Our programs support children, adolescents, and adults. Tell us the age of the person seeking services and your preferred location so we can discuss the options available for their needs.',
  },
  {
    q: 'Do you accept my insurance?',
    a: 'Coverage depends on your insurance plan, the service requested, and the location. Contact our team to discuss your plan and the benefits verification process, including any authorization requirements or possible out-of-pocket costs.',
  },
  {
    q: 'Do I need a diagnosis or referral before contacting you?',
    a: 'You can reach out with questions before you have all your paperwork. Requirements for starting services depend on your insurance plan and the service requested. Our team can help clarify what documentation is needed and explain the next steps.',
  },
  {
    q: 'Can therapy take place at home or at school?',
    a: 'Rise offers home-based ABA, center-based care, and school support. The available options depend on your location, individual needs, coverage, and team availability. We can discuss which setting may fit your family during the initial conversation.',
  },
  {
    q: 'Where are your locations, and what services are available?',
    a: `You can find us in ${locations.map((location) => `${location.city}, ${location.stateName}, at ${location.address.street} (${location.address.zip})`).join('; and ')}. Contact our team to confirm the services and appointment availability at your preferred location. The Locations section includes a map for each address.`,
  },
  {
    q: 'How soon can services begin?',
    a: 'Timing depends on scheduling, assessments, any required insurance authorization, and staff availability. Share your preferred location and schedule with us so we can explain the current steps and availability for your situation.',
  },
  {
    q: 'How do I get started?',
    a: `Call ${contact.phone} or use the contact form below. We will talk through what you are looking for, answer your questions, and explain the next steps. Please keep medical records and sensitive health details out of the website form; ask our team how to share any required documents.`,
  },
];

export const jobs = [
  {
    title: 'Board Certified Behavior Analyst (BCBA)',
    type: 'Full-time / Part-time',
    location: 'Miami Lakes, FL',
    blurb:
      'Manageable caseloads, real clinical autonomy, and leadership that is still in the field. Center, in-home and school-based options available.',
  },
  {
    title: 'Registered Behavior Technician (RBT)',
    type: 'Full-time / Part-time',
    location: 'Miami Lakes & across Florida',
    blurb:
      'Consistent hours, paid training, and a BCBA who actually answers the phone. Growth path toward BCaBA and BCBA supported.',
  },
  {
    title: 'Behavior Technician (RBT training provided)',
    type: 'Part-time',
    location: 'Florida',
    blurb:
      'New to the field? We will train and certify you. Bring reliability and a genuine interest in kids; we will handle the rest.',
  },
];

export const nav = [
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Getting Started', href: '/getting-started/' },
  { label: 'Insurance', href: '/insurance/' },
  { label: 'Resources', href: '/resources/' },
  { label: 'Careers', href: '/careers/' },
];

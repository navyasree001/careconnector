import { Language } from '../types';

export interface TranslationSchema {
  common: {
    appName: string;
    tagline: string;
    vizag: string;
    loading: string;
    save: string;
    cancel: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    directions: string;
    call: string;
    room: string;
    mins: string;
    km: string;
    offlineMode: string;
    demoModeBadge: string;
    change: string;
    viewAll: string;
    refresh: string;
  };
  auth: {
    chooseRoleTitle: string;
    chooseRoleSubtitle: string;
    patientRole: string;
    patientRoleDesc: string;
    hospitalRole: string;
    hospitalRoleDesc: string;
    enterMobile: string;
    fullName: string;
    namePlaceholder: string;
    mobilePlaceholder: string;
    sendOtp: string;
    enterOtp: string;
    otpHint: string;
    verifyOtp: string;
    demoPatientBtn: string;
    selectLocation: string;
    detectGps: string;
    orChooseArea: string;
    hospitalLoginTitle: string;
    signInTab: string;
    createAccountTab: string;
    username: string;
    password: string;
    confirmPassword: string;
    selectHospital: string;
    contactPerson: string;
    signInBtn: string;
    createAccountBtn: string;
    useDemoHospital: string;
    demoCredentialsHint: string;
    logout: string;
    invalidCredentials: string;
    hospitalAlreadyHasAccount: string;
    usernameTaken: string;
  };
  nav: {
    home: string;
    hospitals: string;
    queue: string;
    alerts: string;
    settings: string;
    dashboard: string;
  };
  home: {
    emergencyCallout: string;
    micPrompt: string;
    micListening: string;
    textPlaceholder: string;
    checkAvailability: string;
    quickSymptomsTitle: string;
    activeTokenTitle: string;
    noActiveToken: string;
    nearestHospitalsTitle: string;
    locationLabel: string;
    disclaimer: string;
  };
  symptoms: {
    fever: string;
    chestPain: string;
    childUnwell: string;
    pregnancy: string;
    injury: string;
    skin: string;
    eye: string;
    tooth: string;
    stomach: string;
    breathing: string;
  };
  triage: {
    analyzing: string;
    title: string;
    symptomsIdentified: string;
    specialtyRecommended: string;
    urgencyTitle: string;
    emergency: string;
    urgent: string;
    routine: string;
    listenToGuidance: string;
    emergencyBanner: string;
    emergencyCall108: string;
    emergencyCall112: string;
    topHospitalsTitle: string;
    reasonBadge: string;
    viewDoctors: string;
    medicalDisclaimer: string;
  };
  hospitals: {
    title: string;
    searchPlaceholder: string;
    filterAll: string;
    filterEmergency: string;
    filterGovt: string;
    filterPrivate: string;
    sortDistance: string;
    sortWait: string;
    sortRating: string;
    listView: string;
    mapView: string;
    noResults: string;
    openNow: string;
    icuAvailable: string;
    emergency247: string;
    doctorsCount: string;
    patientsWaiting: string;
  };
  hospitalDetail: {
    about: string;
    departments: string;
    facilities: string;
    hours: string;
    doctorsHeader: string;
    howBookingWorksTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  doctorDetail: {
    qualification: string;
    experience: string;
    fee: string;
    spokenLanguages: string;
    statusAvailable: string;
    statusBusy: string;
    statusUnavailable: string;
    runningLateBanner: string;
    timelineTitle: string;
    arrivesAt: string;
    consultStarts: string;
    expectedDeparture: string;
    selectSlotTitle: string;
    slotWindowRule: string;
    slotRuleNote: string;
    avgTimePerPatient: string;
    arriveEarlyNotice: string;
    bookSlotBtn: string;
    slotAvailable: string;
    slotFull: string;
    slotSelected: string;
  };
  booking: {
    title: string;
    confirmDetails: string;
    patientName: string;
    patientAge: string;
    phoneLabel: string;
    symptomSummary: string;
    whatsappConsentLabel: string;
    confirmBookingBtn: string;
    successTitle: string;
    opTokenBadge: string;
    scanQrNotice: string;
    whatsappPreviewTitle: string;
    sendToMyWhatsapp: string;
    addToCalendar: string;
    getDirections: string;
    trackQueueBtn: string;
  };
  liveQueue: {
    title: string;
    nowServing: string;
    yourToken: string;
    patientsAhead: string;
    waitingTotal: string;
    estimatedWait: string;
    expectedTurn: string;
    arriveBy: string;
    leaveHomeBy: string;
    statusRelax: string;
    statusGetReady: string;
    statusStartNow: string;
    statusReached: string;
    statusYourTurn: string;
    statusCompleted: string;
    statusDelayed: string;
    statusDoctorBusy: string;
    statusDoctorUnavailable: string;
    rebookBtn: string;
  };
  rebook: {
    title: string;
    doctorUnavailableDesc: string;
    reasonLabel: string;
    keepWaitBtn: string;
    alternativeDoctorsTitle: string;
    moveSlotBtn: string;
    successMoved: string;
  };
  alerts: {
    title: string;
    tabInApp: string;
    tabWhatsapp: string;
    enableNotifications: string;
    noAlerts: string;
    simulatedDisclaimer: string;
    markAllRead: string;
  };
  appointments: {
    title: string;
    emptyAppointments: string;
    reschedule: string;
    cancelAppointment: string;
    confirmCancel: string;
    cancelledBadge: string;
    completedBadge: string;
    activeBadge: string;
  };
  settings: {
    title: string;
    language: string;
    location: string;
    simpleMode: string;
    simpleModeDesc: string;
    demoControls: string;
    demoTime: string;
    simSpeed: string;
    pauseResume: string;
    advance15: string;
    resetDemoData: string;
    logoutBtn: string;
  };
  hospitalPortal: {
    title: string;
    portalName: string;
    summaryTokensToday: string;
    summaryCompleted: string;
    summaryWaiting: string;
    summaryDoctorsAvailable: string;
    summaryPatientsNotified: string;
    tabLiveQueue: string;
    tabDoctors: string;
    tabAppointments: string;
    tabSentAlerts: string;
    tabDemo: string;
    autoRunQueueLabel: string;
    autoRunQueueDesc: string;
    completeAndCallNext: string;
    issueWalkInToken: string;
    setServingToken: string;
    tokenBoardTitle: string;
    filterTokenAll: string;
    markAvailable: string;
    markBusy: string;
    markUnavailable: string;
    reasonPrompt: string;
    delayConsultation: string;
    customMinutes: string;
    changeSchedule: string;
    arrival: string;
    consultStart: string;
    departure: string;
    saveAndNotify: string;
    patientsAffectedWarning: string;
    patientsNotifiedToast: string;
  };
  templates: {
    bookingConfirmed: {
      title: string;
      body: string;
      whatsapp: string;
    };
    doctorArrivalExpected: {
      title: string;
      body: string;
      whatsapp: string;
    };
    doctorArrived: {
      title: string;
      body: string;
      whatsapp: string;
    };
    reminder60m: {
      title: string;
      body: string;
      whatsapp: string;
    };
    ahead5: {
      title: string;
      body: string;
      whatsapp: string;
    };
    startNow: {
      title: string;
      body: string;
      whatsapp: string;
    };
    turnApproaching: {
      title: string;
      body: string;
      whatsapp: string;
    };
    nowServing: {
      title: string;
      body: string;
      whatsapp: string;
    };
    completed: {
      title: string;
      body: string;
      whatsapp: string;
    };
    docDelayed: {
      title: string;
      body: string;
      whatsapp: string;
    };
    docBusy: {
      title: string;
      body: string;
      whatsapp: string;
    };
    docUnavailable: {
      title: string;
      body: string;
      whatsapp: string;
    };
    docAvailable: {
      title: string;
      body: string;
      whatsapp: string;
    };
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    common: {
      appName: 'CareConnect',
      tagline: 'Smart Healthcare Navigation & OP Booking',
      vizag: 'Visakhapatnam (Vizag)',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      directions: 'Directions',
      call: 'Call',
      room: 'Room',
      mins: 'mins',
      km: 'km',
      offlineMode: 'Offline Rules Active',
      demoModeBadge: 'Demo Mode',
      change: 'Change',
      viewAll: 'View All',
      refresh: 'Refresh',
    },
    auth: {
      chooseRoleTitle: 'Welcome to CareConnect',
      chooseRoleSubtitle: 'Smart hospital navigation & live OP queue tracking in Visakhapatnam',
      patientRole: 'Patient / User Login',
      patientRoleDesc: 'Consult AI assistant, book doctor slots & track live OP token on WhatsApp',
      hospitalRole: 'Hospital Staff Portal',
      hospitalRoleDesc: 'Manage live tokens, update doctor schedules & notify waiting patients instantly',
      enterMobile: 'Enter Patient Details',
      fullName: 'Full Name',
      namePlaceholder: 'e.g. Ramesh Kumar',
      mobilePlaceholder: '10-digit mobile number',
      sendOtp: 'Continue with OTP',
      enterOtp: 'Enter Verification Code',
      otpHint: 'Demo mode: your OTP is {otp}',
      verifyOtp: 'Verify & Enter',
      demoPatientBtn: '⚡ Quick Demo Patient Login',
      selectLocation: 'Your Current Area in Vizag',
      detectGps: 'Detect Live Location (GPS)',
      orChooseArea: 'Or choose your locality',
      hospitalLoginTitle: 'Hospital Management Login',
      signInTab: 'Sign In',
      createAccountTab: 'Create Account',
      username: 'Hospital Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      selectHospital: 'Select Hospital',
      contactPerson: 'Contact Person / Designation',
      signInBtn: 'Sign In to Portal',
      createAccountBtn: 'Register Hospital Account',
      useDemoHospital: '⚡ Use Demo Hospital (Sagar Care)',
      demoCredentialsHint: 'Demo credentials: username "sagarcare" / password "demo1234"',
      logout: 'Log Out',
      invalidCredentials: 'Invalid username or password. Please try again.',
      hospitalAlreadyHasAccount: 'This hospital already has a registered account. Please sign in.',
      usernameTaken: 'This username is already taken. Please choose another.',
    },
    nav: {
      home: 'Home',
      hospitals: 'Hospitals',
      queue: 'Live Queue',
      alerts: 'Alerts',
      settings: 'Settings',
      dashboard: 'Dashboard',
    },
    home: {
      emergencyCallout: 'Emergency? Call 108 (Ambulance) or 112 (Disaster/Emergency)',
      micPrompt: "Describe what's wrong (Speak or Type)",
      micListening: 'Listening to your symptoms... speak clearly',
      textPlaceholder: 'e.g. "Severe chest pain radiating to left arm" or "High fever since 2 days"',
      checkAvailability: 'Analyze & Find Care',
      quickSymptomsTitle: 'Common Conditions',
      activeTokenTitle: 'Your Active OP Token',
      noActiveToken: 'No active booking. Search or tap below to find a doctor.',
      nearestHospitalsTitle: 'Hospitals Near You in Vizag',
      locationLabel: 'Your Location',
      disclaimer: 'Guidance only, not a formal medical diagnosis. In critical situations, dial 108.',
    },
    symptoms: {
      fever: 'Fever & Chills',
      chestPain: 'Chest Pain / Pressure',
      childUnwell: 'Child Unwell / Pediatric',
      pregnancy: 'Pregnancy & Maternity',
      injury: 'Bone / Trauma Injury',
      skin: 'Skin Rash & Itching',
      eye: 'Eye Pain & Vision',
      tooth: 'Toothache & Dental',
      stomach: 'Stomach Pain / Vomiting',
      breathing: 'Shortness of Breath',
    },
    triage: {
      analyzing: 'Evaluating your symptoms with CareConnect AI...',
      title: 'Triage Assessment & Care Guidance',
      symptomsIdentified: 'Identified Symptoms',
      specialtyRecommended: 'Recommended Specialty',
      urgencyTitle: 'Urgency Level',
      emergency: 'Emergency (Immediate Attention)',
      urgent: 'Urgent (Consult within 24 Hours)',
      routine: 'Routine (Scheduled Appointment)',
      listenToGuidance: 'Listen Guidance',
      emergencyBanner: 'CRITICAL ALERT: Your symptoms suggest a potential medical emergency. Please seek immediate hospital care or dial 108.',
      emergencyCall108: 'Call 108 Ambulance',
      emergencyCall112: 'Call 112 Emergency',
      topHospitalsTitle: 'Recommended Vizag Hospitals',
      reasonBadge: 'Why recommended',
      viewDoctors: 'View Available Doctors',
      medicalDisclaimer: 'Notice: This is AI healthcare navigation guidance and does not replace professional medical diagnosis. Call 108 in emergencies.',
    },
    hospitals: {
      title: 'Hospitals in Visakhapatnam',
      searchPlaceholder: 'Search hospitals, localities, specialties...',
      filterAll: 'All Hospitals',
      filterEmergency: '24x7 Emergency',
      filterGovt: 'Government',
      filterPrivate: 'Private',
      sortDistance: 'Nearest First',
      sortWait: 'Shortest Wait',
      sortRating: 'Highest Rated',
      listView: 'List',
      mapView: 'Map',
      noResults: 'No hospitals match your search criteria.',
      openNow: 'Open Now',
      icuAvailable: 'ICU Ready',
      emergency247: '24x7 Trauma',
      doctorsCount: 'doctors',
      patientsWaiting: 'waiting',
    },
    hospitalDetail: {
      about: 'Overview & Facilities',
      departments: 'Specialty Departments',
      facilities: 'Key Facilities',
      hours: 'OPD Hours',
      doctorsHeader: 'Available Doctors & Live OP Status',
      howBookingWorksTitle: 'How CareConnect Booking Works',
      step1Title: '1. Pick Doctor & 20-min Slot',
      step1Desc: 'Choose an available OPD slot. Arrive at least 15 minutes before your turn.',
      step2Title: '2. Instant Token on WhatsApp',
      step2Desc: 'Get your OP token number, QR code and live updates directly on your mobile.',
      step3Title: '3. Track Queue Live from Home',
      step3Desc: 'We alert you exactly when to start your journey so you avoid crowded waiting halls.',
    },
    doctorDetail: {
      qualification: 'Qualification',
      experience: 'Experience',
      fee: 'Consultation Fee',
      spokenLanguages: 'Languages',
      statusAvailable: 'Available (Consulting)',
      statusBusy: 'Busy with procedure / rounds',
      statusUnavailable: 'Unavailable / Out',
      runningLateBanner: 'Dr. {doctor} is running {min} minutes late today.',
      timelineTitle: "Today's OPD Schedule",
      arrivesAt: 'Arrives at Hospital',
      consultStarts: 'OPD Consultation Begins',
      expectedDeparture: 'Expected Departure',
      selectSlotTitle: 'Select an OP Slot (20-Minute Window)',
      slotWindowRule: 'Each window is 20 minutes (~{avg} mins per patient). Fee: ₹{fee}.',
      slotRuleNote: 'Same-day slots are bookable only if starting at least 20 minutes from current time.',
      avgTimePerPatient: '~{avg} min / patient',
      arriveEarlyNotice: 'Please arrive 15 minutes before your slot time.',
      bookSlotBtn: 'Book OP Slot & Get Token',
      slotAvailable: 'Available',
      slotFull: 'Full',
      slotSelected: 'Selected',
    },
    booking: {
      title: 'Confirm Outpatient (OP) Booking',
      confirmDetails: 'Appointment Details',
      patientName: 'Patient Name',
      patientAge: 'Patient Age',
      phoneLabel: 'Mobile Number',
      symptomSummary: 'Health Issue / Chief Complaint',
      whatsappConsentLabel: 'Send OP token, live wait time and travel reminders to my WhatsApp',
      confirmBookingBtn: 'Confirm & Generate OP Token',
      successTitle: 'Appointment Confirmed!',
      opTokenBadge: 'OP TOKEN #{token}',
      scanQrNotice: 'Show this QR code at hospital OPD reception',
      whatsappPreviewTitle: 'WhatsApp Notification Preview',
      sendToMyWhatsapp: 'Open in WhatsApp (wa.me)',
      addToCalendar: 'Add to Calendar (.ics)',
      getDirections: 'Get Directions on Map',
      trackQueueBtn: 'Track Live OP Queue Now',
    },
    liveQueue: {
      title: 'Live OP Queue Tracker',
      nowServing: 'Now Serving',
      yourToken: 'Your Token',
      patientsAhead: 'Patients Ahead',
      waitingTotal: 'Total in Queue',
      estimatedWait: 'Estimated Wait',
      expectedTurn: 'Expected Turn',
      arriveBy: 'Arrive at Hospital By',
      leaveHomeBy: 'Leave Home By',
      statusRelax: 'Relax at home. We will notify you when it is time to travel.',
      statusGetReady: 'Get ready. Only a few patients ahead.',
      statusStartNow: 'Time to start now! Head towards the hospital to arrive comfortably.',
      statusReached: 'You should be at the OPD waiting area now.',
      statusYourTurn: 'It is your turn! Please proceed to Room {room}.',
      statusCompleted: 'Your consultation for today is completed.',
      statusDelayed: 'Consultation is running {min} min late. Times adjusted.',
      statusDoctorBusy: 'Doctor is temporarily busy ({reason}). Your queue is paused but your appointment is safe.',
      statusDoctorUnavailable: 'Doctor is unavailable ({reason}). Please rebook or select an alternative doctor.',
      rebookBtn: 'Find Alternative Doctor Now',
    },
    rebook: {
      title: 'Doctor Unavailable – Choose Alternative',
      doctorUnavailableDesc: 'Dr. {doctor} is currently unavailable due to: {reason}. You can keep waiting or switch to an available specialist immediately without losing your priority.',
      reasonLabel: 'Reason reported by hospital',
      keepWaitBtn: 'Keep My Appointment & Wait',
      alternativeDoctorsTitle: 'Recommended Same-Specialty Doctors in Vizag',
      moveSlotBtn: 'Switch to this Slot (1-Tap)',
      successMoved: 'Successfully switched to Dr. {doctor}! Your new token is #{token}.',
    },
    alerts: {
      title: 'Notifications & Alerts',
      tabInApp: 'In-App Alerts',
      tabWhatsapp: 'WhatsApp Chat View',
      enableNotifications: 'Enable Sound & Device Alerts',
      noAlerts: 'No alerts yet. Updates regarding your tokens will appear here.',
      simulatedDisclaimer: 'WhatsApp messages are simulated on-device for the hackathon demo.',
      markAllRead: 'Mark all as read',
    },
    appointments: {
      title: 'My OP Appointments',
      emptyAppointments: 'No bookings found for this mobile number.',
      reschedule: 'Reschedule',
      cancelAppointment: 'Cancel Appointment',
      confirmCancel: 'Are you sure you want to cancel this booking?',
      cancelledBadge: 'Cancelled',
      completedBadge: 'Completed',
      activeBadge: 'Confirmed',
    },
    settings: {
      title: 'Settings & Preferences',
      language: 'App Language',
      location: 'Patient Base Location (Vizag)',
      simpleMode: 'Simple Mode (Larger Text & High Contrast)',
      simpleModeDesc: 'Optimized readability for senior citizens and quick visual triage',
      demoControls: 'Simulation Clock & Demo Speed',
      demoTime: 'Simulated Time',
      simSpeed: 'Clock Speed',
      pauseResume: 'Pause / Resume Clock',
      advance15: '+15 Min Fast Forward',
      resetDemoData: 'Reset Demo Data to Initial State',
      logoutBtn: 'Log Out of CareConnect',
    },
    hospitalPortal: {
      title: 'Hospital Management Portal',
      portalName: 'OPD Queue Management System',
      summaryTokensToday: 'Tokens Issued Today',
      summaryCompleted: 'Consultations Done',
      summaryWaiting: 'Patients Waiting',
      summaryDoctorsAvailable: 'Active Doctors',
      summaryPatientsNotified: 'Alerts Dispatched',
      tabLiveQueue: 'Live Queue',
      tabDoctors: 'Doctors & Schedule',
      tabAppointments: 'Appointments',
      tabSentAlerts: 'Sent Alerts Log',
      tabDemo: 'Demo & Controls',
      autoRunQueueLabel: 'Auto-run Queue (Demo Simulation)',
      autoRunQueueDesc: 'When ON, the queue moves forward automatically. When OFF, hospital staff control each token call.',
      completeAndCallNext: 'Complete & Call Next',
      issueWalkInToken: 'Issue Walk-in Token',
      setServingToken: 'Set Serving Token',
      tokenBoardTitle: 'Token Board',
      filterTokenAll: 'All Tokens',
      markAvailable: 'Mark Available',
      markBusy: 'Mark Busy',
      markUnavailable: 'Mark Unavailable',
      reasonPrompt: 'Select reason for status change',
      delayConsultation: 'Delay Consultation',
      customMinutes: 'Custom Mins',
      changeSchedule: "Edit Today's Schedule",
      arrival: 'Hospital Arrival',
      consultStart: 'OPD Start Time',
      departure: 'Expected Departure',
      saveAndNotify: 'Save & Notify Patients',
      patientsAffectedWarning: '{count} booked patients will be instantly notified via WhatsApp & in-app.',
      patientsNotifiedToast: '{count} patients notified on WhatsApp and in-app!',
    },
    templates: {
      bookingConfirmed: {
        title: 'OP Appointment Confirmed - Token #{token}',
        body: 'Your OP slot with Dr. {doctor} ({specialty}) at {hospital} is confirmed for {time}. Arrive by {arriveBy}.',
        whatsapp: 'Your CareConnect OP appointment is confirmed!\n\nHospital: {hospital}\nDoctor: {doctor} ({specialty})\nDate & Time: {date}, {time}\nToken Number: {token}\nPatients Ahead: {ahead}\nEstimated Waiting Time: {wait}\n\nPlease arrive at the hospital by {arriveBy}.\n\nWe will notify you when your turn is approaching.\n\nThank you for choosing CareConnect!',
      },
      doctorArrivalExpected: {
        title: 'Doctor Arrival Update',
        body: 'Dr. {doctor} is expected to arrive at {hospital} by {time}.',
        whatsapp: 'CareConnect Update: Dr. {doctor} is scheduled to arrive at {hospital} at {time}. Your OPD queue will begin shortly.',
      },
      doctorArrived: {
        title: 'Doctor Arrived at Hospital',
        body: 'Dr. {doctor} has reached {hospital} and will begin consultations soon.',
        whatsapp: 'CareConnect Alert: Dr. {doctor} has arrived at {hospital}. OPD consultations are starting.',
      },
      reminder60m: {
        title: '1-Hour OP Appointment Reminder',
        body: 'Your appointment is in approximately 60 minutes. Please plan to reach {hospital} by {arriveBy}.',
        whatsapp: 'CareConnect Reminder: Your appointment with Dr. {doctor} is approaching. Please arrive by {arriveBy}. Current wait: {wait}.',
      },
      ahead5: {
        title: 'Queue Moving: 5 Patients Ahead',
        body: '5 patients ahead of Token #{token}. Estimated wait: {wait}.',
        whatsapp: 'CareConnect Queue Update: 5 patients ahead of your Token #{token} at {hospital}. Estimated wait: {wait}.',
      },
      startNow: {
        title: 'Time to Leave Home Now!',
        body: 'Traffic and queue estimate indicates you should leave now to arrive at {hospital} by {arriveBy}.',
        whatsapp: 'CareConnect Travel Alert: Please start for {hospital} now! You are expected to arrive by {arriveBy}. Doctor: Dr. {doctor}.',
      },
      turnApproaching: {
        title: 'Your Turn is Approaching!',
        body: 'Token #{token} is next or 2 patients away. Please be ready at Room {room}.',
        whatsapp: 'CareConnect Alert: Your turn is approaching! Token #{token} has only 2 patients ahead at {hospital}, Room {room}.',
      },
      nowServing: {
        title: 'It is Your Turn! - Room {room}',
        body: 'Token #{token} is now being called by Dr. {doctor} in Room {room}.',
        whatsapp: 'CareConnect Immediate Notice: Token #{token} - IT IS YOUR TURN! Please enter Room {room} to consult Dr. {doctor} at {hospital}.',
      },
      completed: {
        title: 'Consultation Completed',
        body: 'Your consultation with Dr. {doctor} is marked completed. Get well soon!',
        whatsapp: 'Thank you for visiting {hospital}. Your consultation with Dr. {doctor} is complete. Take care!',
      },
      docDelayed: {
        title: 'Doctor Running Late',
        body: 'Dr. {doctor} is running {delay} min late. Your new estimated wait is {wait}. Arrive by {arriveBy}.',
        whatsapp: 'CareConnect Schedule Notice: Dr. {doctor} at {hospital} is running {delay} min late. New estimated wait: {wait}. Please arrive by {arriveBy}.',
      },
      docBusy: {
        title: 'Doctor Temporarily Busy ({reason})',
        body: 'Dr. {doctor} is occupied ({reason}). Queue is paused; your slot is safe.',
        whatsapp: 'CareConnect Notice: Dr. {doctor} is temporarily attending to: {reason}. The queue is briefly paused. Your appointment remains secure.',
      },
      docUnavailable: {
        title: 'Doctor Unavailable: Rebook Available',
        body: 'Dr. {doctor} is unavailable ({reason}). Open CareConnect to switch to an alternative doctor without losing priority.',
        whatsapp: 'CareConnect Important Alert: Dr. {doctor} at {hospital} has become unavailable ({reason}). Please open CareConnect to switch to an available specialist in 1 tap: {link}',
      },
      docAvailable: {
        title: 'Doctor Available - Queue Resumed',
        body: 'Dr. {doctor} has resumed consultations. Your turn will proceed shortly.',
        whatsapp: 'CareConnect Update: Dr. {doctor} is now back and consultations have resumed. Estimated wait: {wait}.',
      },
    },
  },
  te: {
    common: {
      appName: 'కేర్‌కనెక్ట్',
      tagline: 'స్మార్ట్ ఆరోగ్య మార్గదర్శకత్వం & ఓపీ బుకింగ్',
      vizag: 'విశాఖపట్నం (వైజాగ్)',
      loading: 'లోడ్ అవుతోంది...',
      save: 'భద్రపరచు',
      cancel: 'రద్దు చేయి',
      confirm: 'నిర్ధారించు',
      close: 'మూసివేయి',
      back: 'వెనుకకు',
      next: 'తరువాత',
      directions: 'దారి చూపించు',
      call: 'కాల్ చేయండి',
      room: 'గది సంఖ్య',
      mins: 'నిమిషాలు',
      km: 'కి.మీ',
      offlineMode: 'ఆఫ్‌లైన్ నియమాలు అమలులో ఉన్నాయి',
      demoModeBadge: 'డెమో మోడ్',
      change: 'మార్చండి',
      viewAll: 'అన్నీ చూడండి',
      refresh: 'తాజాకరించు',
    },
    auth: {
      chooseRoleTitle: 'కేర్‌కనెక్ట్‌కు స్వాగతం',
      chooseRoleSubtitle: 'విశాఖపట్నంలో స్మార్ట్ ఆసుపత్రి నావిగేషన్ & లైవ్ ఓపీ క్యూ ట్రాకింగ్',
      patientRole: 'రోగి / వినియోగదారు లాగిన్',
      patientRoleDesc: 'AI అసిస్టెంట్‌తో మాట్లాడండి, డాక్టర్ స్లాట్ బుక్ చేసుకోండి & వాట్సాప్‌లో లైవ్ టోకెన్ పొందండి',
      hospitalRole: 'ఆసుపత్రి సిబ్బంది పోర్టల్',
      hospitalRoleDesc: 'లైవ్ టోకెన్లు, డాక్టర్ షెడ్యూల్ మార్పులు నిర్వహించండి & రోగులకు వెంటనే సమాచారం ఇవ్వండి',
      enterMobile: 'రోగి వివరాలు నమోదు చేయండి',
      fullName: 'పూర్తి పేరు',
      namePlaceholder: 'ఉదా: రమేష్ కుమార్',
      mobilePlaceholder: '10 అంకెల మొబైల్ సంఖ్య',
      sendOtp: 'OTPతో కొనసాగండి',
      enterOtp: 'ధృవీకరణ కోడ్ నమోదు చేయండి',
      otpHint: 'డెమో మోడ్: మీ OTP {otp}',
      verifyOtp: 'ధృవీకరించి ప్రవేశించండి',
      demoPatientBtn: '⚡ త్వరిత డెమో రోగి లాగిన్',
      selectLocation: 'వైజాగ్‌లో మీ ప్రాంతం',
      detectGps: 'ప్రస్తుత స్థానాన్ని గుర్తించండి (GPS)',
      orChooseArea: 'లేదా మీ ప్రాంతాన్ని ఎంచుకోండి',
      hospitalLoginTitle: 'ఆసుపత్రి నిర్వహణ లాగిన్',
      signInTab: 'సైన్ ఇన్',
      createAccountTab: 'ఖాతా సృష్టించండి',
      username: 'యూజర్‌నేమ్',
      password: 'పాస్‌వర్డ్',
      confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
      selectHospital: 'ఆసుపత్రిని ఎంచుకోండి',
      contactPerson: 'సంప్రదింపు వ్యక్తి / హోదా',
      signInBtn: 'పోర్టల్‌లోకి ప్రవేశించండి',
      createAccountBtn: 'ఆసుపత్రి ఖాతా నమోదు చేయండి',
      useDemoHospital: '⚡ డెమో ఆసుపత్రి ఉపయోగించండి (సాగర్ కేర్)',
      demoCredentialsHint: 'డెమో వివరాలు: యూజర్‌నేమ్ "sagarcare" / పాస్‌వర్డ్ "demo1234"',
      logout: 'లాగ్ అవుట్',
      invalidCredentials: 'తప్పు యూజర్‌నేమ్ లేదా పాస్‌వర్డ్. దయచేసి మళ్ళీ ప్రయత్నించండి.',
      hospitalAlreadyHasAccount: 'ఈ ఆసుపత్రికి ఇప్పటికే ఖాతా ఉంది. దయచేసి సైన్ ఇన్ చేయండి.',
      usernameTaken: 'ఈ యూజర్‌నేమ్ ఇప్పటికే వాడకంలో ఉంది. వేరొకటి ఎంచుకోండి.',
    },
    nav: {
      home: 'హోమ్',
      hospitals: 'ఆసుపత్రులు',
      queue: 'లైవ్ క్యూ',
      alerts: 'హెచ్చరికలు',
      settings: 'సెట్టింగ్‌లు',
      dashboard: 'డ్యాష్‌బోర్డ్',
    },
    home: {
      emergencyCallout: 'అత్యవసరమా? 108 (అంబులెన్స్) లేదా 112 కి వెంటనే కాల్ చేయండి',
      micPrompt: 'మీ ఆరోగ్య సమస్యను చెప్పండి (మాట్లాడండి లేదా టైప్ చేయండి)',
      micListening: 'మీ లక్షణాలను వింటున్నాము... స్పష్టంగా మాట్లాడండి',
      textPlaceholder: 'ఉదా: "నాకు రెండు రోజులుగా ఛాతీలో నొప్పిగా ఉంది" లేదా "తీవ్రమైన జ్వరం"',
      checkAvailability: 'పరిశీలించి ఆసుపత్రి కనుగొనండి',
      quickSymptomsTitle: 'సాధారణ ఆరోగ్య సమస్యలు',
      activeTokenTitle: 'మీ క్రియాశీల ఓపీ టోకెన్',
      noActiveToken: 'ప్రస్తుతం బుకింగ్స్ లేవు. డాక్టర్‌ని కనుగొనడానికి క్రింద నొక్కండి.',
      nearestHospitalsTitle: 'వైజాగ్‌లో మీ దగ్గరలోని ఆసుపత్రులు',
      locationLabel: 'మీ స్థానం',
      disclaimer: 'ఇది కేవలం మార్గదర్శకత్వం మాత్రమే, వైద్య నిర్ధారణ కాదు. అత్యవసరమైతే 108 కి కాల్ చేయండి.',
    },
    symptoms: {
      fever: 'జ్వరం & చలి',
      chestPain: 'ఛాతీ నొప్పి / పట్టేసినట్లుండటం',
      childUnwell: 'పిల్లల అనారోగ్యం',
      pregnancy: 'గర్భధారణ & ప్రసూతి',
      injury: 'ఎముకల గాయం / దెబ్బ',
      skin: 'చర్మంపై దద్దుర్లు / దురద',
      eye: 'కంటి నొప్పి & చూపు సమస్య',
      tooth: 'పంటి నొప్పి & దంతాలు',
      stomach: 'కడుపు నొప్పి / వాంతులు',
      breathing: 'శ్వాస తీసుకోవడంలో ఇబ్బంది',
    },
    triage: {
      analyzing: 'కేర్‌కనెక్ట్ AI మీ లక్షణాలను విశ్లేషిస్తోంది...',
      title: 'ప్రాథమిక పరిశీలన & సంరక్షణ మార్గదర్శకత్వం',
      symptomsIdentified: 'గుర్తించిన లక్షణాలు',
      specialtyRecommended: 'సిఫార్సు చేయబడిన విభాగం',
      urgencyTitle: 'తీవ్రత స్థాయి',
      emergency: 'అత్యవసరం (తక్షణ వైద్యం అవసరం)',
      urgent: 'త్వరిత శ్రద్ధ (24 గంటల్లో సంప్రదించండి)',
      routine: 'సాధారణం (ముందస్తు అపాయింట్‌మెంట్)',
      listenToGuidance: 'వినండి (వాయిస్)',
      emergencyBanner: 'తీవ్ర హెచ్చరిక: మీ లక్షణాలు అత్యవసర వైద్య పరిస్థితిని సూచిస్తున్నాయి. వెంటనే సమీప ఆసుపత్రికి వెళ్ళండి లేదా 108 కి కాల్ చేయండి.',
      emergencyCall108: '108 అంబులెన్స్‌కు కాల్ చేయండి',
      emergencyCall112: '112 అత్యవసర కాల్',
      topHospitalsTitle: 'సిఫార్సు చేయబడిన వైజాగ్ ఆసుపత్రులు',
      reasonBadge: 'ఎందుకు సిఫార్సు చేయబడింది',
      viewDoctors: 'డాక్టర్లను చూడండి',
      medicalDisclaimer: 'గమనిక: ఇది AI ఆరోగ్య మార్గదర్శకత్వం మాత్రమే, నిపుణుల వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. అత్యవసర సమయాల్లో 108 కి కాల్ చేయండి.',
    },
    hospitals: {
      title: 'విశాఖపట్నంలోని ఆసుపత్రులు',
      searchPlaceholder: 'ఆసుపత్రులు, ప్రాంతాలు, విభాగాలు వెతకండి...',
      filterAll: 'అన్ని ఆసుపత్రులు',
      filterEmergency: '24x7 ఎమర్జెన్సీ',
      filterGovt: 'ప్రభుత్వ',
      filterPrivate: 'ప్రైవేట్',
      sortDistance: 'దగ్గరగా ఉన్నవి',
      sortWait: 'తక్కువ వేచి ఉండే సమయం',
      sortRating: 'ఉత్తమ రేటింగ్',
      listView: 'జాబితా',
      mapView: 'మ్యాప్',
      noResults: 'మీ శోధనకు సరిపోయే ఆసుపత్రులు లేవు.',
      openNow: 'ఇప్పుడు తెరిచి ఉంది',
      icuAvailable: 'ICU సదుపాయం',
      emergency247: '24x7 ట్రౌమా కేర్',
      doctorsCount: 'డాక్టర్లు',
      patientsWaiting: 'వేచి ఉన్నారు',
    },
    hospitalDetail: {
      about: 'వివరాలు & సౌకర్యాలు',
      departments: 'ప్రత్యేక విభాగాలు',
      facilities: 'ముఖ్య సౌకర్యాలు',
      hours: 'ఓపీ సమయాలు',
      doctorsHeader: 'అందుబాటులో ఉన్న డాక్టర్లు & లైవ్ ఓపీ స్థితి',
      howBookingWorksTitle: 'కేర్‌కనెక్ట్ బుకింగ్ ఎలా పనిచేస్తుంది',
      step1Title: '1. డాక్టర్ & 20 నిమిషాల స్లాట్ ఎంచుకోండి',
      step1Desc: 'మీ సమయానికి తగిన స్లాట్ ఎంచుకోండి. మీ సమయానికి 15 నిమిషాల ముందుగా చేరుకోండి.',
      step2Title: '2. వాట్సాప్‌లో తక్షణ టోకెన్ పొందండి',
      step2Desc: 'మీ ఓపీ టోకెన్ సంఖ్య, QR కోడ్ మరియు తాజా సమాచారం మీ మొబైల్‌కు అందుతాయి.',
      step3Title: '3. ఇంటి నుండే లైవ్ క్యూ ట్రాక్ చేయండి',
      step3Desc: 'మీరు ఎప్పుడు బయలుదేరాలో మేము హెచ్చరిస్తాము; ఆసుపత్రిలో గంటల తరబడి వేచి ఉండాల్సిన పనిలేదు.',
    },
    doctorDetail: {
      qualification: 'అర్హత',
      experience: 'అనుభవం',
      fee: 'కన్సల్టేషన్ ఫీజు',
      spokenLanguages: 'మాట్లాడే భాషలు',
      statusAvailable: 'అందుబాటులో ఉన్నారు (కన్సల్టింగ్)',
      statusBusy: 'శస్త్రచికిత్స / వార్డుల్లో బిజీగా ఉన్నారు',
      statusUnavailable: 'అందుబాటులో లేరు / బయటకు వెళ్లారు',
      runningLateBanner: 'డాక్టర్ {doctor} గారు ఈ రోజు {min} నిమిషాలు ఆలస్యంగా నడుస్తున్నారు.',
      timelineTitle: 'నేటి ఓపీ సమయ పట్టిక',
      arrivesAt: 'ఆసుపత్రికి చేరుకునే సమయం',
      consultStarts: 'ఓపీ ప్రారంభం',
      expectedDeparture: 'ముగింపు సమయం',
      selectSlotTitle: 'ఓపీ స్లాట్ ఎంచుకోండి (20 నిమిషాల వ్యవధి)',
      slotWindowRule: 'ప్రతి స్లాట్ 20 నిమిషాలు (ఒక్కో రోగికి ~{avg} నిమిషాలు). ఫీజు: ₹{fee}.',
      slotRuleNote: 'ప్రస్తుత సమయం నుండి కనీసం 20 నిమిషాల తర్వాత ప్రారంభమయ్యే స్లాట్లను మాత్రమే బుక్ చేసుకోగలరు.',
      avgTimePerPatient: '~{avg} నిమిషాలు / రోగికి',
      arriveEarlyNotice: 'దయచేసి మీ సమయానికి 15 నిమిషాల ముందే ఆసుపత్రికి చేరుకోండి.',
      bookSlotBtn: 'స్లాట్ బుక్ చేసి టోకెన్ పొందండి',
      slotAvailable: 'అందుబాటులో ఉంది',
      slotFull: 'పూర్తయింది',
      slotSelected: 'ఎంచుకోబడింది',
    },
    booking: {
      title: 'ఓపీ (OP) బుకింగ్ నిర్ధారించండి',
      confirmDetails: 'అపాయింట్‌మెంట్ వివరాలు',
      patientName: 'రోగి పేరు',
      patientAge: 'వయస్సు',
      phoneLabel: 'మొబైల్ సంఖ్య',
      symptomSummary: 'ఆరోగ్య సమస్య వివరాలు',
      whatsappConsentLabel: 'ఓపీ టోకెన్, లైవ్ వేచి ఉండే సమయం & ప్రయాణ హెచ్చరికలను నా వాట్సాప్‌కు పంపండి',
      confirmBookingBtn: 'నిర్ధారించి ఓపీ టోకెన్ పొందండి',
      successTitle: 'అపాయింట్‌మెంట్ విజయవంతంగా ఖరారైంది!',
      opTokenBadge: 'ఓపీ టోకెన్ సంఖ్య #{token}',
      scanQrNotice: 'ఈ QR కోడ్‌ను ఆసుపత్రి ఓపీ కౌంటర్ వద్ద చూపించండి',
      whatsappPreviewTitle: 'వాట్సాప్ సందేశ నమూనా',
      sendToMyWhatsapp: 'వాట్సాప్‌లో తెరవండి (wa.me)',
      addToCalendar: 'క్యాలెండర్‌కు జోడించండి (.ics)',
      getDirections: 'మ్యాప్‌లో దారి చూడండి',
      trackQueueBtn: 'లైవ్ ఓపీ క్యూ ట్రాక్ చేయండి',
    },
    liveQueue: {
      title: 'లైవ్ ఓపీ క్యూ ట్రాకర్',
      nowServing: 'ప్రస్తుతం చూస్తున్న టోకెన్',
      yourToken: 'మీ టోకెన్',
      patientsAhead: 'మీ ముందున్న రోగులు',
      waitingTotal: 'క్యూలో మొత్తం రోగులు',
      estimatedWait: 'అంచనా వేచి ఉండే సమయం',
      expectedTurn: 'మీ వంతు వచ్చే సమయం',
      arriveBy: 'ఆసుపత్రికి చేరుకోవాల్సిన సమయం',
      leaveHomeBy: 'ఇంటి నుండి బయలుదేరాల్సిన సమయం',
      statusRelax: 'ఇంట్లోనే విశ్రాంతి తీసుకోండి. బయలుదేరాల్సిన సమయానికి మేము తెలియజేస్తాము.',
      statusGetReady: 'సిద్ధంగా ఉండండి. మీ ముందు కొద్దిమంది మాత్రమే ఉన్నారు.',
      statusStartNow: 'ఇప్పుడే బయలుదేరండి! సమయానికి ఆసుపత్రికి చేరుకోండి.',
      statusReached: 'మీరు ఇప్పుడు ఓపీ వెయిటింగ్ ఏరియాలో ఉండాలి.',
      statusYourTurn: 'ఇది మీ వంతు! దయచేసి గది సంఖ్య {room} లోకి వెళ్ళండి.',
      statusCompleted: 'ఈ రోజు మీ కన్సల్టేషన్ పూర్తయింది.',
      statusDelayed: 'కన్సల్టేషన్ {min} నిమిషాలు ఆలస్యంగా నడుస్తోంది. సమయాలు మార్చబడ్డాయి.',
      statusDoctorBusy: 'డాక్టర్ గారు అత్యవసర పనిలో ఉన్నారు ({reason}). మీ క్యూ తాత్కాలికంగా ఆపబడింది, మీ అపాయింట్‌మెంట్ సురక్షితం.',
      statusDoctorUnavailable: 'డాక్టర్ గారు అందుబాటులో లేరు ({reason}). దయచేసి వేరొక డాక్టర్‌ని ఎంచుకోండి.',
      rebookBtn: 'ప్రత్యామ్నాయ డాక్టర్‌ని ఎంచుకోండి',
    },
    rebook: {
      title: 'డాక్టర్ అందుబాటులో లేరు – ప్రత్యామ్నాయ డాక్టర్‌ని ఎంచుకోండి',
      doctorUnavailableDesc: 'డాక్టర్ {doctor} గారు ఈ కారణం వల్ల అందుబాటులో లేరు: {reason}. మీరు వేచి ఉండవచ్చు లేదా ప్రాధాన్యత కోల్పోకుండా వెంటనే అందుబాటులో ఉన్న నిపుణుడిని ఎంచుకోవచ్చు.',
      reasonLabel: 'ఆసుపత్రి తెలిపిన కారణం',
      keepWaitBtn: 'నా అపాయింట్‌మెంట్ ఉంచి వేచి ఉంటాను',
      alternativeDoctorsTitle: 'వైజాగ్‌లో అదే విభాగంలో అందుబాటులో ఉన్న ఇతర డాక్టర్లు',
      moveSlotBtn: 'ఈ స్లాట్‌కు మారండి (ఒక్క ట్యాప్‌తో)',
      successMoved: 'డాక్టర్ {doctor} గారికి విజయవంతంగా మార్చబడింది! మీ కొత్త టోకెన్ #{token}.',
    },
    alerts: {
      title: 'నోటిఫికేషన్‌లు & హెచ్చరికలు',
      tabInApp: 'యాప్ హెచ్చరికలు',
      tabWhatsapp: 'వాట్సాప్ సందేశాలు',
      enableNotifications: 'శబ్దం & పరికర నోటిఫికేషన్‌లు ప్రారంభించండి',
      noAlerts: 'ఇంకా ఎటువంటి హెచ్చరికలు లేవు. మీ టోకెన్ సమాచారం ఇక్కడ కనిపిస్తుంది.',
      simulatedDisclaimer: 'ఈ వాట్సాప్ సందేశాలు డెమో కొరకు అనుకరించబడినవి.',
      markAllRead: 'అన్నీ చదివినట్లు గుర్తించు',
    },
    appointments: {
      title: 'నా ఓపీ అపాయింట్‌మెంట్‌లు',
      emptyAppointments: 'ఈ మొబైల్ నంబర్‌పై ఎటువంటి బుకింగ్స్ లేవు.',
      reschedule: 'రీషెడ్యూల్',
      cancelAppointment: 'అపాయింట్‌మెంట్ రద్దు చేయి',
      confirmCancel: 'మీరు ఖచ్చితంగా ఈ బుకింగ్‌ను రద్దు చేయాలనుకుంటున్నారా?',
      cancelledBadge: 'రద్దు చేయబడింది',
      completedBadge: 'పూర్తయింది',
      activeBadge: 'ఖరారైంది',
    },
    settings: {
      title: 'సెట్టింగ్‌లు & ప్రాధాన్యతలు',
      language: 'యాప్ భాష',
      location: 'రోగి నివాస ప్రాంతం (వైజాగ్)',
      simpleMode: 'సరళమైన మోడ్ (పెద్ద అక్షరాలు & అధిక కాంట్రాస్ట్)',
      simpleModeDesc: 'వృద్ధులకు మరియు వేగవంతమైన పరిశీలన కొరకు అనుకూలమైనది',
      demoControls: 'సిమ్యులేషన్ గడియారం & వేగం',
      demoTime: 'అనుకరణ సమయం',
      simSpeed: 'గడియారం వేగం',
      pauseResume: 'ఆపు / కొనసాగించు',
      advance15: '+15 నిమిషాలు ముందుకు జరుపు',
      resetDemoData: 'డెమో డేటాను పునరుద్ధరించు',
      logoutBtn: 'లాగ్ అవుట్',
    },
    hospitalPortal: {
      title: 'ఆసుపత్రి నిర్వహణ పోర్టల్',
      portalName: 'ఓపీ క్యూ నిర్వహణ వ్యవస్థ',
      summaryTokensToday: 'ఈ రోజు ఇచ్చిన టోకెన్లు',
      summaryCompleted: 'పూర్తయినవి',
      summaryWaiting: 'వేచి ఉన్న రోగులు',
      summaryDoctorsAvailable: 'క్రియాశీల డాక్టర్లు',
      summaryPatientsNotified: 'పంపిన హెచ్చరికలు',
      tabLiveQueue: 'లైవ్ క్యూ',
      tabDoctors: 'డాక్టర్లు & షెడ్యూల్',
      tabAppointments: 'అపాయింట్‌మెంట్‌లు',
      tabSentAlerts: 'పంపిన హెచ్చరికల చిట్టా',
      tabDemo: 'డెమో నియంత్రణలు',
      autoRunQueueLabel: 'ఆటో-రన్ క్యూ (డెమో సిమ్యులేషన్)',
      autoRunQueueDesc: 'ఆన్ చేసినప్పుడు క్యూ దానంతటదే ముందుకు సాగుతుంది. ఆఫ్ చేసినప్పుడు సిబ్బంది బటన్ నొక్కినప్పుడే మారుతుంది.',
      completeAndCallNext: 'పూర్తి చేసి తర్వాతి టోకెన్ పిలవండి',
      issueWalkInToken: 'వాక్-ఇన్ టోకెన్ జారీ చేయండి',
      setServingToken: 'ప్రస్తుత టోకెన్ నిర్ణయించండి',
      tokenBoardTitle: 'టోకెన్ బోర్డు',
      filterTokenAll: 'అన్ని టోకెన్లు',
      markAvailable: 'అందుబాటులో ఉన్నట్లు గుర్తించు',
      markBusy: 'బిజీగా ఉన్నట్లు గుర్తించు',
      markUnavailable: 'అందుబాటులో లేనట్లు గుర్తించు',
      reasonPrompt: 'స్థితి మార్పునకు కారణాన్ని ఎంచుకోండి',
      delayConsultation: 'కన్సల్టేషన్ ఆలస్యం చేయండి',
      customMinutes: 'నిమిషాలు',
      changeSchedule: 'నేటి షెడ్యూల్ సవరించండి',
      arrival: 'చేరుకునే సమయం',
      consultStart: 'ఓపీ ప్రారంభ సమయం',
      departure: 'ముగింపు సమయం',
      saveAndNotify: 'భద్రపరిచి రోగులకు తెలపండి',
      patientsAffectedWarning: '{count} మంది బుక్ చేసుకున్న రోగులకు వాట్సాప్ & యాప్ ద్వారా వెంటనే సమాచారం అందుతుంది.',
      patientsNotifiedToast: '{count} మంది రోగులకు వాట్సాప్ మరియు యాప్‌లో సమాచారం చేరింది!',
    },
    templates: {
      bookingConfirmed: {
        title: 'ఓపీ అపాయింట్‌మెంట్ ఖరారైంది - టోకెన్ #{token}',
        body: '{hospital} లో డాక్టర్ {doctor} ({specialty}) వద్ద మీ స్లాట్ {time} కి ఖరారైంది. {arriveBy} కి చేరుకోండి.',
        whatsapp: 'మీ కేర్‌కనెక్ట్ ఓపీ అపాయింట్‌మెంట్ ఖరారైంది!\n\nఆసుపత్రి: {hospital}\nడాక్టర్: డాక్టర్ {doctor} ({specialty})\nతేదీ & సమయం: {date}, {time}\nటోకెన్ నంబర్: {token}\nముందున్న రోగులు: {ahead}\nఅంచనా వేచి ఉండే సమయం: {wait}\n\nదయచేసి {arriveBy} లోగా ఆసుపత్రికి చేరుకోండి.\n\nమీ వంతు సమీపించినప్పుడు మేము మీకు తెలియజేస్తాము.\n\nకేర్‌కనెక్ట్‌ను ఎంచుకున్నందుకు ధన్యవాదాలు!',
      },
      doctorArrivalExpected: {
        title: 'డాక్టర్ రాక సమాచారం',
        body: 'డాక్టర్ {doctor} గారు {time} సమయానికి {hospital} కి చేరుకోనున్నారు.',
        whatsapp: 'కేర్‌కనెక్ట్ అప్‌డేట్: డాక్టర్ {doctor} గారు {time} కి {hospital} చేరుకోనున్నారు. త్వరలో ఓపీ ప్రారంభమవుతుంది.',
      },
      doctorArrived: {
        title: 'డాక్టర్ ఆసుపత్రికి చేరుకున్నారు',
        body: 'డాక్టర్ {doctor} గారు {hospital} కి చేరుకున్నారు, త్వరలో కన్సల్టేషన్లు మొదలవుతాయి.',
        whatsapp: 'కేర్‌కనెక్ట్ అలర్ట్: డాక్టర్ {doctor} గారు {hospital} చేరుకున్నారు. ఓపీ కన్సల్టేషన్లు ప్రారంభమయ్యాయి.',
      },
      reminder60m: {
        title: '1 గంట అపాయింట్‌మెంట్ రిమైండర్',
        body: 'మీ అపాయింట్‌మెంట్ సుమారు 60 నిమిషాల్లో ప్రారంభం కానుంది. {arriveBy} సమయానికి చేరుకోండి.',
        whatsapp: 'కేర్‌కనెక్ట్ రిమైండర్: డాక్టర్ {doctor} గారితో మీ అపాయింట్‌మెంట్ సమయం దగ్గరపడుతోంది. {arriveBy} కల్లా చేరుకోండి. ప్రస్తుత వేచి ఉండే సమయం: {wait}.',
      },
      ahead5: {
        title: 'క్యూ కదులుతోంది: 5 మంది రోగులు మాత్రమే ముందున్నారు',
        body: 'టోకెన్ #{token} కి ముందు 5 మంది మాత్రమే ఉన్నారు. అంచనా సమయం: {wait}.',
        whatsapp: 'కేర్‌కనెక్ట్ క్యూ అప్‌డేట్: {hospital} లో మీ టోకెన్ #{token} కి ముందు 5 మంది మాత్రమే ఉన్నారు. అంచనా సమయం: {wait}.',
      },
      startNow: {
        title: 'ఇప్పుడే ఇంటి నుండి బయలుదేరండి!',
        body: 'ట్రాఫిక్ మరియు క్యూ అంచనా ప్రకారం మీరు {arriveBy} కి చేరుకోవడానికి ఇప్పుడే బయలుదేరండి.',
        whatsapp: 'కేర్‌కనెక్ట్ ప్రయాణ అలర్ట్: దయచేసి {hospital} కి ఇప్పుడే బయలుదేరండి! మీరు {arriveBy} సమయానికి చేరుకోవాలి. డాక్టర్: డాక్టర్ {doctor}.',
      },
      turnApproaching: {
        title: 'మీ వంతు సమీపించింది!',
        body: 'టోకెన్ #{token} కి ముందు 2 మంది మాత్రమే ఉన్నారు. రూమ్ {room} వద్ద సిద్ధంగా ఉండండి.',
        whatsapp: 'కేర్‌కనెక్ట్ అలర్ట్: మీ వంతు సమీపించింది! {hospital} లోని రూమ్ {room} వద్ద టోకెన్ #{token} కి ముందు కేవలం 2 పేషెంట్లు మాత్రమే ఉన్నారు.',
      },
      nowServing: {
        title: 'ఇది మీ వంతు! - గది సంఖ్య {room}',
        body: 'టోకెన్ #{token} ను డాక్టర్ {doctor} గారు రూమ్ {room} లోకి పిలుస్తున్నారు.',
        whatsapp: 'కేర్‌కనెక్ట్ తక్షణ సమాచారం: టోకెన్ #{token} - ఇది మీ వంతు! దయచేసి {hospital} లోని రూమ్ {room} లో డాక్టర్ {doctor} గారి వద్దకు వెళ్ళండి.',
      },
      completed: {
        title: 'కన్సల్టేషన్ పూర్తయింది',
        body: 'డాక్టర్ {doctor} గారితో మీ కన్సల్టేషన్ పూర్తయింది. సంపూర్ణ ఆరోగ్యం పొందాలని కోరుకుంటున్నాము!',
        whatsapp: '{hospital} ను సందర్శించినందుకు ధన్యవాదాలు. డాక్టర్ {doctor} గారితో మీ పరిశీలన పూర్తయింది. జాగ్రత్తగా ఉండండి!',
      },
      docDelayed: {
        title: 'డాక్టర్ ఆలస్యంగా నడుస్తున్నారు',
        body: 'డాక్టర్ {doctor} గారు {delay} నిమిషాలు ఆలస్యంగా ఉన్నారు. కొత్త వేచి ఉండే సమయం {wait}. {arriveBy} కి చేరుకోండి.',
        whatsapp: 'కేర్‌కనెక్ట్ షెడ్యూల్ నోటీసు: {hospital} లో డాక్టర్ {doctor} గారు {delay} నిమిషాలు ఆలస్యంగా నడుస్తున్నారు. కొత్త అంచనా సమయం: {wait}. దయచేసి {arriveBy} కి చేరుకోండి.',
      },
      docBusy: {
        title: 'డాక్టర్ తాత్కాలికంగా అత్యవసర పనిలో ఉన్నారు ({reason})',
        body: 'డాక్టర్ {doctor} గారు అత్యవసర పనిలో ఉన్నారు ({reason}). క్యూ నిలిపివేయబడింది; మీ స్లాట్ సురక్షితం.',
        whatsapp: 'కేర్‌కనెక్ట్ నోటీసు: డాక్టర్ {doctor} గారు తాత్కాలికంగా అత్యవసర కేసులో ఉన్నారు: {reason}. క్యూ కాసేపు ఆగింది, మీ అపాయింట్‌మెంట్ రద్దు కాలేదు.',
      },
      docUnavailable: {
        title: 'డాక్టర్ అందుబాటులో లేరు: ప్రత్యామ్నాయాన్ని ఎంచుకోండి',
        body: 'డాక్టర్ {doctor} గారు అందుబాటులో లేరు ({reason}). ప్రాధాన్యత కోల్పోకుండా వేరొక డాక్టర్‌ని ఎంచుకోవడానికి యాప్ తెరవండి.',
        whatsapp: 'కేర్‌కనెక్ట్ అత్యవసర హెచ్చరిక: {hospital} లో డాక్టర్ {doctor} గారు అందుబాటులో లేరు ({reason}). దయచేసి వేరొక నిపుణుడిని ఎంచుకోవడానికి వెంటనే యాప్ తెరవండి: {link}',
      },
      docAvailable: {
        title: 'డాక్టర్ అందుబాటులోకి వచ్చారు - క్యూ పునఃప్రారంభమైంది',
        body: 'డాక్టర్ {doctor} గారు తిరిగి వచ్చారు. త్వరలో మీ వంతు రానుంది.',
        whatsapp: 'కేర్‌కనెక్ట్ అప్‌డేట్: డాక్టర్ {doctor} గారు తిరిగి వచ్చారు మరియు కన్సల్టేషన్లు మొదలయ్యాయి. అంచనా సమయం: {wait}.',
      },
    },
  },
  hi: {
    common: {
      appName: 'केयरकनेक्ट',
      tagline: 'स्मार्ट स्वास्थ्य मार्गदर्शन एवं ओपीडी बुकिंग',
      vizag: 'विशाखापत्तनम (वाइजाग)',
      loading: 'लोड हो रहा है...',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      close: 'बंद करें',
      back: 'वापस',
      next: 'आगे',
      directions: 'रास्ता देखें',
      call: 'कॉल करें',
      room: 'कमरा सं.',
      mins: 'मिनट',
      km: 'कि.मी.',
      offlineMode: 'ऑफ़लाइन नियम सक्रिय',
      demoModeBadge: 'डेमो मोड',
      change: 'बदलें',
      viewAll: 'सभी देखें',
      refresh: 'रीफ्रेश',
    },
    auth: {
      chooseRoleTitle: 'केयरकनेक्ट में आपका स्वागत है',
      chooseRoleSubtitle: 'विशाखापत्तनम में स्मार्ट अस्पताल नेविगेशन और लाइव ओपीडी कतार ट्रैकिंग',
      patientRole: 'मरीज़ / उपयोगकर्ता लॉगिन',
      patientRoleDesc: 'AI सहायक से परामर्श करें, डॉक्टर स्लॉट बुक करें और व्हाट्सएप पर लाइव टोकन प्राप्त करें',
      hospitalRole: 'अस्पताल स्टाफ पोर्टल',
      hospitalRoleDesc: 'लाइव टोकन प्रबंधित करें, डॉक्टर शेड्यूल अपडेट करें और मरीज़ों को तुरंत सूचित करें',
      enterMobile: 'मरीज़ का विवरण दर्ज करें',
      fullName: 'पूरा नाम',
      namePlaceholder: 'उदा. रमेश कुमार',
      mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
      sendOtp: 'OTP के साथ आगे बढ़ें',
      enterOtp: 'सत्यापन कोड दर्ज करें',
      otpHint: 'डेमो मोड: आपका OTP {otp} है',
      verifyOtp: 'सत्यापित करें और प्रवेश करें',
      demoPatientBtn: '⚡ त्वरित डेमो मरीज़ लॉगिन',
      selectLocation: 'वाइजाग में आपका वर्तमान क्षेत्र',
      detectGps: 'लाइव लोकेशन पता करें (GPS)',
      orChooseArea: 'या अपना इलाका चुनें',
      hospitalLoginTitle: 'अस्पताल प्रबंधन लॉगिन',
      signInTab: 'साइन इन',
      createAccountTab: 'खाता बनाएं',
      username: 'अस्पताल यूज़रनेम',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      selectHospital: 'अस्पताल चुनें',
      contactPerson: 'संपर्क व्यक्ति / पद',
      signInBtn: 'पोर्टल में प्रवेश करें',
      createAccountBtn: 'अस्पताल खाता पंजीकृत करें',
      useDemoHospital: '⚡ डेमो अस्पताल उपयोग करें (सागर केयर)',
      demoCredentialsHint: 'डेमो क्रेडेंशियल: यूज़रनेम "sagarcare" / पासवर्ड "demo1234"',
      logout: 'लॉग आउट',
      invalidCredentials: 'गलत यूज़रनेम या पासवर्ड। कृपया पुनः प्रयास करें।',
      hospitalAlreadyHasAccount: 'इस अस्पताल का पहले से खाता है। कृपया साइन इन करें।',
      usernameTaken: 'यह यूज़रनेम पहले से उपयोग में है। कोई अन्य चुनें।',
    },
    nav: {
      home: 'होम',
      hospitals: 'अस्पताल',
      queue: 'लाइव कतार',
      alerts: 'अलर्ट',
      settings: 'सेटिंग्स',
      dashboard: 'डैशबोर्ड',
    },
    home: {
      emergencyCallout: 'आपातकाल? तुरंत 108 (एम्बुलेंस) या 112 पर कॉल करें',
      micPrompt: 'अपनी स्वास्थ्य समस्या बताएं (बोलें या लिखें)',
      micListening: 'आपके लक्षणों को सुन रहे हैं... स्पष्ट बोलें',
      textPlaceholder: 'उदा. "दो दिन से सीने में दर्द है" या "तेज़ बुखार और सिरदर्द"',
      checkAvailability: 'जांचें और अस्पताल खोजें',
      quickSymptomsTitle: 'सामान्य लक्षण',
      activeTokenTitle: 'आपका सक्रिय ओपीडी टोकन',
      noActiveToken: 'कोई सक्रिय बुकिंग नहीं है। डॉक्टर खोजने के लिए नीचे टैप करें।',
      nearestHospitalsTitle: 'वाइजाग में आपके निकटतम अस्पताल',
      locationLabel: 'आपका स्थान',
      disclaimer: 'यह केवल मार्गदर्शन है, औपचारिक चिकित्सीय निदान नहीं। आपातकाल में 108 डायल करें।',
    },
    symptoms: {
      fever: 'बुखार और ठंड',
      chestPain: 'सीने में दर्द / दबाव',
      childUnwell: 'बच्चों का स्वास्थ्य',
      pregnancy: 'गर्भावस्था और प्रसूति',
      injury: 'हड्डी / चोट',
      skin: 'त्वचा पर चकत्ते / खुजली',
      eye: 'आंखों में दर्द और दृष्टि',
      tooth: 'दांत का दर्द / दंत चिकित्सा',
      stomach: 'पेट दर्द / उल्टी',
      breathing: 'सांस लेने में कठिनाई',
    },
    triage: {
      analyzing: 'केयरकनेक्ट AI आपके लक्षणों का विश्लेषण कर रहा है...',
      title: 'प्राथमिक मूल्यांकन एवं स्वास्थ्य मार्गदर्शन',
      symptomsIdentified: 'पहचाने गए लक्षण',
      specialtyRecommended: 'अनुशंसित विशेषज्ञता',
      urgencyTitle: 'गंभीरता स्तर',
      emergency: 'आपातकालीन (तत्काल ध्यान आवश्यक)',
      urgent: 'अत्यावश्यक (24 घंटे में परामर्श लें)',
      routine: 'सामान्य (निर्धारित अपॉइंटमेंट)',
      listenToGuidance: 'मार्गदर्शन सुनें (ऑडियो)',
      emergencyBanner: 'महत्वपूर्ण चेतावनी: आपके लक्षण चिकित्सीय आपातकाल की ओर संकेत करते हैं। तुरंत निकटतम अस्पताल जाएं या 108 पर कॉल करें।',
      emergencyCall108: '108 एम्बुलेंस को कॉल करें',
      emergencyCall112: '112 आपातकालीन कॉल',
      topHospitalsTitle: 'अनुशंसित वाइजाग अस्पताल',
      reasonBadge: 'सिफारिश का कारण',
      viewDoctors: 'उपलब्ध डॉक्टर देखें',
      medicalDisclaimer: 'सूचना: यह केवल AI स्वास्थ्य मार्गदर्शन है और पेशेवर चिकित्सीय निदान का विकल्प नहीं है। आपातकाल में 108 पर कॉल करें।',
    },
    hospitals: {
      title: 'विशाखापत्तनम में अस्पताल',
      searchPlaceholder: 'अस्पताल, क्षेत्र या विभाग खोजें...',
      filterAll: 'सभी अस्पताल',
      filterEmergency: '24x7 आपातकालीन',
      filterGovt: 'सरकारी',
      filterPrivate: 'निजी',
      sortDistance: 'निकटतम पहले',
      sortWait: 'न्यूनतम प्रतीक्षा समय',
      sortRating: 'सर्वोच्च रेटिंग',
      listView: 'सूची',
      mapView: 'मानचित्र',
      noResults: 'आपकी खोज के अनुरूप कोई अस्पताल नहीं मिला।',
      openNow: 'खुला है',
      icuAvailable: 'ICU सुविधा',
      emergency247: '24x7 ट्रॉमा केयर',
      doctorsCount: 'डॉक्टर',
      patientsWaiting: 'प्रतीक्षारत',
    },
    hospitalDetail: {
      about: 'अवलोकन एवं सुविधाएं',
      departments: 'विशेषज्ञ विभाग',
      facilities: 'प्रमुख सुविधाएं',
      hours: 'ओपीडी समय',
      doctorsHeader: 'उपलब्ध डॉक्टर एवं लाइव ओपीडी स्थिति',
      howBookingWorksTitle: 'केयरकनेक्ट बुकिंग कैसे काम करती है',
      step1Title: '1. डॉक्टर और 20-मिनट का स्लॉट चुनें',
      step1Desc: 'उपलब्ध स्लॉट चुनें। अपनी बारी से कम से कम 15 मिनट पहले अस्पताल पहुंचें।',
      step2Title: '2. व्हाट्सएप पर तुरंत टोकन प्राप्त करें',
      step2Desc: 'अपना ओपीडी टोकन नंबर, क्यूआर कोड और लाइव अपडेट सीधे अपने मोबाइल पर प्राप्त करें।',
      step3Title: '3. घर से ही लाइव कतार ट्रैक करें',
      step3Desc: 'हम आपको सूचित करेंगे कि कब निकलना है, ताकि भीड़भाड़ वाले प्रतीक्षा कक्षों से बचा जा सके।',
    },
    doctorDetail: {
      qualification: 'योग्यता',
      experience: 'अनुभव',
      fee: 'परामर्श शुल्क',
      spokenLanguages: 'बोली जाने वाली भाषाएं',
      statusAvailable: 'उपलब्ध (परामर्श जारी)',
      statusBusy: 'प्रक्रिया / वार्ड राउंड में व्यस्त',
      statusUnavailable: 'अनुपलब्ध / बाहर',
      runningLateBanner: 'डॉ. {doctor} आज {min} मिनट की देरी से चल रहे हैं।',
      timelineTitle: 'आज का ओपीडी शेड्यूल',
      arrivesAt: 'अस्पताल आगमन',
      consultStarts: 'ओपीडी परामर्श शुरू',
      expectedDeparture: 'प्रस्थान समय',
      selectSlotTitle: 'ओपीडी स्लॉट चुनें (20-मिनट की खिड़की)',
      slotWindowRule: 'प्रत्येक स्लॉट 20 मिनट (~{avg} मिनट प्रति मरीज़). शुल्क: ₹{fee}.',
      slotRuleNote: 'उसी दिन के स्लॉट केवल तभी बुक किए जा सकते हैं जब वे वर्तमान समय से कम से कम 20 मिनट बाद शुरू हों।',
      avgTimePerPatient: '~{avg} मिनट / मरीज़',
      arriveEarlyNotice: 'कृपया अपने स्लॉट समय से 15 मिनट पहले अस्पताल पहुंचें।',
      bookSlotBtn: 'स्लॉट बुक करें और टोकन लें',
      slotAvailable: 'उपलब्ध',
      slotFull: 'भर गया',
      slotSelected: 'चयनित',
    },
    booking: {
      title: 'ओपीडी (OP) बुकिंग की पुष्टि करें',
      confirmDetails: 'अपॉइंटमेंट विवरण',
      patientName: 'मरीज़ का नाम',
      patientAge: 'उम्र',
      phoneLabel: 'मोबाइल नंबर',
      symptomSummary: 'स्वास्थ्य समस्या विवरण',
      whatsappConsentLabel: 'ओपीडी टोकन, लाइव प्रतीक्षा समय और यात्रा अलर्ट मेरे व्हाट्सएप पर भेजें',
      confirmBookingBtn: 'पुष्टि करें और ओपीडी टोकन पाएं',
      successTitle: 'अपॉइंटमेंट सफलतापूर्वक पक्का हुआ!',
      opTokenBadge: 'ओपीडी टोकन सं. #{token}',
      scanQrNotice: 'अस्पताल ओपीडी रिसेप्शन पर यह QR कोड दिखाएं',
      whatsappPreviewTitle: 'व्हाट्सएप संदेश पूर्वावलोकन',
      sendToMyWhatsapp: 'व्हाट्सएप में खोलें (wa.me)',
      addToCalendar: 'कैलेंडर में जोड़ें (.ics)',
      getDirections: 'मानचित्र पर दिशा-निर्देश पाएं',
      trackQueueBtn: 'लाइव ओपीडी कतार अभी ट्रैक करें',
    },
    liveQueue: {
      title: 'लाइव ओपीडी कतार ट्रैकर',
      nowServing: 'वर्तमान टोकन',
      yourToken: 'आपका टोकन',
      patientsAhead: 'आगे प्रतीक्षा कर रहे मरीज़',
      waitingTotal: 'कतार में कुल मरीज़',
      estimatedWait: 'अनुमानित प्रतीक्षा समय',
      expectedTurn: 'आपकी बारी का समय',
      arriveBy: 'अस्पताल पहुंचने का समय',
      leaveHomeBy: 'घर से निकलने का समय',
      statusRelax: 'घर पर आराम करें। यात्रा शुरू करने का समय होने पर हम सूचित करेंगे।',
      statusGetReady: 'तैयार हो जाएं। केवल कुछ ही मरीज़ आगे हैं।',
      statusStartNow: 'अभी निकलें! समय पर आराम से अस्पताल पहुंचने के लिए रवाना हों।',
      statusReached: 'अब आपको ओपीडी प्रतीक्षा क्षेत्र में होना चाहिए।',
      statusYourTurn: 'अब आपकी बारी है! कृपया कमरा सं. {room} में जाएं।',
      statusCompleted: 'आज का आपका परामर्श पूरा हो चुका है।',
      statusDelayed: 'परामर्श में {min} मिनट का विलंब है। समय समायोजित किया गया है।',
      statusDoctorBusy: 'डॉक्टर आपातकालीन कार्य में व्यस्त हैं ({reason})। कतार रुकी हुई है, आपकी बुकिंग सुरक्षित है।',
      statusDoctorUnavailable: 'डॉक्टर अनुपलब्ध हैं ({reason})। कृपया वैकल्पिक डॉक्टर चुनें।',
      rebookBtn: 'वैकल्पिक डॉक्टर चुनें',
    },
    rebook: {
      title: 'डॉक्टर अनुपलब्ध – वैकल्पिक डॉक्टर चुनें',
      doctorUnavailableDesc: 'डॉ. {doctor} इस कारण से अनुपलब्ध हैं: {reason}। आप प्रतीक्षा कर सकते हैं या बिना अपनी प्राथमिकता खोए तुरंत किसी अन्य विशेषज्ञ को चुन सकते हैं।',
      reasonLabel: 'अस्पताल द्वारा दर्ज कारण',
      keepWaitBtn: 'मेरी बुकिंग बनाए रखें और प्रतीक्षा करें',
      alternativeDoctorsTitle: 'वाइजाग में उसी विभाग के अन्य अनुशंसित डॉक्टर',
      moveSlotBtn: 'इस स्लॉट पर स्विच करें (1-टैप)',
      successMoved: 'सफलतापूर्वक डॉ. {doctor} पर स्विच किया गया! आपका नया टोकन #{token} है।',
    },
    alerts: {
      title: 'सूचनाएं और अलर्ट',
      tabInApp: 'ऐप अलर्ट',
      tabWhatsapp: 'व्हाट्सएप संदेश',
      enableNotifications: 'ध्वनि और डिवाइस सूचनाएं चालू करें',
      noAlerts: 'अभी कोई अलर्ट नहीं है। आपके टोकन से संबंधित सूचनाएं यहां दिखाई देंगी।',
      simulatedDisclaimer: 'हैकथॉन डेमो के लिए व्हाट्सएप संदेशों का अनुकरण किया गया है।',
      markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    },
    appointments: {
      title: 'मेरे ओपीडी अपॉइंटमेंट',
      emptyAppointments: 'इस मोबाइल नंबर पर कोई बुकिंग नहीं मिली।',
      reschedule: 'पुनर्निर्धारित करें',
      cancelAppointment: 'अपॉइंटमेंट रद्द करें',
      confirmCancel: 'क्या आप वाकई इस अपॉइंटमेंट को रद्द करना चाहते हैं?',
      cancelledBadge: 'रद्द',
      completedBadge: 'पूर्ण',
      activeBadge: 'पुष्ट',
    },
    settings: {
      title: 'सेटिंग्स और प्राथमिकताएं',
      language: 'ऐप की भाषा',
      location: 'मरीज़ का इलाका (वाइजाग)',
      simpleMode: 'सरल मोड (बड़ा टेक्स्ट और उच्च कंट्रास्ट)',
      simpleModeDesc: 'वरिष्ठ नागरिकों और त्वरित दृश्यता के लिए अनुकूलित',
      demoControls: 'सिमुलेशन घड़ी और गति',
      demoTime: 'अनुकरण समय',
      simSpeed: 'घड़ी की गति',
      pauseResume: 'रोकें / पुनः शुरू करें',
      advance15: '+15 मिनट आगे बढ़ाएं',
      resetDemoData: 'डेमो डेटा रीसेट करें',
      logoutBtn: 'लॉग आउट',
    },
    hospitalPortal: {
      title: 'अस्पताल प्रबंधन पोर्टल',
      portalName: 'ओपीडी कतार प्रबंधन प्रणाली',
      summaryTokensToday: 'आज जारी कुल टोकन',
      summaryCompleted: 'परामर्श पूर्ण',
      summaryWaiting: 'प्रतीक्षारत मरीज़',
      summaryDoctorsAvailable: 'सक्रिय डॉक्टर',
      summaryPatientsNotified: 'भेजे गए अलर्ट',
      tabLiveQueue: 'लाइव कतार',
      tabDoctors: 'डॉक्टर एवं शेड्यूल',
      tabAppointments: 'अपॉइंटमेंट्स',
      tabSentAlerts: 'भेजे गए अलर्ट का रिकॉर्ड',
      tabDemo: 'डेमो नियंत्रण',
      autoRunQueueLabel: 'ऑटो-रन कतार (डेमो सिमुलेशन)',
      autoRunQueueDesc: 'चालू होने पर कतार स्वतः आगे बढ़ती है। बंद होने पर स्टाफ के बटन दबाने पर ही बदलती है।',
      completeAndCallNext: 'पूर्ण करें और अगला बुलाएं',
      issueWalkInToken: 'वॉक-इन टोकन जारी करें',
      setServingToken: 'वर्तमान टोकन सेट करें',
      tokenBoardTitle: 'टोकन बोर्ड',
      filterTokenAll: 'सभी टोकन',
      markAvailable: 'उपलब्ध चिह्नित करें',
      markBusy: 'व्यस्त चिह्नित करें',
      markUnavailable: 'अनुपलब्ध चिह्नित करें',
      reasonPrompt: 'स्थिति परिवर्तन का कारण चुनें',
      delayConsultation: 'परामर्श में विलंब दर्ज करें',
      customMinutes: 'कस्टम मिनट',
      changeSchedule: 'आज का शेड्यूल संपादित करें',
      arrival: 'अस्पताल आगमन',
      consultStart: 'ओपीडी प्रारंभ समय',
      departure: 'प्रस्थान समय',
      saveAndNotify: 'सुरक्षित करें और मरीज़ों को सूचित करें',
      patientsAffectedWarning: '{count} बुक किए गए मरीज़ों को व्हाट्सएप और ऐप में तुरंत सूचित किया जाएगा।',
      patientsNotifiedToast: '{count} मरीज़ों को व्हाट्सएप और ऐप पर सूचित किया गया!',
    },
    templates: {
      bookingConfirmed: {
        title: 'ओपीडी अपॉइंटमेंट पक्का हुआ - टोकन #{token}',
        body: '{hospital} में डॉ. {doctor} ({specialty}) के साथ आपका स्लॉट {time} के लिए पक्का है। {arriveBy} तक पहुंचें।',
        whatsapp: 'आपकी केयरकनेक्ट ओपीडी अपॉइंटमेंट की पुष्टि हो गई है!\n\nअस्पताल: {hospital}\nडॉक्टर: डॉ. {doctor} ({specialty})\nदिनांक और समय: {date}, {time}\nटोकन संख्या: {token}\nआगे प्रतीक्षा कर रहे मरीज़: {ahead}\nअनुमानित प्रतीक्षा समय: {wait}\n\nकृपया {arriveBy} तक अस्पताल पहुंचें।\n\nआपकी बारी पास आने पर हम आपको सूचित करेंगे।\n\nकेयरकनेक्ट चुनने के लिए धन्यवाद!',
      },
      doctorArrivalExpected: {
        title: 'डॉक्टर आगमन की सूचना',
        body: 'डॉ. {doctor} के {time} तक {hospital} पहुंचने की संभावना है।',
        whatsapp: 'केयरकनेक्ट अपडेट: डॉ. {doctor} का {hospital} में आगमन समय {time} है। ओपीडी कतार जल्द शुरू होगी।',
      },
      doctorArrived: {
        title: 'डॉक्टर अस्पताल पहुंच चुके हैं',
        body: 'डॉ. {doctor} {hospital} पहुंच चुके हैं और परामर्श जल्द ही प्रारंभ होगा।',
        whatsapp: 'केयरकनेक्ट अलर्ट: डॉ. {doctor} {hospital} पहुंच चुके हैं। ओपीडी परामर्श शुरू हो रहा है।',
      },
      reminder60m: {
        title: '1 घंटे का अपॉइंटमेंट रिमाइंडर',
        body: 'आपका अपॉइंटमेंट लगभग 60 मिनट में है। कृपया {arriveBy} तक {hospital} पहुंचें।',
        whatsapp: 'केयरकनेक्ट रिमाइंडर: डॉ. {doctor} के साथ आपका अपॉइंटमेंट निकट है। कृपया {arriveBy} तक पहुंचें। वर्तमान प्रतीक्षा समय: {wait}.',
      },
      ahead5: {
        title: 'कतार आगे बढ़ रही है: केवल 5 मरीज़ आगे हैं',
        body: 'टोकन #{token} के आगे केवल 5 मरीज़ हैं। अनुमानित प्रतीक्षा समय: {wait}.',
        whatsapp: 'केयरकनेक्ट कतार अपडेट: {hospital} में आपके टोकन #{token} के आगे केवल 5 मरीज़ हैं। अनुमानित प्रतीक्षा समय: {wait}.',
      },
      startNow: {
        title: 'अब घर से निकलने का समय है!',
        body: 'ट्रैफ़िक और कतार के अनुसार आपको {arriveBy} तक {hospital} पहुंचने के लिए अभी निकलना चाहिए।',
        whatsapp: 'केयरकनेक्ट यात्रा अलर्ट: कृपया अभी {hospital} के लिए प्रस्थान करें! आपको {arriveBy} तक पहुंचना है। डॉक्टर: डॉ. {doctor}.',
      },
      turnApproaching: {
        title: 'आपकी बारी पास आ रही है!',
        body: 'टोकन #{token} के आगे केवल 2 मरीज़ हैं। कृपया कमरा सं. {room} के पास तैयार रहें।',
        whatsapp: 'केयरकनेक्ट अलर्ट: आपकी बारी पास है! {hospital} में टोकन #{token} के आगे केवल 2 मरीज़ हैं, कमरा सं. {room}.',
      },
      nowServing: {
        title: 'अब आपकी बारी है! - कमरा सं. {room}',
        body: 'टोकन #{token} को डॉ. {doctor} द्वारा कमरा सं. {room} में बुलाया जा रहा है।',
        whatsapp: 'केयरकनेक्ट तत्काल सूचना: टोकन #{token} - अब आपकी बारी है! कृपया {hospital} के कमरा सं. {room} में डॉ. {doctor} से मिलें।',
      },
      completed: {
        title: 'परामर्श पूर्ण हुआ',
        body: 'डॉ. {doctor} के साथ आपका परामर्श पूरा हो गया है। आपके शीघ्र स्वस्थ होने की कामना करते हैं!',
        whatsapp: '{hospital} में आने के लिए धन्यवाद। डॉ. {doctor} के साथ आपका परामर्श पूरा हुआ। अपना ध्यान रखें!',
      },
      docDelayed: {
        title: 'डॉक्टर के आगमन में विलंब',
        body: 'डॉ. {doctor} आज {delay} मिनट की देरी से हैं। नया अनुमानित समय {wait} है। {arriveBy} तक पहुंचें।',
        whatsapp: 'केयरकनेक्ट शेड्यूल नोटिस: {hospital} में डॉ. {doctor} {delay} मिनट की देरी से चल रहे हैं। नया अनुमानित समय: {wait}. कृपया {arriveBy} तक पहुंचें।',
      },
      docBusy: {
        title: 'डॉक्टर अस्थायी रूप से व्यस्त हैं ({reason})',
        body: 'डॉ. {doctor} आवश्यक कार्य में व्यस्त हैं ({reason})। कतार रुकी हुई है; आपका स्लॉट सुरक्षित है।',
        whatsapp: 'केयरकनेक्ट नोटिस: डॉ. {doctor} अस्थायी रूप से आपातकालीन मामले में व्यस्त हैं: {reason}। कतार कुछ समय के लिए रुकी है। आपकी बुकिंग सुरक्षित है।',
      },
      docUnavailable: {
        title: 'डॉक्टर अनुपलब्ध: वैकल्पिक चयन उपलब्ध',
        body: 'डॉ. {doctor} अनुपलब्ध हैं ({reason})। प्राथमिकता खोए बिना किसी अन्य डॉक्टर को चुनने के लिए केयरकनेक्ट खोलें।',
        whatsapp: 'केयरकनेक्ट महत्वपूर्ण अलर्ट: {hospital} में डॉ. {doctor} अनुपलब्ध हो गए हैं ({reason})। कृपया 1-टैप में उपलब्ध विशेषज्ञ चुनने के लिए ऐप खोलें: {link}',
      },
      docAvailable: {
        title: 'डॉक्टर उपलब्ध - कतार पुनः शुरू',
        body: 'डॉ. {doctor} वापस आ गए हैं और परामर्श पुनः शुरू हो गया है।',
        whatsapp: 'केयरकनेक्ट अपडेट: डॉ. {doctor} वापस आ गए हैं और परामर्श शुरू हो गया है। अनुमानित समय: {wait}.',
      },
    },
  },
};

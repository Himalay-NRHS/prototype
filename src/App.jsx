import { useState, useEffect } from 'react';
import { Menu, X, Calendar, Clock, MapPin, Users, Award, BookOpen, Download, ExternalLink, Search, Linkedin, Instagram } from 'lucide-react';
import ScrambledText from './ScrambledText';
import CircularGallery from './CircularGallery';
import LiquidChrome from './LiquidChrome';
import ElectricBorder from './ElectricBorder';

// Initialize window.storage if not exists
if (!window.storage) {
  window.storage = {
    get: (key) => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },
    set: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
}

/*
 * PHOTO FILE MANAGEMENT FOR MEMBERS & ALUMNI:
 * 
 * Members' photos are stored in components/members/{year} folders (1styear, 2ndyear, 3rdyear, 4thyear)
 * Alumni photos are stored in components/alumni/{batch} folders
 * Each photo is named as Full_Name.jpeg (e.g., John_Doe.jpeg)
 * 
 * To add a new member or alumnus:
 * 1. Save their JPEG photo in the appropriate year/batch folder
 * 2. Use their full name as the filename (e.g., John_Doe.jpeg)
 * 3. The site will automatically extract the name and display it
 * 
 * Example: components/members/3rdyear/Debarghya_Pramanik.jpeg
 */

// Initialize default data
const initializeData = () => {
  const existingData = window.storage.get('sigma-club-data');
  
  if (!existingData) {
    const defaultData = {
      events: [],
      memberPhotos: {
        '1st': [],
        '2nd': [],
        '3rd': [],
        '4th': []
      },
      alumniPhotos: {},
      alumni: [],
      timeline: [
        {
          year: '2025',
          events: [
            {
              id: 'browse-2025',
              title: '<b style="font-size: 1.2rem;">BROWSE 2025</b>',
              date: '20th May 2025',
              description: 'UI/UX printf conducted',
              image: ''
            },
            {
              id: 'envision-2025',
              title: '<b style="font-size: 1.2rem;">ENVISION 2025</b>',
              date: '19th November 2025',
              description: 'Annual technical fest',
              image: ''
            }
          ]
        }
      ],
      magazines: [],
      aboutImages: []
    };
    window.storage.set('sigma-club-data', defaultData);
    return defaultData;
  }
  
  return existingData;
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(initializeData());
  const [qrModal, setQrModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('upcoming');

  // Initialize data on component mount
  useEffect(() => {
    const initializeAppData = async () => {
      try {
        // First, get or initialize the data
        let currentData = window.storage.get('sigma-club-data');
        if (!currentData) {
          currentData = initializeData();
          window.storage.set('sigma-club-data', currentData);
        }
        
        // Then try to load photo data if available
        try {
          const response = await fetch('components/photo-data.json');
          if (response.ok) {
            const photoData = await response.json();
            
            // Merge photo data with existing data
            const updatedData = {
              ...currentData,
              memberPhotos: photoData.memberPhotos || currentData.memberPhotos,
              alumniPhotos: photoData.alumniPhotos || currentData.alumniPhotos,
              aboutImages: photoData.aboutImages || currentData.aboutImages,
              homeImages: photoData.homeImages || [],
              magazinePDFs: photoData.magazinePDFs || [],
              // Ensure timeline data is preserved
              timeline: currentData.timeline || []
            };
            
            window.storage.set('sigma-club-data', updatedData);
            setData(updatedData);
            console.log('✅ Data and photos loaded successfully!');
            return;
          }
        } catch (error) {
          console.log('ℹ️ Using manual photo data (run npm run scan to auto-generate)');
        }
        
        // If we get here, either photo data load failed or wasn't available
        // But we still want to ensure timeline data is set
        if (!currentData.timeline || currentData.timeline.length === 0) {
          const defaultData = initializeData();
          const updatedData = {
            ...currentData,
            timeline: defaultData.timeline
          };
          window.storage.set('sigma-club-data', updatedData);
          setData(updatedData);
        } else {
          setData(currentData);
        }
        
      } catch (error) {
        console.error('Error initializing app data:', error);
        // Fallback to just initializing the data
        const defaultData = initializeData();
        window.storage.set('sigma-club-data', defaultData);
        setData(defaultData);
      }
    };
    
    initializeAppData();
  }, []);

  // Countdown Timer Hook
  const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState('');
    
    useEffect(() => {
      const calculateTime = () => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;
        
        if (difference < 0) {
          setTimeLeft('Event Ended');
          return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };
      
      calculateTime();
      const interval = setInterval(calculateTime, 1000);
      return () => clearInterval(interval);
    }, [targetDate]);
    
    return timeLeft;
  };

  // QR Code Modal Component
  const QRModal = ({ event, onClose }) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(event.registrationLink)}`;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-800 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]" onClick={onClose}>
        <div className="bg-[#BBDEFB] backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border-2 border-[#0000FF] shadow-2xl animate-[fadeIn_0.3s_ease-in-out]" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-blue-900">{event.title}</h3>
            <button onClick={onClose} className="text-blue-900/80 hover:text-blue-900 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="bg-[#E3F2FD] rounded-xl p-4 mb-6 relative">
            <img src={qrUrl} alt="QR Code" className="w-full h-auto" />
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
          </div>
          <p className="text-center text-blue-900/90 text-lg mb-6">Scan to Register</p>
          <div className="flex gap-3">
            <a href={qrUrl} download={`${event.title}-QR.png`} className="flex-1 bg-[#0000CC] text-blue-900 py-3 px-4 rounded-lg font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <Download size={20} /> Download QR
            </a>
            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#90CAF9] text-blue-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={20} /> Open Form
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Event Card Component
  const EventCard = ({ event }) => {
    const countdown = useCountdown(event.date);
    const isUrgent = countdown.includes('d') && parseInt(countdown) < 7;
    const isVeryUrgent = countdown.includes('d') && parseInt(countdown) < 1;
    
    return (
      <div className="bg-[#BBDEFB] backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-[#0000FF] hover:transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
        {event.image && (
          <div className="relative h-48 overflow-hidden flex items-center justify-center bg-[#90CAF9]">
            <img src={event.image} alt={event.title} className="w-full h-full object-contain hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-3">{event.title}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-blue-900/80">
              <Calendar size={18} />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-900/80">
              <Clock size={18} />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-900/80">
              <MapPin size={18} />
              <span>{event.venue}</span>
            </div>
          </div>
          <p className="text-blue-900/70 mb-4 line-clamp-3">{event.description}</p>
          <div className={`text-center py-2 px-4 rounded-lg mb-4 font-mono font-bold ${isVeryUrgent ? 'bg-red-500/30 text-red-200' : isUrgent ? 'bg-yellow-500/30 text-yellow-200' : 'bg-blue-500/30 text-blue-200'}`}>
            {countdown}
          </div>
          {event.registrationLink && (
            <div className="flex gap-3">
              <button onClick={() => setQrModal(event)} className="flex-1 bg-[#0000CC] text-blue-900 py-2 px-4 rounded-lg font-semibold hover:brightness-110 transition-all">
                Register Now
              </button>
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#90CAF9] text-blue-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all text-center">
                Open Form
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Member Card Component
  const MemberCard = ({ member }) => {
    // Determine path based on whether it's a member (has year) or alumni (no year)
    // Normalize photo path: accept either a full relative path (e.g. 'components/...')
    // or just a filename (e.g. 'Name.jpeg'). Ensure it begins with a leading slash
    // and encode URI to handle spaces.
    let imagePath = '';
    if (member && member.photo) {
      const photoStr = (typeof member.photo === 'string' ? member.photo.trim() : '');
      if (photoStr.includes('/')) {
        imagePath = photoStr.startsWith('/') ? photoStr : `/${photoStr}`;
      } else {
        imagePath = member.year ? `/components/members/${member.year}year/${photoStr}` : `/components/alumni/${photoStr}`;
      }
      imagePath = encodeURI(imagePath);
    }
    
    return (
      <div className="bg-[#BBDEFB] backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-[#0000FF] hover:transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
        {member.photo && (
          <div className="relative h-64 overflow-hidden flex items-center justify-center bg-[#90CAF9]">
            <img src={imagePath} alt={member.name} className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 text-center">{member.name}</h3>
          {member.linkedin && (
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 w-full bg-[#0000CC] text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 transition-all"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    );
  };

  // Alumni Card Component
  const AlumniCard = ({ member }) => {
    const [flipped, setFlipped] = useState(false);
    // Normalize alumni image path similar to MemberCard. Accept full path or filename.
    let imagePath = '';
    if (member && member.photo) {
      const photoStr = (typeof member.photo === 'string' ? member.photo.trim() : '');
      if (photoStr.includes('/')) {
        // If path already contains folder info, ensure leading slash
        imagePath = photoStr.startsWith('/') ? photoStr : `/${photoStr}`;
      } else {
        imagePath = `/components/alumni/${member.batch}/${photoStr}`;
      }
      imagePath = encodeURI(imagePath);
    }
    
    return (
      <div className="relative h-80 perspective-1000" onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 bg-[#BBDEFB] backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-[#0000FF] hover:border-purple-500/50 transition-all backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
            {member.photo && (
              <div className="w-full h-56 flex items-center justify-center bg-[#90CAF9]">
                <img src={imagePath} alt={member.name} className="w-full h-full object-contain" />
              </div>
            )}
            <div className="p-4 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 w-full">
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="text-white/70 text-sm">Batch: {member.batch}</p>
              {member.currentRole && <p className="text-white/70 text-sm">{member.currentRole}</p>}
            </div>
          </div>
          <div className="absolute inset-0 bg-[#1565C0] backdrop-blur-lg rounded-2xl border-2 border-[#0000FF] flex items-center justify-center backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 text-blue-900 hover:scale-110 transition-transform">
              <Linkedin size={64} />
              <span className="text-lg font-semibold">View LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Typewriter Animation Hook
  const useTypewriter = (text, typingSpeed = 80) => {
    const [displayText, setDisplayText] = useState('');
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
      let timer;
      
      if (isPaused) {
        // Wait 10 seconds after typing complete, then blank instantly
        timer = setTimeout(() => {
          setDisplayText(''); // Instant blank
          setIsPaused(false);
        }, 10000);
      } else {
        if (displayText === text) {
          // Finished typing, pause for 10 seconds
          setIsPaused(true);
        } else {
          // Type one character
          timer = setTimeout(() => {
            setDisplayText(text.substring(0, displayText.length + 1));
          }, typingSpeed);
        }
      }

      return () => clearTimeout(timer);
    }, [displayText, isPaused, text, typingSpeed]);

    return displayText;
  };

  // Home Page
  const HomePage = () => {
    // Show only upcoming events
    const upcomingEvents = data.events.filter(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      return eventDate >= now;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get home images
    const homeImages = data.homeImages || [];

    return (
      <div className="animate-[fadeIn_0.5s_ease-in-out]">
        <div className="text-center mb-12">
          {/* Scrambled Text Animation */}
          <div className="mb-8 h-24 flex items-center justify-center">
            <p className="text-2xl md:text-3xl font-semibold text-white">
              <ScrambledText
                className="text-white"
                radius={100}
                duration={2.5}
                speed={0.5}
                scrambleChars=".:"
                loop={true}
                pauseDuration={5000}
              >
                Welcome to Sigma — the official newsletter of the Computer Science & Engineering Department
              </ScrambledText>
            </p>
          </div>
          
          {/* Instagram Follow Link */}
          <a 
            href="https://www.instagram.com/sigmacse/?hl=en" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-semibold hover:from-blue-600 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-lg mb-8 border-2 border-blue-900"
          >
            <Instagram size={24} />
            <span>Follow Us on Instagram</span>
          </a>
        </div>

        {/* Upcoming Events Section */}
        {homeImages.length > 0 && (
          <div className="mb-12 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Upcoming Events</h2>
            <div className="flex flex-col items-center gap-12 max-w-xl w-full">
              {homeImages.map((image, idx) => (
                <div key={idx} className="relative group flex flex-col items-center">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-600">
                    <img 
                      src={`/${image}`} 
                      alt={`Event ${idx + 1}`} 
                      className="max-w-full h-auto"
                      onError={(e) => {
                        console.error('Error loading image:', image, e);
                        e.target.src = '/placeholder-event.jpg'; // Fallback image
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <ElectricBorder color="#0000FF" speed={1.5} chaos={1.2} thickness={2}>
                      <a
                        href="https://forms.google.com/your-form-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 inline-block"
                      >
                        Register Now
                      </a>
                    </ElectricBorder>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    );
  };

  // About Page
  const AboutPage = () => {
    const aboutImages = data.aboutImages || [];
    
    return (
      <div className="animate-[fadeIn_0.5s_ease-in-out]">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-16 text-center">About Sigma</h1>
        
        {aboutImages.length > 0 && (
          <div className="flex flex-col items-center gap-8 mb-16">
            {aboutImages.map((image, idx) => (
              <div key={idx} className="relative w-full max-w-4xl h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl hover:transform hover:scale-105 transition-all duration-300 flex items-center justify-center bg-[#BBDEFB]">
                <img 
                  src={`/${image}`} 
                  alt={`Sigma Team ${idx + 1}`} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('Error loading about image:', image, e);
                    e.target.src = '/placeholder-team.jpg'; // Fallback image
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#BBDEFB] backdrop-blur-lg rounded-3xl p-8 md:p-12 border-2 border-[#0000FF] hover:transform hover:scale-[1.01] transition-all duration-300 shadow-2xl">
          <p className="text-blue-900/90 text-lg md:text-xl leading-relaxed text-justify">
            Sigma is the newsletter of Computer Science and Engineering department. It was started in the year of 2001. Team sigma was created to provide the students with updates and information about the latest trends and technology in the domain of computer science. Sigma currently consists of members. The basic idea to form this group was to incorporate any upcoming or latest technology at one place and make the students aware of all information and technology which is worth knowing for any student of a computer science background. Sigma team also conducts fun and interactive events for students for all years and all branches. It conducts a technical article writing contest for the students each year, from which three write ups will be selected and published in the edition and will be awarded with cash prizes.
          </p>
        </div>
      </div>
    );
  };

  // Members Page
  const MembersPage = () => {
    const [selectedYear, setSelectedYear] = useState('1st');
    const [searchTerm, setSearchTerm] = useState('');
    const years = ['1st', '2nd', '3rd', '4th'];
    
    // Helper function to extract name from filename
    const extractNameFromFilename = (filename) => {
      if (!filename) return '';
      // Get the last part of the path and remove the extension
      const nameWithoutExt = filename.split('/').pop().replace(/\.(jpeg|jpg|png|webp)$/i, '');
      // Replace any remaining underscores with spaces
      return nameWithoutExt.replace(/_/g, ' ');
    };
    
    // Generate members from photo list
    const yearPhotos = data.memberPhotos?.[selectedYear] || [];
    const allMembers = yearPhotos.map((photoPath, index) => {
      // Ensure the path is a string and clean it up
      const cleanPath = typeof photoPath === 'string' ? photoPath.trim() : '';
      
      // Create the full image URL (prepend with / to make it an absolute path from the public directory)
      const imageUrl = cleanPath ? `/${cleanPath}` : '';
      
      // Extract just the filename for the name
      const filename = cleanPath.split('/').pop() || '';
      
      // Extract the name from the filename
      const name = extractNameFromFilename(filename);
      
      return {
        id: `${selectedYear}-${index}`,
        name: name,
        year: selectedYear,
        photo: imageUrl,
        image: imageUrl,
        text: name
      };
    });

    // Filter members based on search
    const filteredMembers = searchTerm
      ? allMembers.filter(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allMembers;

    return (
      <div className="animate-[fadeIn_0.5s_ease-in-out]">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-12 text-center">Our Team</h1>
        
        {/* Year Selection */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {years.map(year => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setSearchTerm('');
              }}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedYear === year 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg' 
                  : 'bg-[#90CAF9] text-blue-900 hover:bg-blue-300'
              }`}
            >
              {year} Year
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" size={20} />
            <input
              type="text"
              placeholder="Search members by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-600 focus:outline-none text-blue-900 bg-white"
            />
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center text-white text-xl py-20">
            {searchTerm 
              ? `No members found matching "${searchTerm}"` 
              : selectedYear === '1st' 
                ? 'Still awaiting recruitment' 
                : `No members found in ${selectedYear} year`}
          </div>
        ) : (
          <CircularGallery
            items={filteredMembers}
            bend={3}
            textColor="#FFFFFF"
            borderRadius={0.05}
            font="bold 24px sans-serif"
            scrollSpeed={2}
            scrollEase={0.05}
          />
        )}
      </div>
    );
  };

  // Alumni Page
  const AlumniPage = () => {
    // Helper function to extract name from filename
    const extractNameFromFilename = (filename) => {
      const nameWithoutExt = filename.replace(/\.(jpeg|jpg|png|webp)$/i, '');
      return nameWithoutExt.replace(/_/g, ' ');
    };
    
    // Get alumni photos (simple array, no batches)
    const alumniPhotos = data.alumniPhotos || [];
    
    // Generate alumni from photo list
    const generatedAlumni = alumniPhotos.map((photo, index) => ({
      id: `alumni-${index}`,
      name: extractNameFromFilename(photo),
      photo: photo,
      linkedin: ''
    }));

    return (
      <div className="animate-[fadeIn_0.5s_ease-in-out]">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-12 text-center">Our Alumni</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {generatedAlumni.map(alumni => <MemberCard key={alumni.id} member={alumni} />)}
        </div>
      </div>
    );
  };

  // Timeline Page
  const TimelinePage = () => {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const targetDate = new Date('2025-11-19T00:00:00');
      const startDate = new Date('2025-05-20T00:00:00');
      
      const updateCountdown = () => {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff > 0) {
          setCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          });
          
          // Calculate progress (0-90%, never reaches 100%)
          const totalDuration = targetDate - startDate;
          const elapsed = now - startDate;
          const rawProgress = (elapsed / totalDuration) * 100;
          setProgress(Math.min(rawProgress * 0.9, 90)); // Cap at 90%
        }
      };
      
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }, []);

    const timelineEvents = [
      {
        id: 1,
        title: "Browse 2025: UI/UX print",
        date: "20th May 2025"
      },
      {
        id: 2,
        title: "Envision 2025",
        date: "19th November 2025"
      }
    ];

    return (
      <div className="animate-[fadeIn_0.5s_ease-in-out]">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">Our Journey</h1>
        
        {/* Countdown Timer */}
        <div className="max-w-2xl mx-auto mb-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Countdown to Envision 2025</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{countdown.days}</div>
              <div className="text-sm text-white/70">Days</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{countdown.hours}</div>
              <div className="text-sm text-white/70">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{countdown.minutes}</div>
              <div className="text-sm text-white/70">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{countdown.seconds}</div>
              <div className="text-sm text-white/70">Seconds</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Static blue line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-900/30"></div>
            
            {/* Animated white progress line */}
            <div 
              className="absolute left-8 top-0 w-1 bg-white shadow-lg shadow-white/50 transition-all duration-1000"
              style={{ height: `${progress}%` }}
            ></div>
            
            {/* Timeline events */}
            <div className="space-y-8">
              {timelineEvents.map((event, idx) => (
                <div key={event.id} className="relative pl-20">
                  {/* Circle marker */}
                  <div className={`absolute left-5 top-2 w-8 h-8 rounded-full border-4 shadow-lg transition-all duration-500 ${
                    idx === 0 ? 'bg-white border-white' : 'bg-blue-600 border-blue-400'
                  }`}></div>
                  
                  {/* Event card */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 hover:transform hover:scale-105 transition-all duration-300 shadow-xl">
                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-white/70 text-lg">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Magazines Page
  const MagazinesPage = () => {
    const [pdfViewer, setPdfViewer] = useState(null);
    
    // Helper function to extract title and year from filename
    const extractMagazineInfo = (filename) => {
      // Get just the filename without path
      const filenameOnly = filename.split('/').pop();
      // Remove the .pdf extension
      const nameWithoutExt = filenameOnly.replace(/\.pdf$/i, '');
      // Try to extract year (4 digits)
      const yearMatch = nameWithoutExt.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? yearMatch[0] : 'Unknown';
      return {
        title: nameWithoutExt,
        year: year
      };
    };
    
    // Generate magazines from PDF list
    const magazinePDFs = data.magazinePDFs || [];
    const generatedMagazines = magazinePDFs.map((pdf, index) => {
      const info = extractMagazineInfo(pdf);
      // Remove any existing 'components/magazines/' prefix to prevent duplication
      const cleanPdfPath = pdf.startsWith('components/magazines/') 
        ? pdf.substring('components/magazines/'.length) 
        : pdf;
      
      return {
        id: `mag-${index}`,
        filename: pdf,
        title: info.title,
        year: info.year,
        pdfPath: `/${pdf}` // The path already includes 'components/magazines/'
      };
    });

    return (
      <div className="animate-[fadeIn_0.5s_ease-in-out]">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">Magazines</h1>
        
        {generatedMagazines.length === 0 ? (
          <div className="text-center text-blue-900/60 text-xl py-20">No magazines available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedMagazines.map(magazine => (
              <div key={magazine.id} className="bg-[#BBDEFB] backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-[#0000FF] hover:transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden bg-[#1565C0]">
                  <iframe
                    src={`${magazine.pdfPath}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
                    className="w-full h-full pointer-events-none"
                    title={`${magazine.title} Preview`}
                    onError={(e) => {
                      console.error('Error loading PDF preview:', magazine.pdfPath, e);
                      e.target.src = '/placeholder-pdf.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-[#E3F2FD]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="text-blue-900" size={48} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{magazine.title}</h3>
                  <p className="text-blue-900/60 text-sm mb-4">Year: {magazine.year}</p>
                  <div className="flex gap-2">
                    <a
                      href={magazine.pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white text-blue-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-center flex items-center justify-center gap-2 border border-gray-200"
                      onClick={(e) => {
                        // Open in new tab
                        window.open(magazine.pdfPath, '_blank');
                        e.preventDefault();
                      }}
                    >
                      <ExternalLink size={18} />
                      View
                    </a>
                    <a
                      href={magazine.pdfPath}
                      download={magazine.filename.split('/').pop()}
                      className="flex-1 bg-[#90CAF9] text-blue-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Navigation
  const Navigation = () => {
    const menuItems = [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'members', label: 'Members' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'magazines', label: 'Magazines' }
    ];

    return (
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-blue-800 backdrop-blur-lg border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <img src="/SIGMA.png" alt="Sigma Logo" className="h-12 w-auto object-contain" />
            </div>
            
            <div className="hidden md:flex space-x-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all relative group ${
                    currentPage === item.id ? 'text-white' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all ${
                    currentPage === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-700 backdrop-blur-lg border-t border-blue-900 animate-[fadeIn_0.3s_ease-in-out]">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-6 py-3 font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-l-4 border-white'
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'members': return <MembersPage />;
      case 'timeline': return <TimelinePage />;
      case 'magazines': return <MagazinesPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LiquidChrome
        baseColor={[0.05, 0.1, 0.35]}
        speed={0.15}
        amplitude={0.2}
        frequencyX={2}
        frequencyY={2}
        interactive={true}
      />
      <div className="relative z-10">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {renderPage()}
        </main>
      </div>

      {qrModal && <QRModal event={qrModal} onClose={() => setQrModal(null)} />}
    </div>
  );
}

export default App;

/*
=== DATA MANAGEMENT INSTRUCTIONS ===

MEMBERS - AUTOMATIC NAME EXTRACTION:
The Members page automatically extracts names from photo filenames!

Step 1: Add photo to the appropriate year folder:
  Frontend/public/components/members/3rdyear/John_Doe.jpeg

Step 2: Register the filename in browser console (F12):
  const data = window.storage.get('sigma-club-data');
  data.memberPhotos['3rd'].push('John_Doe.jpeg');
  window.storage.set('sigma-club-data', data);
  location.reload();

The name "John Doe" will be automatically extracted and displayed!

NAMING RULES:
- Use underscores: John_Doe.jpeg → displays as "John Doe"
- Works with multiple names: Mary_Jane_Watson.jpeg → "Mary Jane Watson"
- Supported formats: .jpeg, .jpg, .png, .webp

ADD MULTIPLE MEMBERS AT ONCE:
const data = window.storage.get('sigma-club-data');
data.memberPhotos['3rd'].push('John_Doe.jpeg', 'Jane_Smith.jpeg', 'Bob_Wilson.jpeg');
window.storage.set('sigma-club-data', data);
location.reload();

VIEW CURRENT MEMBERS:
const data = window.storage.get('sigma-club-data');
console.log('1st Year:', data.memberPhotos['1st']);
console.log('2nd Year:', data.memberPhotos['2nd']);
console.log('3rd Year:', data.memberPhotos['3rd']);
console.log('4th Year:', data.memberPhotos['4th']);

REMOVE A MEMBER:
const data = window.storage.get('sigma-club-data');
data.memberPhotos['3rd'] = data.memberPhotos['3rd'].filter(photo => photo !== 'John_Doe.jpeg');
window.storage.set('sigma-club-data', data);
location.reload();

---

OTHER DATA MANAGEMENT:

1. ADD AN EVENT:
const data = window.storage.get('sigma-club-data');
data.events.push({
  id: Date.now(),
  title: "Tech Workshop 2025",
  date: "2025-12-15",
  time: "18:00",
  venue: "Main Auditorium",
  description: "Join us for an exciting tech workshop.",
  image: "data:image/jpeg;base64,...",
  registrationLink: "https://forms.google.com/..."
});
window.storage.set('sigma-club-data', data);
location.reload();

2. ADD AN ALUMNI:
const data = window.storage.get('sigma-club-data');
data.alumni.push({
  id: Date.now(),
  name: "Jane Smith",
  batch: "2020",
  photo: "Jane_Smith.jpeg",
  linkedin: "https://linkedin.com/in/janesmith",
  currentRole: "Software Engineer at Google"
});
window.storage.set('sigma-club-data', data);
location.reload();

3. ADD ABOUT IMAGES:
const data = window.storage.get('sigma-club-data');
data.aboutImages.push('new-team-photo.jpeg');
window.storage.set('sigma-club-data', data);
location.reload();

PHOTO LOCATIONS:
- Members: Frontend/public/components/members/{year}year/Name.jpeg
- Alumni: Frontend/public/components/alumni/{batch}/Name.jpeg
- About: Frontend/public/components/about/photo.jpeg
*/

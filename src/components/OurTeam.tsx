// src/components/OurTeam.tsx

import { Linkedin, Twitter, Globe, User } from 'lucide-react';

// You can replace the '#' with your actual social media links
const teamMembers = [
  {
    name: 'Shubham Deore',
    role: 'Developer',
    links: {
      linkedin: 'https://www.linkedin.com/in/shubham-deore-044b7b307?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
      twitter: 'https://github.com/login?client_id=Iv1.a84bfcae38835499&return_to=%2Flogin%2Foauth%2Fauthorize%3Fclient_id%3DIv1.a84bfcae38835499%26redirect_uri%3Dhttps%253A%252F%252Fclassroom.github.com%252Fauth%252Fgithub%252Fcallback%26response_type%3Dcode%26state%3D88d6d5aaa90ab4be0fdf8ab82fc77ffb8fd40b840269c0ef',
      website: 'https://www.instagram.com/shivam_deore_07?igsh=MTVka3BsY3Vxb2pqcg%3D%3D&utm_source=qr',
    },
  },
  {
    name: 'Krushnal Patil',
    role: 'Developer',
    links: {
      linkedin: 'https://www.linkedin.com/in/krushnal-patil-331811313/',
      twitter: '#',
      website: '#',
    },
  },
  {
    name: 'Bhupesh Patil',
    role: 'Developer',
    links: {
      linkedin: '#',
      twitter: '#',
      website: '#',
    },
  },
];

const OurTeam = () => {
  return (
    // 👇 THIS LINE IS UPDATED
    <section className="pt-24 pb-16 bg-gray-50 sm:pt-12 sm:pb-20 lg:pb-24">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Meet the talented individuals behind SmartFile AI
          </p>
        </div>

        {/* Team Member Cards Grid */}
        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              {/* Profile Icon */}
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full">
                <User className="w-12 h-12 text-white" />
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="mt-1 text-base text-gray-500">{member.role}</p>

              {/* Social Media Links */}
              <div className="flex justify-center mt-5 space-x-4">
                <a
                  href={member.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700"
                >
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={member.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href={member.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-800"
                >
                  <span className="sr-only">Website</span>
                  <Globe className="w-6 h-6" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
import React from 'react';

const LinkGroup = ({ title, links }) => {
  return (
    <div className="min-w-[120px]">
      <h4 className="text-lg font-bold mb-4">{title}</h4>
      {links.map((link, index) => (
        <a 
          key={index} 
          href={link.url} 
          className="block mb-2 text-sm opacity-80 transition-all hover:opacity-100 hover:text-green-400"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

const Footer = () => {
  const linkGroups = [
    {
      title: 'Platform',
      links: [
        { label: 'How It Works', url: '#how-it-works' },
        { label: 'Products', url: '#products' },
        { label: 'Marketplace', url: '#marketplace' },
        { label: 'For Producers', url: '#producers' },
        { label: 'For Investors', url: '#investors' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', url: '#documentation' },
        { label: 'White Paper', url: '#whitepaper' },
        { label: 'Blog', url: '#blog' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Tutorials', url: '#tutorials' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: '#about' },
        { label: 'Our Team', url: '#team' },
        { label: 'Partners', url: '#partners' },
        { label: 'Contact', url: '#contact' },
        { label: 'Press', url: '#press' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Use', url: '#terms' },
        { label: 'Privacy', url: '#privacy' },
        { label: 'Cookies', url: '#cookies' },
        { label: 'Compliance', url: '#compliance' }
      ]
    }
  ];

  const socialLinks = [
    { icon: 'fab fa-twitter', url: '#twitter' },
    { icon: 'fab fa-linkedin', url: '#linkedin' },
    { icon: 'fab fa-telegram', url: '#telegram' },
    { icon: 'fab fa-discord', url: '#discord' },
    { icon: 'fab fa-medium', url: '#medium' }
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-4">
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap justify-between gap-8 mb-12">
          <div className="flex-basis-[250px]">
            <img src="/assets/logo.svg" alt="SeedSafe" className="h-10 mb-4" />
            <p className="text-sm opacity-80 max-w-xs">
              Tokenization of future harvests and carbon credits on NERO Chain
            </p>
          </div>
          
          <div className="flex flex-wrap gap-10">
            {linkGroups.map((group, index) => (
              <LinkGroup 
                key={index} 
                title={group.title} 
                links={group.links} 
              />
            ))}
          </div>
          
          <div className="flex-basis-[250px]">
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-green-700"
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
            
            <h4 className="text-lg font-bold mb-2">Get Updates</h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-grow py-2 px-3 rounded-l-md border-none"
              />
              <button className="bg-green-700 text-white py-2 px-4 rounded-r-md hover:bg-green-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs opacity-70 mb-0">
            &copy; 2025 SeedSafe. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs opacity-70">
            <span>Powered by</span>
            <img src="/assets/nero-logo.svg" alt="NERO Chain" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
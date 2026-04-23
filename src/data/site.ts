export interface SiteData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  url: string;
  social: SocialLink[];
  footer: {
    copyright: string;
  };
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

const siteData: SiteData = {
  name: "Your Name",
  title: "Your Name — Game Developer",
  tagline: "Freelance Game Developer & Programmer",
  email: "you@example.com",
  phone: "",
  location: "City, Country",
  url: "https://yoursite.com",

  social: [
    {
      label: "GitHub",
      url: "https://github.com/yourname",
      icon: "github",
    },
    {
      label: "Itch.io",
      url: "https://yourname.itch.io",
      icon: "itchio",
    },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/yourname",
      icon: "linkedin",
    },
  ],

  footer: {
    copyright: "© 2024 Your Name. All rights reserved.",
  },
};

export default siteData;
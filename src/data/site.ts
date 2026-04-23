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
  name: "David Mindlin",
  title: "David Mindlin — Game Developer",
  tagline: "Freelance Game Developer & Programmer",
  email: "david64dev@protonmail.com",
  phone: "",
  location: "Los Angeles, California",
  url: "https://david64.dev",

  social: [
    {
      label: "GitHub",
      url: "https://github.com/dmind44",
      icon: "github",
    },
    {
      label: "Itch.io",
      url: "https://david064.itch.io/",
      icon: "itchio",
    },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/david-mindlin",
      icon: "linkedin",
    },
  ],

  footer: {
    copyright: "© 2024 David Mindlin. All rights reserved.",
  },
};

export default siteData;
